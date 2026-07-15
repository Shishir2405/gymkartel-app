import React from "react";
import { render } from "@testing-library/react-native";
import { LedgerRow } from "../TodayScreen";
import { WorkoutKind, type LedgerEntryRowFragment } from "@/graphql/generated/graphql";

function entry(overrides: Partial<LedgerEntryRowFragment["chip"]>, isPR = false): LedgerEntryRowFragment {
  return {
    __typename: "LedgerEntry",
    id: "e1",
    isPR,
    loggedByCoach: false,
    loggedAt: "2026-07-15T09:00:00.000Z",
    chip: {
      __typename: "WorkoutChip",
      kind: WorkoutKind.Strength,
      exercise: "bench",
      sets: 4,
      reps: 8,
      weightKg: 60,
      distanceKm: null,
      durationMin: null,
      uncertain: false,
      note: null,
      raw: "bench 4x8 60kg",
      ...overrides,
    },
  };
}

describe("LedgerRow", () => {
  it("renders the amber '?' marker when the parsed chip is uncertain", () => {
    const { getByText } = render(<LedgerRow entry={entry({ uncertain: true })} />);
    expect(getByText("?")).toBeTruthy();
    expect(getByText("Bench")).toBeTruthy();
  });

  it("omits the '?' marker for a confident chip and shows a PR badge", () => {
    const { queryByText, getByText } = render(<LedgerRow entry={entry({ uncertain: false }, true)} />);
    expect(queryByText("?")).toBeNull();
    expect(getByText("PR")).toBeTruthy();
    expect(getByText("60")).toBeTruthy();
  });
});
