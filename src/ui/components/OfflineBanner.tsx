import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, spacing } from "../tokens";
import { Text } from "./Text";

/**
 * Quiet strip shown when the device is offline. Check-in never blocks on the
 * network, so the banner reassures rather than alarms.
 */
export function OfflineBanner({ pendingCount = 0 }: { pendingCount?: number }) {
  return (
    <View style={styles.wrap} testID="offline-banner">
      <View style={styles.dot} />
      <Text preset="label" color="secondary">
        {pendingCount > 0
          ? `Offline — ${pendingCount} check-in${pendingCount > 1 ? "s" : ""} will sync`
          : "Offline — your check-ins are saved"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.surface.pressed,
    borderBottomWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.support.warning,
  },
});
