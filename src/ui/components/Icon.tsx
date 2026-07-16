import React from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { colors, spacing } from "../tokens";

export interface PhosphorIconProps {
  size?: number;
  color?: string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}
export type PhosphorIcon = React.ComponentType<PhosphorIconProps>;

export interface IconProps {
  icon: PhosphorIcon;
  size?: number;
  color?: string;
  weight?: PhosphorIconProps["weight"];
}

export function Icon({ icon: Glyph, size = 22, color = colors.text.primary, weight = "regular" }: IconProps) {
  return <Glyph size={size} color={color} weight={weight} />;
}

export interface IconButtonProps {
  icon: PhosphorIcon;
  onPress?: () => void;
  size?: number;
  color?: string;
  weight?: PhosphorIconProps["weight"];
  accessibilityLabel: string;
  style?: ViewStyle;
  testID?: string;
}

export function IconButton({
  icon,
  onPress,
  size = 24,
  color = colors.text.primary,
  weight = "regular",
  accessibilityLabel,
  style,
  testID,
}: IconButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      hitSlop={spacing.md}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.btn, style, pressed && { opacity: 0.6 }]}
    >
      <Icon icon={icon} size={size} color={color} weight={weight} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { alignItems: "center", justifyContent: "center" },
});
