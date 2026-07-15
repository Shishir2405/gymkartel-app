import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, colors, radius, spacing } from "@/ui";

export interface MiniBarChartProps {
  /** Ordered oldest -> newest. */
  points: { date: string; value: number }[];
  unit: string;
  /** Total chart drawing height in px. */
  height?: number;
}

/**
 * A lightweight bar chart drawn entirely with Views — no chart library. Bars are
 * scaled between the series min and max so movement is visible even on a tight
 * range. Only the latest (highest-recency) bar gets the orange; the rest stay
 * quiet grey. A single hairline sits under the bars as the axis.
 */
export function MiniBarChart({ points, unit, height = 128 }: MiniBarChartProps) {
  if (points.length === 0) return null;

  const values = points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const latestIdx = points.length - 1;

  return (
    <View>
      <View style={[styles.plot, { height }]}>
        {points.map((p, i) => {
          // Floor at ~14% so the shortest bar is still a legible block.
          const frac = 0.14 + 0.86 * ((p.value - min) / span);
          const isLatest = i === latestIdx;
          return (
            <View key={`${p.date}-${i}`} style={styles.col}>
              <Text preset="label" color="secondary" style={styles.valueLabel}>
                {p.value}
              </Text>
              <View
                style={[
                  styles.bar,
                  { height: Math.round(frac * (height - 22)) },
                  isLatest ? styles.barLatest : styles.barMuted,
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.axis} />
      <View style={styles.plot}>
        {points.map((p, i) => (
          <View key={`x-${p.date}-${i}`} style={styles.col}>
            <Text preset="label" color="secondary" numberOfLines={1} style={styles.axisLabel}>
              {p.date}
            </Text>
          </View>
        ))}
      </View>
      <Text preset="label" color="secondary" style={styles.unit}>
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  plot: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  col: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  valueLabel: { marginBottom: spacing.xs, letterSpacing: 0 },
  bar: {
    width: "72%",
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },
  barMuted: { backgroundColor: colors.surface.raised, borderWidth: 1, borderColor: colors.stroke.hairline },
  barLatest: { backgroundColor: colors.accent.primary },
  axis: { height: 1, backgroundColor: colors.stroke.hairline, marginTop: spacing.xs },
  axisLabel: { marginTop: spacing.xs, letterSpacing: 0 },
  unit: { marginTop: spacing.sm },
});
