import { useCallback, useEffect, useRef } from "react";
import { useClient } from "urql";
import { useUiStore } from "../../../store/uiStore";
import { useOutboxStore } from "../../../store/outboxStore";
import { outboxDb } from "../offline/db";
import { flushOutbox, type SyncOneFn } from "../offline/sync";
import {
  SyncCheckInDocument,
  type SyncCheckInMutation,
  type SyncCheckInMutationVariables,
} from "../../../graphql/generated/graphql";

export function useOutboxSync() {
  const client = useClient();
  const isOnline = useUiStore((s) => s.isOnline);
  const hydrate = useOutboxStore((s) => s.hydrate);
  const markSynced = useOutboxStore((s) => s.markSynced);
  const markFailed = useOutboxStore((s) => s.markFailed);
  const running = useRef(false);

  useEffect(() => {
    void outboxDb.all().then(hydrate);
  }, [hydrate]);

  const syncOne: SyncOneFn = useCallback(
    async (item) => {
      const result = await client
        .mutation<SyncCheckInMutation, SyncCheckInMutationVariables>(
          SyncCheckInDocument,
          {
            input: {
              gymCheckInCode: item.gymCheckInCode,
              scannedAt: item.scannedAt,
              idempotencyKey: item.idempotencyKey,
              acceptedTopUp: item.acceptedTopUp,
            },
          },
        )
        .toPromise();

      if (result.error) return { kind: "error" };
      const data = result.data?.syncCheckIn;
      if (data?.topUpRequired) return { kind: "topUpRequired" };
      if (data?.checkIn) return { kind: "ok" };
      return { kind: "error" };
    },
    [client],
  );

  const flush = useCallback(async () => {
    if (running.current || !isOnline) return;
    running.current = true;
    try {
      const state = { items: useOutboxStore.getState().items };
      await flushOutbox(state, syncOne, {
        onOk: markSynced,
        onFail: markFailed,
      });
    } finally {
      running.current = false;
    }
  }, [isOnline, syncOne, markSynced, markFailed]);

  useEffect(() => {
    if (isOnline) void flush();
  }, [isOnline, flush]);

  useEffect(() => {
    const id = setInterval(() => void flush(), 30_000);
    return () => clearInterval(id);
  }, [flush]);

  return { flush };
}
