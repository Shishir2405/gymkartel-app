import { create } from "zustand";
import type { Tier } from "@gymkartel/contracts";

/**
 * In-progress onboarding form. Client-only, held here until the final mutation
 * writes it to the server; then it is reset. This is exactly the kind of
 * "in-progress form" the brief assigns to Zustand (not the urql cache).
 */
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
  tier: "STANDARD" as Tier | null, // STANDARD pre-highlighted per spec
  zone: null,
  state: null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initial,
  set: (patch) => set(patch),
  reset: () => set(initial),
}));
