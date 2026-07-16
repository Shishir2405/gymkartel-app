import React, { useMemo } from "react";
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
import { toUiError } from "@/lib/errors";
import { useLedgerHistoryQuery, type LedgerEntryRowFragment } from "@/graphql/generated/graphql";

interface ExerciseGroup {
  exercise: string;
  entries: LedgerEntryRowFragment[];
}

function groupByExercise(entries: readonly LedgerEntryRowFragment[]): ExerciseGroup[] {
  const map = new Map<string, LedgerEntryRowFragment[]>();
  for (const entry of entries) {
    const key = entry.chip.exercise ? titleCase(entry.chip.exercise) : "Other";
    const list = map.get(key) ?? [];
    list.push(entry);
    map.set(key, list);
  }
  return Array.from(map.entries()).map(([exercise, list]) => ({
    exercise,
    entries: [...list].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
  }));
}

export function ExerciseHistoryScreen(_props: MemberScreenProps<"ExerciseHistory">) {
  const [{ data, fetching, error }, refetch] = useLedgerHistoryQuery();
  const uiError = toUiError(error);
  const groups = useMemo(
    () => groupByExercise(data?.ledgerHistory ?? []),
    [data?.ledgerHistory],
  );

  if (fetching && !data) {
    return (
      <Screen scroll>
        <Text preset="title">Exercise history</Text>
        <Skeleton height={140} radius={radius.card} style={{ marginTop: spacing.lg }} />
        <Skeleton height={140} radius={radius.card} style={{ marginTop: spacing.md }} />
        <Skeleton height={140} radius={radius.card} style={{ marginTop: spacing.md }} />
      </Screen>
    );
  }

  if (uiError) {
    return (
      <Screen>
        <StatePlaceholder
          icon={<ClockCounterClockwise size={40} color={colors.text.secondary} />}
          variant={uiError.code === "OFFLINE" ? "offline" : "error"}
          title="We could not load your history"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
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
            {group.entries.map((entry, i) => (
              <View key={entry.id}>
                {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
                <View style={styles.row}>
                  <View style={styles.meta}>
                    <View style={styles.setLine}>
                      <Text preset="bodyMedium">{setSummary(entry.chip.sets, entry.chip.reps)}</Text>
                      {entry.isPR ? (
                        <Text preset="label" color="accent" style={styles.pr}>
                          PR
                        </Text>
                      ) : null}
                    </View>
                    <Text preset="body" color="secondary">
                      {formatDate(entry.loggedAt)}
                    </Text>
                  </View>
                  {entry.chip.weightKg != null ? (
                    <View style={styles.weightWrap}>
                      <Text preset="displayMedium">{entry.chip.weightKg}</Text>
                      <Text preset="label" color="secondary">
                        kg
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </Card>
        </View>
      ))}
    </Screen>
  );
}

function setSummary(sets: number | null, reps: number | null): string {
  if (sets != null && reps != null) return `${sets} sets · ${reps} reps`;
  if (sets != null) return `${sets} sets`;
  if (reps != null) return `${reps} reps`;
  return "Logged";
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w) => (w.length > 0 ? (w[0] ?? "").toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  meta: { flex: 1, paddingRight: spacing.md },
  setLine: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  pr: {},
  weightWrap: { alignItems: "flex-end" },
});
