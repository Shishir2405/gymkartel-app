import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, spacing } from "@/ui";

/**
 * Quiet progress dots for the stepped health quiz. The current step is the one
 * orange mark; the rest are hairline dots. Used above the card, never competing
 * with the primary button.
 */
export function StepDots({ total, index }: { total: number; index: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Step ${index + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === index ? styles.active : null]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  active: {
    width: 22,
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
});
