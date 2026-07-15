/**
 * Gym Kartel — "Soft-Dark Luxury" color tokens.
 * Exact hexes from the design system. Mirrors @gymkartel/tokens intent.
 *
 * RULES encoded here (do not fight them in screens):
 *  - accent.primary (#C0392B) is THE orange — exactly ONE element per screen.
 *  - accent.gold (#B8860B) is LOCKED to top-rank + Legend coaches only.
 *  - Neumorphism uses the shadow pair; text/icons are NEVER neumorphic.
 */
export const colors = {
  bg: {
    base: "#141416",
  },
  surface: {
    raised: "#1C1C1F",
    pressed: "#111113",
  },
  shadow: {
    // Neumorphic pair ~60% opacity.
    dark: "#0A0A0B",
    light: "#26262B",
  },
  accent: {
    primary: "#C0392B", // THE orange
    pressed: "#A93226",
    gold: "#B8860B", // LOCKED: #1 rank + Legend coaches only
  },
  text: {
    primary: "#F5F0EB",
    secondary: "#9A9A9E",
    disabled: "#55555A",
  },
  stroke: {
    hairline: "#2A2A2E", // 1px border on EVERY card
  },
  // Serious-screen palette (SOS / refunds / injuries / harassment): theme drops
  // to a plain, human, high-contrast surface. NOT the soft-dark luxury look.
  serious: {
    bg: "#0E0E10",
    surface: "#FFFFFF",
    text: "#141416",
    subtext: "#55555A",
    danger: "#C0392B",
    stroke: "#E2E2E5",
  },
  // Semantic support colors (used sparingly, never competing with the orange).
  support: {
    positive: "#3E7D5A",
    warning: "#B8860B",
    frost: "rgba(20,20,22,0.72)",
  },
} as const;

/** Neumorphic shadow opacity for the raised/pressed dual-shadow pair. */
export const NEO_SHADOW_OPACITY = 0.6;

export type ColorTokens = typeof colors;
