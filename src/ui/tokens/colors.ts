export const colors = {
  bg: {
    base: "#141416",
  },
  surface: {
    raised: "#1C1C1F",
    pressed: "#111113",
  },
  shadow: {
    dark: "#0A0A0B",
    light: "#26262B",
  },
  accent: {
    primary: "#C0392B",
    pressed: "#A93226",
    gold: "#B8860B",
  },
  text: {
    primary: "#F5F0EB",
    secondary: "#9A9A9E",
    disabled: "#55555A",
  },
  stroke: {
    hairline: "#2A2A2E",
  },
  serious: {
    bg: "#0E0E10",
    surface: "#FFFFFF",
    text: "#141416",
    subtext: "#55555A",
    danger: "#C0392B",
    stroke: "#E2E2E5",
  },
  support: {
    positive: "#3E7D5A",
    warning: "#B8860B",
    frost: "rgba(20,20,22,0.72)",
  },
} as const;

export const NEO_SHADOW_OPACITY = 0.6;

export type ColorTokens = typeof colors;
