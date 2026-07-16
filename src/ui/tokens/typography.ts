export const fontFamily = {
  numberBold: "BarlowCondensed_600SemiBold",
  numberFallback: "System",
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
} as const;

export const typePresets = {
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
  title: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 20,
    lineHeight: 26,
  },
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
  label: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.48,
    textTransform: "uppercase" as const,
  },
} as const;

export type TypePresetName = keyof typeof typePresets;
