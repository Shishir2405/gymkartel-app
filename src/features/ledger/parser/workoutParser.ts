export type ChipKind = "exercise" | "sets" | "reps" | "weight" | "unknown";

export interface ParsedChip {
  kind: ChipKind;
  label: string;
  value: string;
  uncertain: boolean;
}

export interface ParsedWorkout {
  chips: ParsedChip[];
  exercise: string | null;
  sets: number | null;
  reps: number | null;
  weightKg: number | null;
}

const KNOWN_EXERCISES = [
  "bench",
  "squat",
  "deadlift",
  "press",
  "row",
  "curl",
  "pullup",
  "pull-up",
  "pushup",
  "push-up",
  "lunge",
  "plank",
  "ohp",
  "dip",
  "fly",
  "raise",
  "extension",
  "pulldown",
  "clean",
  "snatch",
];

export function parseWorkout(input: string): ParsedWorkout {
  const text = input.trim().toLowerCase();
  const chips: ParsedChip[] = [];
  let exercise: string | null = null;
  let sets: number | null = null;
  let reps: number | null = null;
  let weightKg: number | null = null;

  if (text.length === 0) {
    return { chips, exercise, sets, reps, weightKg };
  }

  const tokens = text.split(/\s+/);
  const exerciseWords: string[] = [];

  for (const token of tokens) {
    const sxr = token.match(/^(\d{1,2})[x×](\d{1,3})$/);
    if (sxr) {
      sets = Number.parseInt(sxr[1] ?? "", 10);
      reps = Number.parseInt(sxr[2] ?? "", 10);
      chips.push({ kind: "sets", label: `${sets} sets`, value: String(sets), uncertain: false });
      chips.push({ kind: "reps", label: `${reps} reps`, value: String(reps), uncertain: false });
      continue;
    }

    const w = token.match(/^(\d{1,4}(?:\.\d)?)(kg|kgs|lb|lbs)?$/);
    if (w && w[2]) {
      const raw = Number.parseFloat(w[1] ?? "0");
      const unit = w[2];
      weightKg = unit.startsWith("lb") ? Math.round(raw * 0.4536 * 10) / 10 : raw;
      chips.push({
        kind: "weight",
        label: `${weightKg} kg`,
        value: String(weightKg),
        uncertain: false,
      });
      continue;
    }

    if (/^\d{1,4}$/.test(token)) {
      chips.push({
        kind: "unknown",
        label: token,
        value: token,
        uncertain: true,
      });
      continue;
    }

    if (/^[a-z][a-z-]*$/.test(token)) {
      exerciseWords.push(token);
      continue;
    }

    chips.push({ kind: "unknown", label: token, value: token, uncertain: true });
  }

  if (exerciseWords.length > 0) {
    exercise = exerciseWords.join(" ");
    const recognized = exerciseWords.some((wpart) =>
      KNOWN_EXERCISES.some((known) => wpart.includes(known) || known.includes(wpart)),
    );
    chips.unshift({
      kind: "exercise",
      label: titleCase(exercise),
      value: exercise,
      uncertain: !recognized,
    });
  }

  return { chips, exercise, sets, reps, weightKg };
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w) => (w.length > 0 ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
}
