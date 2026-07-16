export interface ViewerPassLike {
  activePass?: { status: "ACTIVE" | "EXPIRED" | "EXHAUSTED" } | null;
}

export type HeroState = "hasPass" | "noPass";

export function selectHeroState(viewer: ViewerPassLike | null | undefined): HeroState {
  if (viewer?.activePass?.status === "ACTIVE") return "hasPass";
  return "noPass";
}
