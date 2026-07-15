import React from "react";
import { StyleSheet, View } from "react-native";
import { ArrowCircleUp } from "phosphor-react-native";
import { Screen, Text, Button, Sheet, colors, spacing } from "@/ui";

/**
 * Version-gate surfaces (Section 6). Both are presentational — they take plain
 * callbacks and hold no navigation. `SoftUpdatePrompt` is a dismissible sheet
 * shown when a newer build exists; `HardUpdateGate` is the full-screen wall
 * shown when the current build has dropped below the minimum supported version.
 */

export function SoftUpdatePrompt({
  onDismiss,
  onUpdate,
}: {
  onDismiss: () => void;
  onUpdate: () => void;
}) {
  return (
    <Sheet visible onClose={onDismiss} title="Update available">
      <Text preset="body" color="secondary" style={styles.softBody}>
        A newer version of Gym Kartel is ready. Updating keeps your pass,
        check-ins and coach chat working smoothly.
      </Text>
      <View style={styles.softActions}>
        <Button label="Update" onPress={onUpdate} />
        <Button label="Not now" variant="ghost" onPress={onDismiss} />
      </View>
    </Sheet>
  );
}

export function HardUpdateGate({ onUpdate }: { onUpdate: () => void }) {
  return (
    <Screen footer={<Button label="Update" onPress={onUpdate} />}>
      <View style={styles.hardWrap}>
        <ArrowCircleUp size={48} color={colors.text.secondary} />
        <Text preset="title" align="center" style={styles.hardTitle}>
          This version is no longer supported
        </Text>
        <Text preset="body" color="secondary" align="center" style={styles.hardBody}>
          Update to continue. This build can no longer connect safely to your
          account.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  softBody: { lineHeight: 22 },
  softActions: { marginTop: spacing.xl, gap: spacing.sm },
  hardWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  hardTitle: { marginTop: spacing.lg },
  hardBody: { marginTop: spacing.sm, maxWidth: 300 },
});
