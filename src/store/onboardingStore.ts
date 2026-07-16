import { create } from "zustand";
import type { Tier } from "@gymkartel/contracts";

export type HealthGoal = "STRENGTH" | "FAT_LOSS" | "ENDURANCE" | "GENERAL";
export type Experience = "NEW" | "RETURNING" | "REGULAR";

interface OnboardingState {
  phone: string;
  name: string;
  avatarUri: string | null;
  goal: HealthGoal | null;
  experience: Experience | null;
  trainingDaysTarget: number;
  injuriesNote: string;
  tier: Tier | null;
  zone: string | null;
  state: string | null;

  set: (patch: Partial<OnboardingState>) => void;
  reset: () => void;
}

const initial = {
  phone: "",
  name: "",
  avatarUri: null,
  goal: null,
  experience: null,
  trainingDaysTarget: 4,
  injuriesNote: "",
  tier: "STANDARD" as Tier | null,
  zone: null,
  state: null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initial,
  set: (patch) => set(patch),
  reset: () => set(initial),
}));
