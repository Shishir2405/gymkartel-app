import React from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { colors, spacing } from "../tokens";

/**
 * Icons are phosphor-react-native. They are ALWAYS flat — never rendered with
 * neumorphic shadows. Fill weight is reserved for the one active tab (the single
 * orange element on the tab bar); regular/light everywhere else.
 *
 * We type the icon as a component with phosphor's IconProps-ish shape so screens
 * pass `Icon={House}` from phosphor directly.
 */
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
}

/** Tappable icon with a generous hit target. */
export function IconButton({
  icon,
  onPress,
  size = 24,
  color = colors.text.primary,
  weight = "regular",
  accessibilityLabel,
  style,
}: IconButtonProps) {
  return (
    <Pressable
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
