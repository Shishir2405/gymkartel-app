import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../tokens";
import { Text } from "./Text";

type Tone = "neutral" | "accent" | "gold" | "positive";

export interface BadgeProps {
  label: string;
  tone?: Tone;
}

/**
 * Small pill label. Gold tone is LOCKED — only pass it for the #1 rank or a
 * Legend coach. Everything else uses neutral/accent/positive.
 */
export function Badge({ label, tone = "neutral" }: BadgeProps) {
  const color =
    tone === "gold"
      ? colors.accent.gold
      : tone === "accent"
        ? colors.accent.primary
        : tone === "positive"
          ? colors.support.positive
          : colors.text.secondary;
  return (
    <View style={[styles.base, { borderColor: color }]}>
      <Text preset="label" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

/** Tier badge — BASIC / STANDARD / PREMIUM, always neutral-toned (not gold). */
export function TierBadge({ tier }: { tier: "BASIC" | "STANDARD" | "PREMIUM" }) {
  return <Badge label={tier} tone="neutral" />;
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
});
