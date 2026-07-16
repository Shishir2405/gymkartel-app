import {
  outboxReducer,
  emptyOutbox,
  dedupe,
  pendingItems,
  pendingCount,
  newIdempotencyKey,
  type OutboxItem,
  type NewOutboxItem,
} from "../outbox";

function makeNew(key: string, createdAt = "2026-07-15T10:00:00.000Z"): NewOutboxItem {
  return {
    idempotencyKey: key,
    gymCheckInCode: "gk-gym1",
    gymId: "gym1",
    gymName: "Iron House",
    scannedAt: createdAt,
    acceptedTopUp: false,
    createdAt,
  };
}

function makeItem(key: string, status: OutboxItem["status"] = "pending"): OutboxItem {
  return { ...makeNew(key), status, attempts: 0 };
}

describe("outbox reducer", () => {
  it("enqueues a pending item", () => {
    const s = outboxReducer(emptyOutbox, { type: "ENQUEUE", item: makeNew("a") });
    expect(s.items).toHaveLength(1);
    expect(s.items[0]?.status).toBe("pending");
    expect(s.items[0]?.attempts).toBe(0);
  });

  it("dedupes an offline retry with the same idempotency key", () => {
    let s = outboxReducer(emptyOutbox, { type: "ENQUEUE", item: makeNew("a") });
    s = outboxReducer(s, { type: "ENQUEUE", item: makeNew("a") });
    s = outboxReducer(s, { type: "ENQUEUE", item: makeNew("a") });
    expect(s.items).toHaveLength(1);
  });

  it("queues offline then flushes to synced online", () => {
    let s = outboxReducer(emptyOutbox, { type: "ENQUEUE", item: makeNew("a", "2026-07-15T10:00:00.000Z") });
    s = outboxReducer(s, { type: "ENQUEUE", item: makeNew("b", "2026-07-15T10:05:00.000Z") });
    expect(pendingCount(s)).toBe(2);

    const order = pendingItems(s).map((i) => i.idempotencyKey);
    expect(order).toEqual(["a", "b"]);

    for (const item of pendingItems(s)) {
      s = outboxReducer(s, { type: "BEGIN_SYNC", idempotencyKey: item.idempotencyKey });
      s = outboxReducer(s, { type: "SYNC_OK", idempotencyKey: item.idempotencyKey });
    }
    expect(pendingCount(s)).toBe(0);
    expect(s.items.every((i) => i.status === "synced")).toBe(true);

    s = outboxReducer(s, { type: "PRUNE_SYNCED" });
    expect(s.items).toHaveLength(0);
  });

  it("re-marks failed items pending and increments attempts for retry", () => {
    let s = outboxReducer(emptyOutbox, { type: "ENQUEUE", item: makeNew("a") });
    s = outboxReducer(s, { type: "BEGIN_SYNC", idempotencyKey: "a" });
    s = outboxReducer(s, { type: "SYNC_FAIL", idempotencyKey: "a" });
    expect(s.items[0]?.status).toBe("pending");
    expect(s.items[0]?.attempts).toBe(1);
    expect(pendingCount(s)).toBe(1);
  });

  it("hydrate dedupes persisted rows", () => {
    const s = outboxReducer(emptyOutbox, {
      type: "HYDRATE",
      items: [makeItem("a"), makeItem("a"), makeItem("b", "synced")],
    });
    expect(s.items).toHaveLength(2);
  });

  it("newIdempotencyKey is unique and >= 8 chars (contract minimum)", () => {
    const a = newIdempotencyKey();
    const b = newIdempotencyKey();
    expect(a).not.toEqual(b);
    expect(a.length).toBeGreaterThanOrEqual(8);
  });

  it("dedupe keeps the earliest entry per key", () => {
    const first = makeItem("a");
    const second = { ...makeItem("a"), gymName: "Other" };
    const out = dedupe([first, second]);
    expect(out).toHaveLength(1);
    expect(out[0]?.gymName).toBe("Iron House");
  });
});
