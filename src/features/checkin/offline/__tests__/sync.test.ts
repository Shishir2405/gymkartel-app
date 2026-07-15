import { flushOutbox, type SyncOneFn } from "../sync";
import type { OutboxItem, OutboxState } from "../outbox";

// Mock the SQLite layer — the sync engine's persistence side effects.
jest.mock("../db", () => ({
  outboxDb: {
    setStatus: jest.fn(async () => undefined),
    pruneSynced: jest.fn(async () => undefined),
    enqueue: jest.fn(async () => undefined),
    all: jest.fn(async () => []),
  },
}));

import { outboxDb } from "../db";

function item(key: string, createdAt: string): OutboxItem {
  return {
    idempotencyKey: key,
    gymCheckInCode: "gk-gym1",
    gymId: "gym1",
    gymName: "Iron House",
    scannedAt: createdAt,
    acceptedTopUp: false,
    status: "pending",
    attempts: 0,
    createdAt,
  };
}

describe("flushOutbox", () => {
  beforeEach(() => jest.clearAllMocks());

  it("flushes pending items oldest-first and marks them synced", async () => {
    const state: OutboxState = {
      items: [
        item("b", "2026-07-15T10:05:00.000Z"),
        item("a", "2026-07-15T10:00:00.000Z"),
      ],
    };
    const seen: string[] = [];
    const syncOne: SyncOneFn = async (i) => {
      seen.push(i.idempotencyKey);
      return { kind: "ok" };
    };

    const result = await flushOutbox(state, syncOne);

    expect(seen).toEqual(["a", "b"]); // oldest first
    expect(result).toEqual({ attempted: 2, succeeded: 2, failed: 0 });
    expect(outboxDb.setStatus).toHaveBeenCalledWith("a", "synced");
    expect(outboxDb.pruneSynced).toHaveBeenCalledTimes(1);
  });

  it("keeps failed items for retry (pending + attempts bump)", async () => {
    const state: OutboxState = { items: [item("a", "2026-07-15T10:00:00.000Z")] };
    const syncOne: SyncOneFn = async () => ({ kind: "error" });

    const result = await flushOutbox(state, syncOne);

    expect(result.failed).toBe(1);
    expect(outboxDb.setStatus).toHaveBeenCalledWith("a", "pending", 1);
  });

  it("does not lose a check-in when syncOne throws", async () => {
    const state: OutboxState = { items: [item("a", "2026-07-15T10:00:00.000Z")] };
    const syncOne: SyncOneFn = async () => {
      throw new Error("network dropped mid-flush");
    };

    const result = await flushOutbox(state, syncOne);

    expect(result.failed).toBe(1);
    expect(outboxDb.setStatus).toHaveBeenCalledWith("a", "pending", 1);
  });

  it("top-up-required leaves the item pending (resolved in UI, not dropped)", async () => {
    const state: OutboxState = { items: [item("a", "2026-07-15T10:00:00.000Z")] };
    const syncOne: SyncOneFn = async () => ({ kind: "topUpRequired" });

    const result = await flushOutbox(state, syncOne);

    expect(result.failed).toBe(1);
    expect(outboxDb.setStatus).toHaveBeenCalledWith("a", "pending", 1);
  });

  it("only touches pending items, not already-synced ones", async () => {
    const synced = { ...item("done", "2026-07-15T09:00:00.000Z"), status: "synced" as const };
    const state: OutboxState = { items: [synced, item("a", "2026-07-15T10:00:00.000Z")] };
    const seen: string[] = [];
    const syncOne: SyncOneFn = async (i) => {
      seen.push(i.idempotencyKey);
      return { kind: "ok" };
    };

    await flushOutbox(state, syncOne);

    expect(seen).toEqual(["a"]);
  });
});
