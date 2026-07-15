import { parseWorkout } from "../workoutParser";

describe("parseWorkout", () => {
  it("parses 'bench 4x8 60kg' into exercise, sets, reps, weight", () => {
    const r = parseWorkout("bench 4x8 60kg");
    expect(r.exercise).toBe("bench");
    expect(r.sets).toBe(4);
    expect(r.reps).toBe(8);
    expect(r.weightKg).toBe(60);
    const kinds = r.chips.map((c) => c.kind);
    expect(kinds).toContain("exercise");
    expect(kinds).toContain("sets");
    expect(kinds).toContain("reps");
    expect(kinds).toContain("weight");
    expect(r.chips.every((c) => !c.uncertain || c.kind === "unknown")).toBe(true);
  });

  it("supports the × unicode separator", () => {
    const r = parseWorkout("squat 5×5 100kg");
    expect(r.sets).toBe(5);
    expect(r.reps).toBe(5);
    expect(r.weightKg).toBe(100);
  });

  it("converts pounds to kg", () => {
    const r = parseWorkout("deadlift 3x5 135lb");
    expect(r.weightKg).toBeCloseTo(61.2, 1);
  });

  it("flags a bare ambiguous number as uncertain (never a silent guess)", () => {
    const r = parseWorkout("bench 60");
    const uncertain = r.chips.filter((c) => c.uncertain);
    expect(uncertain.length).toBeGreaterThan(0);
    expect(uncertain.some((c) => c.value === "60")).toBe(true);
  });

  it("marks an unknown exercise word uncertain", () => {
    const r = parseWorkout("frobnicate 3x10");
    const ex = r.chips.find((c) => c.kind === "exercise");
    expect(ex?.uncertain).toBe(true);
  });

  it("returns empty for empty input", () => {
    const r = parseWorkout("   ");
    expect(r.chips).toHaveLength(0);
    expect(r.exercise).toBeNull();
  });

  it("puts the exercise chip first for reading order", () => {
    const r = parseWorkout("row 4x8 50kg");
    expect(r.chips[0]?.kind).toBe("exercise");
  });
});
