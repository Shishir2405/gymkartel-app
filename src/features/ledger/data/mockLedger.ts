/**
 * Local mock data for the Ledger read screens (history + charts). There is no
 * server yet, so these stand in for the synced record. Kept plainly typed so a
 * real query can drop in later without touching the screens.
 */

export interface HistorySet {
  sets: number;
  reps: number;
  weightKg: number;
  /** ISO date of the session. */
  date: string;
}

export interface ExerciseHistory {
  exercise: string;
  history: HistorySet[];
}

export const MOCK_EXERCISE_HISTORY: ExerciseHistory[] = [
  {
    exercise: "Bench Press",
    history: [
      { sets: 4, reps: 8, weightKg: 60, date: "2026-07-14" },
      { sets: 4, reps: 8, weightKg: 57.5, date: "2026-07-10" },
      { sets: 5, reps: 5, weightKg: 55, date: "2026-07-06" },
      { sets: 4, reps: 8, weightKg: 52.5, date: "2026-07-01" },
    ],
  },
  {
    exercise: "Squat",
    history: [
      { sets: 5, reps: 5, weightKg: 100, date: "2026-07-13" },
      { sets: 5, reps: 5, weightKg: 97.5, date: "2026-07-08" },
      { sets: 5, reps: 5, weightKg: 95, date: "2026-07-03" },
    ],
  },
  {
    exercise: "Deadlift",
    history: [
      { sets: 3, reps: 5, weightKg: 130, date: "2026-07-12" },
      { sets: 3, reps: 5, weightKg: 125, date: "2026-07-05" },
    ],
  },
];

export interface MetricSeries {
  label: string;
  unit: string;
  points: { date: string; value: number }[];
}

/** Estimated 1RM for bench, session over session. */
export const MOCK_BENCH_1RM: MetricSeries = {
  label: "Bench 1RM",
  unit: "kg",
  points: [
    { date: "Jun 1", value: 64 },
    { date: "Jun 12", value: 66 },
    { date: "Jun 24", value: 69 },
    { date: "Jul 2", value: 71 },
    { date: "Jul 10", value: 73 },
    { date: "Jul 14", value: 76 },
  ],
};

/** Bodyweight trend. */
export const MOCK_BODYWEIGHT: MetricSeries = {
  label: "Bodyweight",
  unit: "kg",
  points: [
    { date: "Jun 1", value: 82.4 },
    { date: "Jun 12", value: 81.6 },
    { date: "Jun 24", value: 81.1 },
    { date: "Jul 2", value: 80.5 },
    { date: "Jul 10", value: 80.2 },
    { date: "Jul 14", value: 79.8 },
  ],
};
