import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ClockCounterClockwise } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Divider,
  Skeleton,
  StatePlaceholder,
  SectionHeader,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { formatDate } from "@/lib/format";
import {
  MOCK_EXERCISE_HISTORY,
  type ExerciseHistory,
} from "@/features/ledger/data/mockLedger";

/**
 * The read-only record: every exercise you have logged, grouped, newest session
 * first. Weight figures use Barlow so the numbers carry the card.
 */
export function ExerciseHistoryScreen(_props: MemberScreenProps<"ExerciseHistory">) {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<ExerciseHistory[]>([]);

  useEffect(() => {
    // Stand-in for the history query resolving from cache.
    const id = setTimeout(() => {
      setGroups(MOCK_EXERCISE_HISTORY);
      setLoading(false);
    }, 450);
    return () => clearTimeout(id);
  }, []);

  if (loading) {
    return (
      <Screen scroll>
        <Text preset="title">Exercise history</Text>
        <Skeleton height={140} radius={radius.card} style={{ marginTop: spacing.lg }} />
        <Skeleton height={140} radius={radius.card} style={{ marginTop: spacing.md }} />
        <Skeleton height={140} radius={radius.card} style={{ marginTop: spacing.md }} />
      </Screen>
    );
  }

  if (groups.length === 0) {
    return (
      <Screen>
        <StatePlaceholder
          icon={<ClockCounterClockwise size={40} color={colors.text.secondary} />}
          variant="empty"
          title="No history yet"
          body="Log a workout and every set lands here, session by session."
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text preset="title">Exercise history</Text>
      {groups.map((group) => (
        <View key={group.exercise}>
          <SectionHeader title={group.exercise} />
          <Card padded>
            {group.history.map((h, i) => (
              <View key={`${group.exercise}-${h.date}`}>
                {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
                <View style={styles.row}>
                  <View style={styles.meta}>
                    <Text preset="bodyMedium">
                      {h.sets} sets · {h.reps} reps
                    </Text>
                    <Text preset="body" color="secondary">
                      {formatDate(h.date)}
                    </Text>
                  </View>
                  <View style={styles.weightWrap}>
                    <Text preset="displayMedium">{h.weightKg}</Text>
                    <Text preset="label" color="secondary">
                      kg
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  meta: { flex: 1, paddingRight: spacing.md },
  weightWrap: { alignItems: "flex-end" },
});
