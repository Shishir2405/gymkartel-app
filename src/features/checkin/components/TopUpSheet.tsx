import React from "react";
import { StyleSheet, View } from "react-native";
import { Sheet, Text, Button, spacing } from "../../../ui";
import { formatRupees } from "../../../lib/format";
import type { Tier } from "@gymkartel/contracts";

export interface TopUpSheetProps {
  visible: boolean;
  gymTier: Tier;
  amountPaise: number;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Flow 4 top-up sheet. This is a DOOR, not a wall: the copy is inviting, the
 * confirm action is the single orange button, and the maths are shown plainly.
 * "This is a Premium Territory. Use 1 day + ₹99?"
 */
export function TopUpSheet({
  visible,
  gymTier,
  amountPaise,
  onConfirm,
  onClose,
}: TopUpSheetProps) {
  const tierWord = gymTier.charAt(0) + gymTier.slice(1).toLowerCase();
  return (
    <Sheet visible={visible} onClose={onClose} title={`This is a ${tierWord} Territory`}>
      <Text preset="body" color="secondary" style={styles.body}>
        Your pass is a step below this gym. Use 1 day from your pass plus{" "}
        {formatRupees(amountPaise)} to walk in today.
      </Text>
      <View style={styles.mathRow}>
        <Text preset="bodyMedium">1 pass day + {formatRupees(amountPaise)}</Text>
      </View>
      <View style={styles.action}>
        <Button label={`Confirm and pay ${formatRupees(amountPaise)}`} onPress={onConfirm} />
      </View>
      <View style={styles.ghost}>
        <Button label="Not now" variant="ghost" onPress={onClose} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { marginBottom: spacing.lg },
  mathRow: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#2A2A2E",
    marginBottom: spacing.lg,
  },
  action: {},
  ghost: { marginTop: spacing.xs },
});
