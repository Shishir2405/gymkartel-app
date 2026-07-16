import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, colors, radius, spacing } from "@/ui";
import { IS_DEMO } from "@/config/appMode";

export function DemoBadge() {
  const insets = useSafeAreaInsets();
  if (!IS_DEMO) return null;
  return (
    <View
      pointerEvents="none"
      style={[styles.wrap, { top: insets.top + spacing.xs }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.pill}>
        <Text preset="label" color="secondary" style={styles.text}>
          DEMO
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
    elevation: 1000,
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
    opacity: 0.9,
  },
  text: { letterSpacing: 2 },
});
