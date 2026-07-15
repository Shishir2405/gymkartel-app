import React, { useEffect, useState } from "react";
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
import { MiniBarChart } from "@/features/ledger/components/MiniBarChart";
import {
  MOCK_BENCH_1RM,
  MOCK_BODYWEIGHT,
  type MetricSeries,
} from "@/features/ledger/data/mockLedger";

/**
 * Progress at a glance. No chart library — bars are plain Views scaled by value,
 * hairline axis, and the orange is spent only on the latest bar of each metric.
 */
export function ProgressChartsScreen(_props: MemberScreenProps<"ProgressCharts">) {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<MetricSeries[]>([]);

  useEffect(() => {
    const id = setTimeout(() => {
      setSeries([MOCK_BENCH_1RM, MOCK_BODYWEIGHT]);
      setLoading(false);
    }, 450);
    return () => clearTimeout(id);
  }, []);

  if (loading) {
    return (
      <Screen scroll>
        <Text preset="title">Progress</Text>
        <Skeleton height={220} radius={radius.card} style={{ marginTop: spacing.lg }} />
        <Skeleton height={220} radius={radius.card} style={{ marginTop: spacing.md }} />
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
                <MiniBarChart points={points} unit={metric.unit} />
              </View>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.swatch, styles.swatchMuted]} />
                  <Text preset="label" color="secondary">
                    Past
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.swatch, styles.swatchLatest]} />
                  <Text preset="label" color="secondary">
                    Latest
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  latestWrap: { flexDirection: "row", alignItems: "flex-end" },
  unit: { marginLeft: spacing.xs, marginBottom: spacing.xs },
  chart: { marginTop: spacing.lg },
  legend: { flexDirection: "row", gap: spacing.lg, marginTop: spacing.md },
  legendItem: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  swatch: { width: 12, height: 12, borderRadius: radius.sm / 2 },
  swatchMuted: { backgroundColor: colors.surface.raised, borderWidth: 1, borderColor: colors.stroke.hairline },
  swatchLatest: { backgroundColor: colors.accent.primary },
});
