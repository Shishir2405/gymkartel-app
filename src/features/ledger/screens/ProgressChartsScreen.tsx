import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ChartLineUp } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Skeleton,
  StatePlaceholder,
  SectionHeader,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { ProgressLineChart } from "@/features/ledger/components/ProgressLineChart";
import { toUiError } from "@/lib/errors";
import { useLedgerHistoryQuery, type LedgerEntryRowFragment } from "@/graphql/generated/graphql";

interface MetricSeries {
  label: string;
  unit: string;
  points: { date: string; value: number }[];
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function seriesFromHistory(entries: readonly LedgerEntryRowFragment[]): MetricSeries[] {
  const map = new Map<string, LedgerEntryRowFragment[]>();
  for (const entry of entries) {
    if (entry.chip.weightKg == null || !entry.chip.exercise) continue;
    const key = titleCase(entry.chip.exercise);
    const list = map.get(key) ?? [];
    list.push(entry);
    map.set(key, list);
  }
  const out: MetricSeries[] = [];
  for (const [label, list] of map.entries()) {
    const sorted = [...list].sort((a, b) => a.loggedAt.localeCompare(b.loggedAt));
    if (sorted.length < 2) continue;
    out.push({
      label,
      unit: "kg",
      points: sorted.map((e) => ({ date: shortDate(e.loggedAt), value: e.chip.weightKg ?? 0 })),
    });
  }
  return out;
}

export function ProgressChartsScreen(_props: MemberScreenProps<"ProgressCharts">) {
  const [{ data, fetching, error }, refetch] = useLedgerHistoryQuery();
  const uiError = toUiError(error);
  const series = useMemo(() => seriesFromHistory(data?.ledgerHistory ?? []), [data?.ledgerHistory]);

  if (fetching && !data) {
    return (
      <Screen scroll>
        <Text preset="title">Progress</Text>
        <Skeleton height={220} radius={radius.card} style={{ marginTop: spacing.lg }} />
        <Skeleton height={220} radius={radius.card} style={{ marginTop: spacing.md }} />
      </Screen>
    );
  }

  if (uiError) {
    return (
      <Screen>
        <StatePlaceholder
          icon={<ChartLineUp size={40} color={colors.text.secondary} />}
          variant={uiError.code === "OFFLINE" ? "offline" : "error"}
          title="We could not load your progress"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      </Screen>
    );
  }

  if (series.length === 0) {
    return (
      <Screen>
        <StatePlaceholder
          icon={<ChartLineUp size={40} color={colors.text.secondary} />}
          variant="empty"
          title="No progress yet"
          body="A few logged sessions and your trends draw themselves here."
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text preset="title">Progress</Text>
      {series.map((metric) => {
        const points = metric.points;
        const first = points[0];
        const last = points[points.length - 1];
        const delta =
          first && last ? Math.round((last.value - first.value) * 10) / 10 : 0;
        const up = delta >= 0;
        return (
          <View key={metric.label}>
            <SectionHeader title={metric.label} />
            <Card padded>
              <View style={styles.headRow}>
                <View style={styles.latestWrap}>
                  <Text preset="displayMedium">{last?.value ?? "-"}</Text>
                  <Text preset="label" color="secondary" style={styles.unit}>
                    {metric.unit}
                  </Text>
                </View>
                <Text preset="body" color="secondary">
                  {up ? "+" : ""}
                  {delta} {metric.unit} since {first?.date ?? ""}
                </Text>
              </View>
              <View style={styles.chart}>
                <ProgressLineChart points={points} unit={metric.unit} />
              </View>
            </Card>
          </View>
        );
      })}
    </Screen>
  );
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w) => (w.length > 0 ? (w[0] ?? "").toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const styles = StyleSheet.create({
  headRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  latestWrap: { flexDirection: "row", alignItems: "flex-end" },
  unit: { marginLeft: spacing.xs, marginBottom: spacing.xs },
  chart: { marginTop: spacing.lg },
});
