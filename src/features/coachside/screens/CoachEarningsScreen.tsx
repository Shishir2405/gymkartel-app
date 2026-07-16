import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Screen,
  Text,
  Card,
  Divider,
  Skeleton,
  StatePlaceholder,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { CoachTabScreenProps } from "@/app/navigation/types";
import { formatRupees } from "@/lib/format";
import { toUiError } from "@/lib/errors";
import { useCoachEarningsQuery } from "@/graphql/generated/graphql";

export function CoachEarningsScreen(_props: CoachTabScreenProps<"CoachEarnings">) {
  const [{ data, fetching, error }, refetch] = useCoachEarningsQuery();
  const uiError = toUiError(error);
  const earnings = data?.coachEarnings ?? null;

  if (fetching && !earnings) {
    return (
      <Screen scroll>
        <Text preset="title">Earnings</Text>
        <Skeleton height={140} radius={radius.card} style={{ marginTop: spacing.lg }} />
        <Skeleton height={200} radius={radius.card} style={{ marginTop: spacing.lg }} />
      </Screen>
    );
  }

  if (uiError && !earnings) {
    return (
      <Screen>
        <StatePlaceholder
          variant={uiError.code === "OFFLINE" ? "offline" : "error"}
          title="We could not load your earnings"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      </Screen>
    );
  }

  if (!earnings || earnings.grossPaise === 0) {
    return (
      <Screen scroll>
        <Text preset="title">Earnings</Text>
        <Card padded style={{ marginTop: spacing.lg }}>
          <Text preset="body" color="secondary">
            No completed sessions yet. Your take-home appears here after your first session.
          </Text>
        </Card>
      </Screen>
    );
  }

  const platformFee = earnings.grossPaise - earnings.takeHomePaise;

  return (
    <Screen scroll>
      <Text preset="title">Earnings</Text>

      <Card padded style={styles.hero}>
        <Text preset="label" color="secondary">
          YOUR TAKE-HOME
        </Text>
        <Text preset="displayLarge" style={{ marginTop: spacing.xs }}>
          {formatRupees(earnings.takeHomePaise)}
        </Text>
        <Text preset="body" color="secondary" style={{ marginTop: spacing.xs }}>
          You keep {formatRupees(earnings.takeHomePaise)} (80%). Payouts land{" "}
          {earnings.payoutSchedule} to your linked account.
        </Text>
      </Card>

      <Text preset="label" color="secondary" style={styles.section}>
        TAX SUMMARY
      </Text>
      <Card padded>
        <SummaryRow label="Gross earnings" value={formatRupees(earnings.grossPaise)} />
        <Divider style={{ marginVertical: spacing.md }} />
        <SummaryRow label="Platform fee (20%)" value={`- ${formatRupees(platformFee)}`} />
        <Divider style={{ marginVertical: spacing.md }} />
        <SummaryRow label="Net take-home" value={formatRupees(earnings.takeHomePaise)} strong />
        <Divider style={{ marginVertical: spacing.md }} />
        <SummaryRow label="Estimated tax set-aside" value={formatRupees(earnings.estimatedTdsPaise)} />
        <View style={styles.note}>
          <Text preset="body" color="secondary">
            The tax set-aside is an estimate to help you plan. It is not filed for you.
          </Text>
        </View>
      </Card>
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
