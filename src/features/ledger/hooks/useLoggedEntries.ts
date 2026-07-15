import { create } from "zustand";
import type { ParsedWorkout } from "@/features/ledger/parser/workoutParser";

/**
 * The Ledger's in-memory log. Client-only: entries written from the LogWorkout
 * screen live here for the session so Today can show what was logged. This is
 * NOT server state — it is a local stand-in until the sync mutation exists.
 */
export interface LoggedEntry {
  id: string;
  raw: string;
  exercise: string | null;
  sets: number | null;
  reps: number | null;
  weightKg: number | null;
  loggedAt: number;
}

interface LoggedState {
  entries: LoggedEntry[];
  add: (raw: string, parsed: ParsedWorkout) => void;
  remove: (id: string) => void;
}

export const useLoggedEntries = create<LoggedState>((set) => ({
  entries: [],
  add: (raw, parsed) =>
    set((s) => ({
      entries: [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          raw,
          exercise: parsed.exercise,
          sets: parsed.sets,
          reps: parsed.reps,
          weightKg: parsed.weightKg,
          loggedAt: Date.now(),
        },
        ...s.entries,
      ],
    })),
  remove: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
}));

/** True when the entry was logged on the current calendar day. */
export function isToday(ts: number): boolean {
  const d = new Date(ts);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
