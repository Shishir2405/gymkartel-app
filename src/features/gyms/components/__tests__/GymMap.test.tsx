import React from "react";
import { render } from "@testing-library/react-native";
import { GymMap, GymMapFallback } from "../GymMap";
import { gymCoords, DEFAULT_MAP_CENTER } from "@/features/gyms/lib/gymCoords";

const MARKERS = [
  { id: "gym-1", name: "Iron Republic" },
  { id: "gym-2", name: "Kartel Strength" },
];

describe("GymMap", () => {
  it("renders a marker for every gym (react-native-maps mocked)", () => {
    const { getByTestId } = render(<GymMap markers={MARKERS} selectedGymId="gym-1" />);
    expect(getByTestId("gym-marker-gym-1")).toBeTruthy();
    expect(getByTestId("gym-marker-gym-2")).toBeTruthy();
  });

  it("renders the calm fallback when native maps are absent", () => {
    const { getByText } = render(
      <GymMapFallback body="Live map opens in the dev-client build." />,
    );
    expect(getByText(/Live map opens/i)).toBeTruthy();
  });
});

describe("gymCoords", () => {
  it("is deterministic for a given gym id", () => {
    expect(gymCoords("gym-1")).toEqual(gymCoords("gym-1"));
  });

  it("scatters distinct gyms to distinct points around the centre", () => {
    const a = gymCoords("gym-1");
    const b = gymCoords("gym-2");
    expect(a).not.toEqual(b);
    // Within a few km of the default centre.
    expect(Math.abs(a.latitude - DEFAULT_MAP_CENTER.latitude)).toBeLessThan(0.05);
    expect(Math.abs(a.longitude - DEFAULT_MAP_CENTER.longitude)).toBeLessThan(0.05);
  });
});
