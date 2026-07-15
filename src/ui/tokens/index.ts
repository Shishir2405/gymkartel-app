export { colors, NEO_SHADOW_OPACITY } from "./colors";
export type { ColorTokens } from "./colors";
export { fontFamily, typePresets } from "./typography";
export type { TypePresetName } from "./typography";
export { spacing, radius, sizing, neo, motion } from "./spacing";

import { colors } from "./colors";
import { typePresets, fontFamily } from "./typography";
import { spacing, radius, sizing, neo, motion } from "./spacing";

/** The full token bundle, consumed by ThemeProvider and any Storybook. */
export const tokens = {
  colors,
  typePresets,
  fontFamily,
  spacing,
  radius,
  sizing,
  neo,
  motion,
} as const;

export type Tokens = typeof tokens;
