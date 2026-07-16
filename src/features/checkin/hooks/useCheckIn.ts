import { useCallback } from "react";
import { useOutboxStore } from "../../../store/outboxStore";
import { outboxDb } from "../offline/db";
import { newIdempotencyKey, type OutboxItem } from "../offline/outbox";

export interface EnqueueArgs {
  gymCheckInCode: string;
  gymId: string;
  gymName: string;
  acceptedTopUp: boolean;
  idempotencyKey?: string;
}

export interface EnqueuedCheckIn {
  item: OutboxItem;
}

export function useCheckIn() {
  const enqueue = useOutboxStore((s) => s.enqueue);

  const checkIn = useCallback(
    (args: EnqueueArgs): EnqueuedCheckIn => {
      const now = new Date().toISOString();
      const item: OutboxItem = {
        idempotencyKey: args.idempotencyKey ?? newIdempotencyKey(),
        gymCheckInCode: args.gymCheckInCode,
        gymId: args.gymId,
        gymName: args.gymName,
        scannedAt: now,
        acceptedTopUp: args.acceptedTopUp,
        status: "pending",
        attempts: 0,
        createdAt: now,
      };
      enqueue(item);
      void outboxDb.enqueue(item);
      return { item };
    },
    [enqueue],
  );

  return { checkIn };
}
