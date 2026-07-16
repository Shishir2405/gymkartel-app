import { create } from "zustand";

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

export const COACH_PRICE_STEPS_PAISE = [1_000_00, 2_000_00, 3_000_00, 5_000_00];

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
