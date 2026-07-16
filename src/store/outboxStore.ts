import { create } from "zustand";
import type { OutboxItem } from "../features/checkin/offline/outbox";

interface OutboxState {
  items: OutboxItem[];
  hydrate: (items: OutboxItem[]) => void;
  enqueue: (item: OutboxItem) => void;
  markSynced: (idempotencyKey: string) => void;
  markFailed: (idempotencyKey: string) => void;
  pendingCount: () => number;
}

export const useOutboxStore = create<OutboxState>((set, get) => ({
  items: [],
  hydrate: (items) => set({ items }),
  enqueue: (item) =>
    set((s) => {
      if (s.items.some((i) => i.idempotencyKey === item.idempotencyKey)) return s;
      return { items: [...s.items, item] };
    }),
  markSynced: (idempotencyKey) =>
    set((s) => ({
      items: s.items.map((i) =>
        i.idempotencyKey === idempotencyKey ? { ...i, status: "synced" } : i,
      ),
    })),
  markFailed: (idempotencyKey) =>
    set((s) => ({
      items: s.items.map((i) =>
        i.idempotencyKey === idempotencyKey
          ? { ...i, status: "pending", attempts: i.attempts + 1 }
          : i,
      ),
    })),
  pendingCount: () => get().items.filter((i) => i.status === "pending").length,
}));
