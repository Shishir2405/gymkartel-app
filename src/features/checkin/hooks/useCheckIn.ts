import { useCallback } from "react";
import { useOutboxStore } from "../../../store/outboxStore";
import { outboxDb } from "../offline/db";
import { newIdempotencyKey, type OutboxItem } from "../offline/outbox";

export interface EnqueueArgs {
  gymCheckInCode: string;
  gymId: string;
  gymName: string;
  acceptedTopUp: boolean;
}

export interface EnqueuedCheckIn {
  item: OutboxItem;
}

/**
 * Enqueue a check-in. This is the hard product requirement made concrete: it
 * writes locally and returns SYNCHRONOUSLY to the caller — the UI shows the seal
 * immediately. Persistence + sync are fire-and-forget. Nothing here awaits the
 * network.
 */
export function useCheckIn() {
  const enqueue = useOutboxStore((s) => s.enqueue);

  const checkIn = useCallback(
    (args: EnqueueArgs): EnqueuedCheckIn => {
      const now = new Date().toISOString();
      const item: OutboxItem = {
        idempotencyKey: newIdempotencyKey(),
        gymCheckInCode: args.gymCheckInCode,
        gymId: args.gymId,
        gymName: args.gymName,
        scannedAt: now,
        acceptedTopUp: args.acceptedTopUp,
        status: "pending",
        attempts: 0,
        createdAt: now,
      };
      // Mirror into the in-memory store immediately (drives banners/badges).
      enqueue(item);
      // Persist to SQLite without blocking (durable source of truth).
      void outboxDb.enqueue(item);
      return { item };
    },
    [enqueue],
  );

  return { checkIn };
}
