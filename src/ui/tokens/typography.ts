/**
 * Type tokens. Two families only:
 *  - Barlow Condensed SemiBold for NUMBERS (day counts, streaks, prices) — the
 *    big 40–64px figures that fill a card ("DAY 47").
 *  - Inter for everything else.
 * Max 3 text sizes per screen (golden rule 4).
 *
 * Font family names match the keys we load in ThemeProvider via expo-font.
 * If fonts fail to load we fall back to platform condensed/system so text still
 * renders — never blank.
 */
export const fontFamily = {
  numberBold: "BarlowCondensed_600SemiBold",
  numberFallback: "System",
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
} as const;

export const typePresets = {
  /** Hero figure — DAYS LEFT, streak count, price. Barlow Condensed. */
  displayXL: {
    fontFamily: fontFamily.numberBold,
    fontSize: 64,
    lineHeight: 64,
    letterSpacing: 0,
  },
  displayLarge: {
    fontFamily: fontFamily.numberBold,
    fontSize: 56,
    lineHeight: 56,
  },
  displayMedium: {
    fontFamily: fontFamily.numberBold,
    fontSize: 40,
    lineHeight: 42,
  },
  /** Title — screen and card titles. Inter SemiBold 20. */
  title: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 20,
    lineHeight: 26,
  },
  /** Body — 15. */
  body: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 15,
    lineHeight: 22,
  },
  /** Label — 12 uppercase, +4% letterspacing. */
  label: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.48, // ~4% of 12
    textTransform: "uppercase" as const,
  },
} as const;

export type TypePresetName = keyof typeof typePresets;
