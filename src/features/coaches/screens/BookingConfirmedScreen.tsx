import React from "react";
import { StyleSheet, View } from "react-native";
import {
  CheckCircle,
  ShieldCheck,
  CalendarBlank,
  MapPin,
  UserCircle,
} from "phosphor-react-native";
import {
  Text,
  Card,
  Button,
  Badge,
  Divider,
  colors,
  spacing,
} from "@/ui";
import { Screen } from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useBookingsQuery, useCoachQuery } from "@/graphql/generated/graphql";
import { formatDate, formatTime } from "@/lib/format";

/**
 * Booking confirmed — a calm sign-off, not a celebration. If the booking exists
 * in the cache we render it; otherwise we fall back to the coach and the params.
 * The single orange action opens the chat with the coach.
 */
export function BookingConfirmedScreen({ navigation, route }: MemberScreenProps<"BookingConfirmed">) {
  const { bookingId } = route.params;
  const [{ data: bookingsData }] = useBookingsQuery();
  const [{ data: coachData }] = useCoachQuery({ variables: { id: bookingId } });

  const booking = bookingsData?.bookings.find(
    (b) => b.id === bookingId || b.coach.id === bookingId,
  );
  const coach = booking?.coach ?? coachData?.coach ?? null;

  const coachName = coach?.displayName ?? "your coach";
  const gymName = booking?.gym.name ?? null;
  const scheduledFor = booking?.scheduledFor ?? null;
  const insured = booking?.insured ?? true;
  const peerName = coach?.displayName ?? "Coach";

  return (
    <Screen
      scroll
      testID="booking-confirmed"
      footer={
        <Button
          testID="booking-confirmed.message"
          label="Message coach"
          onPress={() => navigation.navigate("ChatThread", { bookingId, peerName })}
        />
      }
    >
      <View style={styles.hero}>
        <CheckCircle size={48} weight="fill" color={colors.support.positive} />
        <Text preset="title" align="center" style={styles.heroTitle}>
          Session confirmed
        </Text>
        <Text preset="body" color="secondary" align="center" style={styles.heroBody}>
          You are booked with {coachName}. Details are saved to your sessions.
        </Text>
      </View>

      <Card padded>
        <View style={styles.cardHead}>
          <Text preset="label" color="secondary">
            UPCOMING SESSION
          </Text>
          {insured ? <Badge label="INSURED" tone="positive" /> : null}
        </View>

        {scheduledFor ? (
          <Text preset="displayMedium" style={styles.date}>
            {formatDate(scheduledFor)}
          </Text>
        ) : null}
        {scheduledFor ? (
          <Text preset="bodyMedium" color="secondary">
            {formatTime(scheduledFor)}
          </Text>
        ) : (
          <Text preset="bodyMedium" color="secondary">
            Time confirmed. See your sessions for details.
          </Text>
        )}

        <Divider style={styles.divider} />

        <InfoRow
          icon={<UserCircle size={18} color={colors.text.secondary} />}
          label="Coach"
          value={coachName}
        />
        {gymName ? (
          <InfoRow
            icon={<MapPin size={18} color={colors.text.secondary} />}
            label="Gym"
            value={gymName}
          />
        ) : null}
        <InfoRow
          icon={<ShieldCheck size={18} color={colors.support.positive} />}
          label="Cover"
          value="This session is insured until it ends"
        />
      </Card>

      <View style={styles.calendarNote}>
        <CalendarBlank size={16} color={colors.text.secondary} />
        <Text preset="body" color="secondary" style={styles.calendarText}>
          You can reschedule up to 12 hours before the session.
        </Text>
      </View>

      <Button
        label="Back to coaches"
        variant="ghost"
        onPress={() => navigation.navigate("CoachBrowse")}
      />
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      {icon}
      <View style={styles.infoText}>
        <Text preset="label" color="secondary">
          {label.toUpperCase()}
        </Text>
        <Text preset="body">{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginTop: spacing.lg, marginBottom: spacing.xl },
  heroTitle: { marginTop: spacing.md },
  heroBody: { marginTop: spacing.sm, maxWidth: 320 },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: { marginTop: spacing.sm },
  divider: { marginVertical: spacing.lg },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, marginVertical: spacing.sm },
  infoText: { flex: 1, gap: 2 },
  calendarNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  calendarText: { flex: 1 },
});
