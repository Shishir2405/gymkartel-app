import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Screen,
  Text,
  Card,
  Divider,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { CoachTabScreenProps } from "@/app/navigation/types";
import { formatRupees, formatDate } from "@/lib/format";
import { COACH_TAKE_RATE } from "@gymkartel/contracts";
import { MOCK_COMPLETED } from "@/features/coachside/lib/mock";

/**
 * Earnings. The take-home total is the Barlow hero. Below it, each recent
 * session shows gross and the 80 percent take-home, then a plain tax-summary
 * card. Nothing decorative — the coach needs to trust these numbers.
 */
export function CoachEarningsScreen(_props: CoachTabScreenProps<"CoachEarnings">) {
  const gross = MOCK_COMPLETED.reduce((sum, s) => sum + s.grossPaise, 0);
  const platformFee = gross - Math.round(gross * COACH_TAKE_RATE);
  const net = Math.round(gross * COACH_TAKE_RATE);
  const estimatedTax = Math.round(net * 0.1);

  return (
    <Screen scroll>
      <Text preset="title">Earnings</Text>

      {MOCK_COMPLETED.length === 0 ? (
        <Card padded style={{ marginTop: spacing.lg }}>
          <Text preset="body" color="secondary">
            No completed sessions yet. Your take-home appears here after your first session.
          </Text>
        </Card>
      ) : (
        <>
          <Card padded style={styles.hero}>
            <Text preset="label" color="secondary">
              YOUR TAKE-HOME
            </Text>
            <Text preset="displayLarge" style={{ marginTop: spacing.xs }}>
              {formatRupees(net)}
            </Text>
            <Text preset="body" color="secondary" style={{ marginTop: spacing.xs }}>
              Payouts land T+2 to your linked account.
            </Text>
          </Card>

          <Text preset="label" color="secondary" style={styles.section}>
            RECENT SESSIONS
          </Text>
          <Card padded>
            {MOCK_COMPLETED.map((s, i) => {
              const take = Math.round(s.grossPaise * COACH_TAKE_RATE);
              return (
                <View key={s.id}>
                  {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
                  <View style={styles.sessionRow}>
                    <View style={{ flex: 1 }}>
                      <Text preset="bodyMedium">{s.clientName}</Text>
                      <Text preset="body" color="secondary">
                        {formatDate(s.startIso)}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text preset="bodyMedium">{formatRupees(take)}</Text>
                      <Text preset="label" color="secondary">
                        GROSS {formatRupees(s.grossPaise)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>

          <Text preset="label" color="secondary" style={styles.section}>
            TAX SUMMARY
          </Text>
          <Card padded>
            <SummaryRow label="Gross earnings" value={formatRupees(gross)} />
            <Divider style={{ marginVertical: spacing.md }} />
            <SummaryRow label="Platform fee (20%)" value={`- ${formatRupees(platformFee)}`} />
            <Divider style={{ marginVertical: spacing.md }} />
            <SummaryRow label="Net take-home" value={formatRupees(net)} strong />
            <Divider style={{ marginVertical: spacing.md }} />
            <SummaryRow label="Estimated tax set-aside" value={formatRupees(estimatedTax)} />
            <View style={styles.note}>
              <Text preset="body" color="secondary">
                The tax set-aside is an estimate to help you plan. It is not filed for you.
              </Text>
            </View>
          </Card>
        </>
      )}
    </Screen>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text preset={strong ? "bodyMedium" : "body"} color={strong ? "primary" : "secondary"}>
        {label}
      </Text>
      <Text preset={strong ? "bodyMedium" : "body"}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginTop: spacing.lg },
  section: { marginTop: spacing.xl, marginBottom: spacing.md },
  sessionRow: { flexDirection: "row", alignItems: "center" },
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  note: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface.pressed,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
});
