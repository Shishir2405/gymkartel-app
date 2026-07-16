import { create } from "zustand";

interface UiState {
  activeTab: "Home" | "Gyms" | "CheckIn" | "Track" | "Club";
  setActiveTab: (t: UiState["activeTab"]) => void;

  peekOtherTiers: boolean;
  togglePeek: () => void;

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
