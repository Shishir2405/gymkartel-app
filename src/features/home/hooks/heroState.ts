/**
 * Pure selector for the Home hero swap (has-pass vs no-pass). Extracted so the
 * single most user-visible branch on Home is unit-tested independently of the
 * network and rendering.
 */
export interface ViewerPassLike {
  activePass?: { status: "ACTIVE" | "EXPIRED" | "EXHAUSTED" } | null;
}

export type HeroState = "hasPass" | "noPass";

export function selectHeroState(viewer: ViewerPassLike | null | undefined): HeroState {
  if (viewer?.activePass?.status === "ACTIVE") return "hasPass";
  return "noPass";
}
