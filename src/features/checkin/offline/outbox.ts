/**
 * The offline check-in outbox — pure logic, no I/O. This is the single most
 * important piece of the app: a scan is queued locally and the UI returns
 * immediately; sync happens later. Everything here is deterministic and unit
 * tested (queue offline -> flush online -> dedupe).
 */

export type OutboxStatus = "pending" | "syncing" | "synced" | "failed";

export interface OutboxItem {
  /** Generated on-device at scan time; the server dedupes on this. */
  idempotencyKey: string;
  gymCheckInCode: string;
  gymId: string;
  gymName: string;
  /** Client-authoritative scan time — offline-safe. */
  scannedAt: string;
  acceptedTopUp: boolean;
  status: OutboxStatus;
  attempts: number;
  createdAt: string;
}

export interface OutboxState {
  items: OutboxItem[];
}

export type OutboxEvent =
  | { type: "ENQUEUE"; item: NewOutboxItem }
  | { type: "BEGIN_SYNC"; idempotencyKey: string }
  | { type: "SYNC_OK"; idempotencyKey: string }
  | { type: "SYNC_FAIL"; idempotencyKey: string }
  | { type: "PRUNE_SYNCED" }
  | { type: "HYDRATE"; items: OutboxItem[] };

export interface NewOutboxItem {
  idempotencyKey: string;
  gymCheckInCode: string;
  gymId: string;
  gymName: string;
  scannedAt: string;
  acceptedTopUp: boolean;
  createdAt: string;
}

export const emptyOutbox: OutboxState = { items: [] };

/**
 * Pure reducer. Enqueue is idempotent on idempotencyKey (an offline scan that
 * is retried collapses to one item — matches the server's dedupe key).
 */
export function outboxReducer(state: OutboxState, event: OutboxEvent): OutboxState {
  switch (event.type) {
    case "HYDRATE":
      return { items: dedupe(event.items) };

    case "ENQUEUE": {
      if (state.items.some((i) => i.idempotencyKey === event.item.idempotencyKey)) {
        return state; // dedupe
      }
      const item: OutboxItem = {
        ...event.item,
        status: "pending",
        attempts: 0,
      };
      return { items: [...state.items, item] };
    }

    case "BEGIN_SYNC":
      return mapItem(state, event.idempotencyKey, (i) => ({ ...i, status: "syncing" }));

    case "SYNC_OK":
      return mapItem(state, event.idempotencyKey, (i) => ({ ...i, status: "synced" }));

    case "SYNC_FAIL":
      return mapItem(state, event.idempotencyKey, (i) => ({
        ...i,
        status: "pending",
        attempts: i.attempts + 1,
      }));

    case "PRUNE_SYNCED":
      return { items: state.items.filter((i) => i.status !== "synced") };

    default:
      return state;
  }
}

function mapItem(
  state: OutboxState,
  key: string,
  fn: (i: OutboxItem) => OutboxItem,
): OutboxState {
  return { items: state.items.map((i) => (i.idempotencyKey === key ? fn(i) : i)) };
}

/** Keep the earliest item per idempotencyKey. */
export function dedupe(items: OutboxItem[]): OutboxItem[] {
  const seen = new Map<string, OutboxItem>();
  for (const item of items) {
    if (!seen.has(item.idempotencyKey)) seen.set(item.idempotencyKey, item);
  }
  return [...seen.values()];
}

/** The items a sync pass should attempt, oldest first. */
export function pendingItems(state: OutboxState): OutboxItem[] {
  return state.items
    .filter((i) => i.status === "pending")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function pendingCount(state: OutboxState): number {
  return state.items.filter((i) => i.status === "pending").length;
}

/** Generate a device-unique idempotency key (>= 8 chars per the contract). */
export function newIdempotencyKey(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `ci_${Date.now().toString(36)}_${rand}`;
}
