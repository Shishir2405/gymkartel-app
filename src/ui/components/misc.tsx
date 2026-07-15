import React from "react";
import { Image, Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { colors, radius, spacing } from "../tokens";
import { Text } from "./Text";

/** Hairline divider. */
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

/** Circular avatar; falls back to an initial on the raised surface. */
export function Avatar({
  uri,
  name,
  size = 40,
}: {
  uri?: string | null | undefined;
  name?: string | undefined;
  size?: number;
}) {
  const initial = name?.trim().charAt(0).toUpperCase() ?? "";
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surface.raised }}
      />
    );
  }
  return (
    <View
      style={[
        styles.avatarFallback,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text preset="bodyMedium" color="secondary">
        {initial}
      </Text>
    </View>
  );
}

/** Thin progress bar (rank progress, live-busy meter). Accent-filled track. */
export function ProgressBar({
  value,
  tone = "accent",
  height = 8,
}: {
  value: number; // 0..1
  tone?: "accent" | "neutral";
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2 }]}>
      <View
        style={{
          width: `${clamped * 100}%`,
          height: "100%",
          borderRadius: height / 2,
          backgroundColor: tone === "accent" ? colors.accent.primary : colors.text.secondary,
        }}
      />
    </View>
  );
}

/** Section header with an optional trailing action. */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text preset="label" color="secondary">
        {title}
      </Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text preset="label" color="accent">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Row with pressable feedback for list items. */
export function PressableRow({
  children,
  onPress,
  style,
  testID,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  /** Stable e2e selector (Maestro/Detox). See .maestro/README.md. */
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [styles.row, style, pressed && { opacity: 0.7 }]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  divider: { height: 1, backgroundColor: colors.stroke.hairline, width: "100%" },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  progressTrack: {
    width: "100%",
    backgroundColor: colors.surface.pressed,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
});
