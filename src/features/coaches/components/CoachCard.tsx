import React from "react";
import { StyleSheet, View } from "react-native";
import { SealCheck, Star } from "phosphor-react-native";
import {
  Text,
  Card,
  Chip,
  Badge,
  Avatar,
  PressableRow,
  colors,
  spacing,
} from "@/ui";
import { formatRupees } from "@/lib/format";
import type { CoachCardFragment } from "@/graphql/generated/graphql";

/**
 * A coach tile for the browse grid. Price is shown UPFRONT (never "contact for
 * price"). The verified tick is the single orange accent; a Legend coach is the
 * only place gold is allowed here.
 */
export function CoachCard({
  coach,
  onPress,
  testID,
}: {
  coach: CoachCardFragment;
  onPress: () => void;
  testID?: string;
}) {
  const isLegend = coach.badge === "LEGEND";
  const isElite = coach.badge === "ELITE";
  const specialties = coach.specialties.slice(0, 2);

  return (
    <Card padded style={styles.card}>
      <PressableRow {...(testID ? { testID } : {})} onPress={onPress} style={styles.press}>
        <View style={styles.inner}>
          <Avatar name={coach.displayName} size={64} />

          <View style={styles.nameRow}>
            <Text preset="bodyMedium" numberOfLines={1} style={styles.name}>
              {coach.displayName}
            </Text>
            {coach.verified ? (
              <SealCheck size={16} weight="fill" color={colors.accent.primary} />
            ) : null}
          </View>

          {isLegend || isElite ? (
            <View style={styles.badgeRow}>
              <Badge label={coach.badge ?? ""} tone={isLegend ? "gold" : "accent"} />
            </View>
          ) : null}

          {coach.ratingAverage != null ? (
            <View style={styles.rating}>
              <Star size={12} weight="fill" color={colors.text.secondary} />
              <Text preset="body" color="secondary" style={styles.ratingText}>
                {coach.ratingAverage.toFixed(1)} · {coach.sessionsCompleted}
              </Text>
            </View>
          ) : (
            <Text preset="body" color="secondary" style={styles.rating}>
              {coach.sessionsCompleted} sessions
            </Text>
          )}

          <Text preset="displayMedium" style={styles.price}>
            {formatRupees(coach.pricePerSessionPaise)}
          </Text>
          <Text preset="label" color="secondary">
            PER SESSION
          </Text>

          {specialties.length > 0 ? (
            <View style={styles.chips}>
              {specialties.map((s) => (
                <Chip key={s} label={s} />
              ))}
            </View>
          ) : null}
        </View>
      </PressableRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  press: { paddingVertical: 0 },
  inner: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  name: { flexShrink: 1 },
  badgeRow: { marginTop: spacing.sm },
  rating: { flexDirection: "row", alignItems: "center", marginTop: spacing.sm },
  ratingText: { marginLeft: 4 },
  price: { marginTop: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.md },
});
