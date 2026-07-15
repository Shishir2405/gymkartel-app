import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors, motion, radius, sizing, spacing } from "../tokens";
import { haptics } from "../../lib/haptics";
import { Text } from "./Text";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** Icon rendered before the label (flat, never neumorphic). */
  icon?: React.ReactNode;
  fullWidth?: boolean;
  testID?: string;
}

/**
 * The four button variants, each with rest / pressed / disabled states.
 *
 * PRIMARY — the ONE orange element allowed per screen: flat blood-orange fill,
 *   off-white text, radius 16, height 56, soft orange glow. On press it darkens
 *   to #A93226, the glow collapses, it sinks in and scales to 0.98 with a light
 *   haptic. Lives full-width at the bottom of the screen.
 * SECONDARY — raised neumorphic pill, hairline stroke; sinks to #111113 pressed.
 * GHOST — grey text only; brightens on press.
 * DESTRUCTIVE — red-orange text; placement (top of sheet) + confirm dialog are
 *   the caller's responsibility.
 */
export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
  fullWidth = true,
  testID,
}: ButtonProps) {
  const pressed = useSharedValue(0);
  const isDisabled = disabled || loading;

  const onPressIn = useCallback(() => {
    if (isDisabled) return;
    pressed.value = withTiming(1, { duration: motion.press });
    void haptics.light();
  }, [isDisabled, pressed]);

  const onPressOut = useCallback(() => {
    pressed.value = withTiming(0, { duration: motion.press });
  }, [pressed]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = 1 - pressed.value * (1 - motion.pressScale);
    if (variant === "primary") {
      return {
        transform: [{ scale }],
        backgroundColor: pressed.value > 0.5 ? colors.accent.pressed : colors.accent.primary,
        shadowOpacity: 0.45 * (1 - pressed.value), // glow collapses on press
      };
    }
    return { transform: [{ scale }] };
  });

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={fullWidth ? styles.fullWidth : undefined}
    >
      {variant === "primary" ? (
        <Animated.View
          style={[
            styles.base,
            styles.primaryRest,
            isDisabled && styles.primaryDisabled,
            animatedStyle,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.text.primary} />
          ) : (
            <Row icon={icon}>
              <Text preset="bodyMedium" color={isDisabled ? "disabled" : "onAccent"}>
                {label}
              </Text>
            </Row>
          )}
        </Animated.View>
      ) : variant === "secondary" ? (
        <Animated.View
          style={[styles.base, styles.secondary, isDisabled && styles.secondaryDisabled, animatedStyle]}
        >
          <Row icon={icon}>
            <Text preset="bodyMedium" color={isDisabled ? "disabled" : "primary"}>
              {label}
            </Text>
          </Row>
        </Animated.View>
      ) : variant === "ghost" ? (
        <Animated.View style={[styles.ghost, animatedStyle]}>
          <Row icon={icon}>
            <Text preset="bodyMedium" color={isDisabled ? "disabled" : "secondary"}>
              {label}
            </Text>
          </Row>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.ghost, animatedStyle]}>
          <Row icon={icon}>
            <Text preset="bodyMedium" style={{ color: colors.accent.primary }}>
              {label}
            </Text>
          </Row>
        </Animated.View>
      )}
    </Pressable>
  );
}

function Row({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      {icon ? <View style={{ marginRight: spacing.sm }}>{icon}</View> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fullWidth: { width: "100%" },
  base: {
    height: sizing.buttonHeight,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  primaryRest: {
    backgroundColor: colors.accent.primary,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    shadowOpacity: 0.45,
  },
  primaryDisabled: {
    backgroundColor: colors.surface.raised,
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  secondary: {
    backgroundColor: colors.surface.raised,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  secondaryDisabled: {
    opacity: 0.5,
  },
  ghost: {
    height: sizing.buttonHeight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
});
