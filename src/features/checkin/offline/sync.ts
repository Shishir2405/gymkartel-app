import { outboxDb } from "./db";
import { pendingItems, type OutboxItem, type OutboxState } from "./outbox";

/**
 * The sync engine. Flushes pending outbox items to the server one at a time,
 * oldest first. Injected `syncOne` keeps this testable without a live client.
 *
 * Guarantees:
 *  - never runs when offline (caller gates on connectivity)
 *  - dedupe is the server's job via idempotencyKey; we just don't double-send an
 *    item that is already "syncing"/"synced"
 *  - a failure re-marks the item pending (with an incremented attempt) so it is
 *    retried on the next pass — the check-in is never lost
 */
export interface SyncResult {
  attempted: number;
  succeeded: number;
  failed: number;
}

export type SyncOneResult =
  | { kind: "ok" }
  | { kind: "topUpRequired" }
  | { kind: "error" };

export type SyncOneFn = (item: OutboxItem) => Promise<SyncOneResult>;

export interface SyncCallbacks {
  onBegin?: (key: string) => void;
  onOk?: (key: string) => void;
  onFail?: (key: string) => void;
}

/**
 * Flush the given outbox state. Persists status changes to SQLite and reports
 * per-item transitions to the caller (which mirrors them into the store).
 */
export async function flushOutbox(
  state: OutboxState,
  syncOne: SyncOneFn,
  callbacks: SyncCallbacks = {},
): Promise<SyncResult> {
  const queue = pendingItems(state);
  let succeeded = 0;
  let failed = 0;

  for (const item of queue) {
    callbacks.onBegin?.(item.idempotencyKey);
    await outboxDb.setStatus(item.idempotencyKey, "syncing");
    try {
      const result = await syncOne(item);
      if (result.kind === "ok") {
        await outboxDb.setStatus(item.idempotencyKey, "synced");
        callbacks.onOk?.(item.idempotencyKey);
        succeeded += 1;
      } else {
        // topUpRequired or error -> leave for retry (top-up is resolved in UI).
        await outboxDb.setStatus(item.idempotencyKey, "pending", item.attempts + 1);
        callbacks.onFail?.(item.idempotencyKey);
        failed += 1;
      }
    } catch {
      await outboxDb.setStatus(item.idempotencyKey, "pending", item.attempts + 1);
      callbacks.onFail?.(item.idempotencyKey);
      failed += 1;
    }
  }

  await outboxDb.pruneSynced();
  return { attempted: queue.length, succeeded, failed };
}
