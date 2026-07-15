import React from "react";
import { StyleSheet, View } from "react-native";
import { Flame } from "phosphor-react-native";
import { Card, Text, Badge, Button, colors, spacing } from "../../../ui";
import { formatDate } from "../../../lib/format";
import { TIER_DAY_RATE } from "@gymkartel/contracts";
import { formatRupees } from "../../../lib/format";

export interface PassHeroData {
  tier: "BASIC" | "STANDARD" | "PREMIUM";
  daysLeft: number;
  validUntil: string;
  streak: number;
}

/**
 * HERO pass card, has-pass state. The DAYS LEFT figure is the star — 56px Barlow
 * Condensed filling the card. The streak flame is the ONE orange accent on the
 * card. Quiet otherwise.
 */
export function PassHeroCard({ data }: { data: PassHeroData }) {
  return (
    <Card padded>
      <View style={styles.headerRow}>
        <Badge label={`${data.tier} PASS`} tone="neutral" />
        <View style={styles.streak}>
          <Flame size={18} weight="fill" color={colors.accent.primary} />
          <Text preset="bodyMedium" style={{ color: colors.accent.primary, marginLeft: 4 }}>
            {data.streak}
          </Text>
        </View>
      </View>

      <View style={styles.figureRow}>
        <Text preset="displayLarge">{data.daysLeft}</Text>
        <Text preset="label" color="secondary" style={styles.daysLabel}>
          DAYS{"\n"}LEFT
        </Text>
      </View>

      <Text preset="body" color="secondary">
        Valid until {formatDate(data.validUntil)}. Your days wait for you.
      </Text>
    </Card>
  );
}

/**
 * HERO pass card, NO-pass state. This is the one place Home carries the single
 * orange button — "Get your Pass · from ₹99". The Ledger and gyms open with a
 * Pass, so the whole screen bends toward this action.
 */
export function NoPassHeroCard({
  onGetPass,
  fromPaise = TIER_DAY_RATE.BASIC,
}: {
  onGetPass: () => void;
  fromPaise?: number;
}) {
  return (
    <Card padded>
      <Text preset="label" color="secondary">
        NO ACTIVE PASS
      </Text>
      <Text preset="title" style={styles.noPassTitle}>
        The Ledger opens with a Pass
      </Text>
      <Text preset="body" color="secondary" style={styles.noPassBody}>
        One pass works at every gym in your tier, in any city. Days roll over
        inside a 60-day window.
      </Text>
      <View style={styles.noPassAction}>
        <Button
          testID="home.get-pass"
          label={`Get your Pass · from ${formatRupees(fromPaise)}`}
          onPress={onGetPass}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  streak: { flexDirection: "row", alignItems: "center" },
  figureRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  daysLabel: { marginLeft: spacing.md, marginBottom: 10 },
  noPassTitle: { marginTop: spacing.sm },
  noPassBody: { marginTop: spacing.sm },
  noPassAction: { marginTop: spacing.lg },
});
