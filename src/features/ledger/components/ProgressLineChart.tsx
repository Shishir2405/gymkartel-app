import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import type { lineDataItem } from "react-native-gifted-charts";
import { Text, colors, fontFamily, spacing } from "@/ui";

export interface ProgressPoint {
  /** Short axis label, e.g. "15 Jul". */
  date: string;
  value: number;
}

export interface ProgressLineChartProps {
  /** Ordered oldest -> newest. */
  points: readonly ProgressPoint[];
  unit: string;
  height?: number;
}

/** Barlow-Condensed numerals for every axis figure (design system rule). */
const axisTextStyle = {
  color: colors.text.secondary,
  fontFamily: fontFamily.numberBold,
  fontSize: 12,
} as const;

/**
 * The real progress chart: a react-native-gifted-charts line chart styled in the
 * Soft-Dark palette. The line and its data points are the one orange element;
 * the grid is a single hairline; axis numerals are Barlow Condensed. Under two
 * points there is no trend to draw, so it shows a calm one-liner instead.
 */
export function ProgressLineChart({ points, unit, height = 160 }: ProgressLineChartProps) {
  const data: lineDataItem[] = useMemo(
    () =>
      points.map((p) => ({
        value: p.value,
        label: p.date,
        labelTextStyle: axisTextStyle,
      })),
    [points],
  );

  if (points.length < 2) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text preset="body" color="secondary" align="center">
          A couple more logged sessions and the trend draws itself.
        </Text>
      </View>
    );
  }

  const values = points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  // Pad the range a touch so the line never hugs the top/bottom edge.
  const pad = (max - min || max || 1) * 0.15;

  // Fit the chart inside the card without horizontal scroll.
  const screenW = Dimensions.get("window").width;
  const yAxisLabelWidth = 44;
  const chartWidth = Math.max(screenW - 2 * spacing.screen - 2 * spacing.lg - yAxisLabelWidth, 200);
  const step = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

  return (
    <View style={styles.wrap} testID="progress-line-chart">
      <LineChart
        data={data}
        height={height}
        width={chartWidth}
        adjustToWidth
        disableScroll
        curved
        thickness={2}
        color={colors.accent.primary}
        dataPointsColor={colors.accent.primary}
        dataPointsRadius={3}
        startFillColor={colors.accent.primary}
        // Hairline grid + axes on the palette stroke token.
        rulesColor={colors.stroke.hairline}
        rulesThickness={1}
        yAxisColor={colors.stroke.hairline}
        xAxisColor={colors.stroke.hairline}
        yAxisThickness={1}
        xAxisThickness={1}
        noOfSections={3}
        maxValue={Math.ceil(max + pad)}
        yAxisOffset={Math.floor(Math.max(min - pad, 0))}
        yAxisTextStyle={axisTextStyle}
        yAxisTextNumberOfLines={1}
        yAxisLabelWidth={yAxisLabelWidth}
        xAxisLabelTextStyle={axisTextStyle}
        initialSpacing={step / 2}
        endSpacing={step / 2}
        spacing={step}
        backgroundColor="transparent"
        hideDataPoints={false}
      />
      <Text preset="label" color="secondary" style={styles.unit}>
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden" },
  empty: { alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.md },
  unit: { marginTop: spacing.sm },
});
