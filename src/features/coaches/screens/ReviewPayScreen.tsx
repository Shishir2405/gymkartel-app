import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  ShieldCheck,
  Check,
  MapPin,
  CalendarBlank,
  WarningCircle,
} from "phosphor-react-native";
import {
  Text,
  Card,
  Button,
  Avatar,
  Divider,
  Skeleton,
  StatePlaceholder,
  PressableRow,
  colors,
  radius,
  spacing,
} from "@/ui";
import { Screen } from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useCoachQuery, useGymQuery } from "@/graphql/generated/graphql";
import { formatRupees, formatDate, formatTime } from "@/lib/format";
import { toUiError } from "@/lib/errors";
import { haptics } from "@/lib/haptics";
import { openCheckout } from "@/lib/payments";

/** The UPI methods offered. */
const UPI_METHODS = [
  { id: "gpay", label: "Google Pay", handle: "you@okhdfcbank" },
  { id: "phonepe", label: "PhonePe", handle: "you@ybl" },
  { id: "paytm", label: "Paytm UPI", handle: "you@paytm" },
];

/**
 * Review and pay. A calm summary of the session, an insurance reassurance line,
 * and UPI method rows. The one orange action pays. A plain payment-failed state
 * offers a straight retry — no theme flourish on a money error.
 */
export function ReviewPayScreen({ navigation, route }: MemberScreenProps<"ReviewPay">) {
  const { coachId, slotIso, gymId } = route.params;
  const [{ data: coachData, fetching: coachFetching, error: coachError }] = useCoachQuery({
    variables: { id: coachId },
  });
  const [{ data: gymData, fetching: gymFetching, error: gymError }] = useGymQuery({
    variables: { id: gymId },
  });

  const coach = coachData?.coach;
  const gym = gymData?.gym;
  const uiError = toUiError(coachError ?? gymError);

  const [method, setMethod] = useState<string>(UPI_METHODS[0]?.id ?? "gpay");
  const [paying, setPaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const loading = (coachFetching && !coach) || (gymFetching && !gym);

  if (loading) {
    return (
      <Screen>
        <Skeleton height={28} width="50%" />
        <Skeleton height={140} radius={16} style={{ marginTop: spacing.lg }} />
        <Skeleton height={120} radius={16} style={{ marginTop: spacing.lg }} />
      </Screen>
    );
  }

  if (uiError || !coach) {
    return (
      <Screen>
        <StatePlaceholder
          variant="error"
          title="We could not load this booking"
          body={uiError?.message ?? "Please go back and try again."}
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const onPay = async () => {
    void haptics.medium();
    setFailed(false);
    setPaying(true);
    try {
      // No createBookingOrder mutation exists in the contract yet, so we pass a
      // null order id. TODO(backend): expose a coach-booking order mutation and
      // thread its orderId through here.
      const outcome = await openCheckout({
        orderId: null,
        amountPaise: coach.pricePerSessionPaise,
        name: "Gym Kartel",
        description: `Coaching session with ${coach.displayName}`,
      });
      if (outcome.status === "failed") {
        setFailed(true);
        return;
      }
      if (outcome.status === "cancelled") {
        return;
      }
      // success or unavailable → proceed; the server confirms via webhook.
      navigation.navigate("BookingConfirmed", { bookingId: coachId });
    } finally {
      setPaying(false);
    }
  };

  if (failed) {
    return (
      <Screen testID="review-pay" footer={<Button testID="review-pay.pay" label={`Retry · ${formatRupees(coach.pricePerSessionPaise)}`} onPress={() => void onPay()} />}>
        <StatePlaceholder
          variant="error"
          icon={<WarningCircle size={40} color={colors.text.secondary} />}
          title="Payment did not go through"
          body="No money was taken. Check your UPI app and try again."
        />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      testID="review-pay"
      footer={
        <Button
          testID="review-pay.pay"
          label={`Pay ${formatRupees(coach.pricePerSessionPaise)}`}
          onPress={() => void onPay()}
          loading={paying}
        />
      }
    >
      <Text preset="title" style={styles.title}>
        Review and pay
      </Text>

      {/* Summary */}
      <Card padded>
        <View style={styles.coachRow}>
          <Avatar name={coach.displayName} size={44} />
          <View style={styles.coachText}>
            <Text preset="bodyMedium">{coach.displayName}</Text>
            <Text preset="body" color="secondary">
              One session
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <SummaryRow
          icon={<CalendarBlank size={18} color={colors.text.secondary} />}
          label="When"
          value={`${formatDate(slotIso)} · ${formatTime(slotIso)}`}
        />
        <SummaryRow
          icon={<MapPin size={18} color={colors.text.secondary} />}
          label="Where"
          value={gym ? `${gym.name}, ${gym.zone}` : "Selected gym"}
        />

        <Divider style={styles.divider} />

        <View style={styles.totalRow}>
          <Text preset="bodyMedium">Total</Text>
          <Text preset="displayMedium">{formatRupees(coach.pricePerSessionPaise)}</Text>
        </View>
      </Card>

      {/* Insurance */}
      <View style={styles.insurance}>
        <ShieldCheck size={18} color={colors.support.positive} />
        <Text preset="body" color="secondary" style={styles.insuranceText}>
          Every confirmed session is insured.
        </Text>
      </View>

      {/* UPI methods */}
      <Text preset="label" color="secondary" style={styles.section}>
        PAY WITH UPI
      </Text>
      <Card padded>
        {UPI_METHODS.map((m, i) => {
          const selected = method === m.id;
          return (
            <View key={m.id}>
              {i > 0 ? <Divider style={styles.divider} /> : null}
              <PressableRow testID={`review-pay.method.${m.id}`} onPress={() => setMethod(m.id)} style={styles.methodRow}>
                <View style={styles.methodText}>
                  <Text preset="bodyMedium">{m.label}</Text>
                  <Text preset="body" color="secondary">
                    {m.handle}
                  </Text>
                </View>
                <View style={[styles.radioOuter, selected && styles.radioSelected]}>
                  {selected ? <Check size={14} weight="bold" color={colors.accent.primary} /> : null}
                </View>
              </PressableRow>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      {icon}
      <View style={styles.summaryText}>
        <Text preset="label" color="secondary">
          {label.toUpperCase()}
        </Text>
        <Text preset="body">{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.lg },
  coachRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  coachText: { flex: 1 },
  divider: { marginVertical: spacing.md },
  summaryRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, marginVertical: spacing.sm },
  summaryText: { flex: 1, gap: 2 },
  totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  insurance: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  insuranceText: { flex: 1 },
  section: { marginTop: spacing.xl, marginBottom: spacing.md },
  methodRow: { justifyContent: "space-between" },
  methodText: { flex: 1 },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderWidth: 1.5, borderColor: colors.accent.primary },
});
