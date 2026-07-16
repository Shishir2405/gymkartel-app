import { outboxDb } from "./db";
import { pendingItems, type OutboxItem, type OutboxState } from "./outbox";

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
