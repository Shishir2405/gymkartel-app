import React from "react";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { colors, typePresets, type TypePresetName } from "../tokens";

type ColorKey = "primary" | "secondary" | "disabled" | "accent" | "gold" | "onAccent";

const COLOR_MAP: Record<ColorKey, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  disabled: colors.text.disabled,
  accent: colors.accent.primary,
  gold: colors.accent.gold,
  onAccent: colors.text.primary,
};

export interface TextProps extends RNTextProps {
  preset?: TypePresetName;
  color?: ColorKey;
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

export function Text({
  preset = "body",
  color = "primary",
  align,
  style,
  children,
  ...rest
}: TextProps) {
  return (
    <RNText
      allowFontScaling
      style={[
        typePresets[preset],
        { color: COLOR_MAP[color] },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
