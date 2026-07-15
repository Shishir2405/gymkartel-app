import { create } from "zustand";

/**
 * Coach browse filters. Held client-side so the Filters screen can compose a
 * selection and hand it back to Browse on goBack (there is no server round-trip
 * for the selection itself). `specialty`, `femaleOnly` and `maxPricePaise` feed
 * the CoachesQuery variables directly; `minRating` is applied client-side.
 */

/** The specialties offered as filter chips. */
export const COACH_SPECIALTIES = [
  "Strength",
  "Fat loss",
  "Mobility",
  "Powerlifting",
  "Bodybuilding",
  "Rehab",
  "Endurance",
  "Nutrition",
] as const;

/** Price ceilings offered as filter chips, in paise. */
export const COACH_PRICE_STEPS_PAISE = [1_000_00, 2_000_00, 3_000_00, 5_000_00];

/** Minimum-rating chips. */
export const COACH_RATING_STEPS = [4.5, 4.0, 3.5];

interface CoachFiltersState {
  specialty: string | null;
  maxPricePaise: number | null;
  minRating: number | null;
  femaleOnly: boolean;
  set: (patch: Partial<CoachFiltersState>) => void;
  reset: () => void;
}

const initial = {
  specialty: null,
  maxPricePaise: null,
  minRating: null,
  femaleOnly: false,
};

export const useCoachFilters = create<CoachFiltersState>((set) => ({
  ...initial,
  set: (patch) => set(patch),
  reset: () => set(initial),
}));
