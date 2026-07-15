import React from "react";
import { StyleSheet, View } from "react-native";
import { CheckCircle } from "phosphor-react-native";
import { PASS_PACK_DAYS, type PassPack } from "@gymkartel/contracts";
import { Screen, Text, Button, colors, spacing } from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";

/**
 * Calm purchase confirmation. No confetti — a single quiet tick, the day count
 * in Barlow, and the validity-window promise. The one orange button carries the
 * member into the club (the tabs).
 */
export function PurchaseSuccessScreen({ navigation, route }: MemberScreenProps<"PurchaseSuccess">) {
  const { pack } = route.params;
  const days = PASS_PACK_DAYS[pack as PassPack] ?? null;

  return (
    <Screen
      testID="purchase-success"
      footer={
        <Button
          testID="purchase-success.enter"
          label="Enter the Club"
          onPress={() => navigation.navigate("Tabs")}
        />
      }
    >
      <View style={styles.body}>
        <CheckCircle size={56} weight="fill" color={colors.accent.primary} />

        <Text preset="displayLarge" align="center" style={styles.headline}>
          Pass active
        </Text>

        {days != null ? (
          <Text preset="bodyMedium" color="secondary" align="center" style={styles.days}>
            {days} {days === 1 ? "day" : "days"} on your pass
          </Text>
        ) : null}

        <Text preset="body" color="secondary" align="center" style={styles.window}>
          Days roll over inside a 60-day window. They wait for you — check in when
          you are ready.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  headline: { marginTop: spacing.xl },
  days: { marginTop: spacing.md },
  window: { marginTop: spacing.lg, maxWidth: 320, lineHeight: 22 },
});
