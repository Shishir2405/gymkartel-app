import React from "react";
import { StyleSheet, View } from "react-native";
import { Wallet } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Button,
  Badge,
  TierBadge,
  Skeleton,
  StatePlaceholder,
  SectionHeader,
  Divider,
  colors,
  spacing,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useViewerQuery } from "@/graphql/generated/graphql";
import { formatDate } from "@/lib/format";

/** Mock saved UPI methods — no billing service wired yet. */
const PAYMENT_METHODS = [
  { id: "upi-1", handle: "you@okhdfc", primary: true },
  { id: "upi-2", handle: "you@okaxis", primary: false },
] as const;

/**
 * Pass & payments. A single summary of the active pass on top; when the pass has
 * expired or been exhausted the summary becomes a renew prompt that surfaces the
 * rolled-over days and the one orange action. Payment methods sit below, plain.
 */
export function PassPaymentsScreen({ navigation }: MemberScreenProps<"PassPayments">) {
  const [{ data, fetching, error }] = useViewerQuery();
  const viewer = data?.viewer ?? null;
  const pass = viewer?.activePass ?? null;
  const isActive = pass?.status === "ACTIVE";
  const needsRenew = !fetching && !isActive;

  return (
    <Screen
      scroll
      footer={
        needsRenew ? (
          <Button
            label="Renew pass"
            onPress={() => navigation.navigate("PassLadder")}
          />
        ) : undefined
      }
    >
      <Text preset="title">Pass & payments</Text>

      {fetching && !viewer ? (
        <Skeleton height={180} radius={16} style={{ marginTop: spacing.lg }} />
      ) : error && !viewer ? (
        <View style={styles.errorBlock}>
          <StatePlaceholder
            variant="error"
            title="We could not load your pass"
            body="Check your connection and try again."
          />
        </View>
      ) : isActive && pass ? (
        <Card padded style={styles.summary}>
          <View style={styles.summaryTop}>
            <TierBadge tier={pass.tier} />
            <Badge label="ACTIVE" tone="positive" />
          </View>
          <Text preset="displayMedium" style={styles.days}>
            {pass.daysLeft}
          </Text>
          <Text preset="label" color="secondary">
            DAYS LEFT
          </Text>
          <Divider style={styles.summaryDivider} />
          <Text preset="body" color="secondary">
            Valid until {formatDate(pass.validUntil)}
          </Text>
          <Text preset="body" color="secondary" style={styles.rollover}>
            Unused days roll over when you renew. You keep what you paid for.
          </Text>
        </Card>
      ) : (
        <Card padded style={styles.summary}>
          <Text preset="label" color="secondary">
            {pass?.status === "EXHAUSTED" ? "PASS EXHAUSTED" : "PASS EXPIRED"}
          </Text>
          <Text preset="displayMedium" style={styles.days}>
            {pass?.bonusDays ?? 0}
          </Text>
          <Text preset="bodyMedium">
            You have {pass?.bonusDays ?? 0} days waiting. Renew to keep them.
          </Text>
          <Text preset="body" color="secondary" style={styles.rollover}>
            Your rolled-over days are held for you. They apply to your next pass.
          </Text>
        </Card>
      )}

      <SectionHeader title="Payment methods" />
      <Card padded={false} style={styles.methods}>
        {PAYMENT_METHODS.map((m, i) => (
          <View key={m.id}>
            {i > 0 ? <Divider /> : null}
            <View style={styles.methodRow}>
              <Wallet size={22} color={colors.text.secondary} />
              <View style={styles.methodBody}>
                <Text preset="bodyMedium">UPI · {m.handle}</Text>
                {m.primary ? (
                  <Text preset="body" color="secondary" style={styles.methodSub}>
                    Primary
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  errorBlock: { height: 320 },
  summary: { marginTop: spacing.lg },
  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  days: { marginTop: spacing.md },
  summaryDivider: { marginVertical: spacing.md },
  rollover: { marginTop: spacing.sm },
  methods: {
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface.raised,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  methodBody: { flex: 1 },
  methodSub: { marginTop: 2 },
});
