/**
 * Spacing, radius, sizing and motion tokens.
 * Luxury = space + silence: 24px screen margins, calm 300ms.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  /** Standard screen horizontal margin. */
  screen: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  card: 16,
  button: 16,
  pill: 999,
  sheet: 24,
} as const;

export const sizing = {
  buttonHeight: 56,
  tabBarHeight: 64,
  checkInButton: 68, // center raised tab — the biggest target
  hairline: 1,
} as const;

/** Neumorphic dual-shadow geometry. dark = bottom-right, light = top-left. */
export const neo = {
  dark: { offset: { width: 8, height: 8 }, radius: 16 },
  light: { offset: { width: -6, height: -6 }, radius: 12 },
} as const;

export const motion = {
  /** Screen slide + most transitions. Calm. */
  screen: 300,
  /** Button press feedback. */
  press: 150,
  /** The signature check-in seal stamp. */
  sealStamp: 450,
  pressScale: 0.98,
} as const;
