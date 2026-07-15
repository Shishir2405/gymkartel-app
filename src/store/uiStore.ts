import { create } from "zustand";

/**
 * Client-only UI flags. NOT server state (that lives in the urql cache) and NOT
 * the onboarding form (its own store). Just ephemeral UI concerns.
 */
interface UiState {
  activeTab: "Home" | "Gyms" | "CheckIn" | "Track" | "Club";
  setActiveTab: (t: UiState["activeTab"]) => void;

  /** Whether the viewer is browsing gyms outside their tier (peek toggle). */
  peekOtherTiers: boolean;
  togglePeek: () => void;

  /** Network reachability mirror (updated by the connectivity hook). */
  isOnline: boolean;
  setOnline: (online: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeTab: "Home",
  setActiveTab: (activeTab) => set({ activeTab }),
  peekOtherTiers: false,
  togglePeek: () => set((s) => ({ peekOtherTiers: !s.peekOtherTiers })),
  isOnline: true,
  setOnline: (isOnline) => set({ isOnline }),
}));
