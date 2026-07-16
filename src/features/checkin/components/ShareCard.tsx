import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, colors, spacing } from "../../../ui";
import { formatDate } from "../../../lib/format";

export type ShareTemplate = "classic" | "mono" | "bold";

export interface ShareCardProps {
  template: ShareTemplate;
  gymName: string;
  dayNumber: number;
  streak: number;
  rank: string;
  date: string;
  full?: boolean;
}

export function ShareCard({
  template,
  gymName,
  dayNumber,
  streak,
  rank,
  date,
}: ShareCardProps) {
  const bg =
    template === "mono"
      ? colors.surface.pressed
      : template === "bold"
        ? colors.accent.primary
        : colors.bg.base;
  const onBold = template === "bold";
  const figureColor = onBold ? colors.text.primary : colors.accent.primary;
  const textColor = onBold ? colors.text.primary : colors.text.primary;

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <Text preset="label" style={{ color: onBold ? colors.text.primary : colors.text.secondary }}>
        GYM KARTEL
      </Text>

      <View style={styles.center}>
        <Text preset="label" style={{ color: onBold ? colors.text.primary : colors.text.secondary }}>
          THE RECORD
        </Text>
        <Text style={[styles.day, { color: figureColor }]}>DAY {dayNumber}</Text>
        <Text preset="title" style={{ color: textColor, marginTop: spacing.sm }} numberOfLines={2}>
          {gymName}
        </Text>
      </View>

      <View style={styles.footer}>
        <Footer label="STREAK" value={`${streak}`} bold={onBold} />
        <Footer label="RANK" value={rank} bold={onBold} />
        <Footer label="DATE" value={formatDate(date)} bold={onBold} />
      </View>
    </View>
  );
}

function Footer({ label, value, bold }: { label: string; value: string; bold: boolean }) {
  return (
    <View>
      <Text preset="label" style={{ color: bold ? "rgba(245,240,235,0.7)" : colors.text.secondary }}>
        {label}
      </Text>
      <Text preset="bodyMedium" style={{ color: colors.text.primary, marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

const RATIO = 9 / 16;
const WIDTH = 320;

const styles = StyleSheet.create({
  card: {
    width: WIDTH,
    height: WIDTH / RATIO,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    padding: spacing.xl,
    justifyContent: "space-between",
  },
  center: { alignItems: "flex-start", marginTop: spacing.xxxl },
  day: {
    fontFamily: "BarlowCondensed_600SemiBold",
    fontSize: 96,
    lineHeight: 96,
    marginTop: spacing.md,
  },
  footer: { flexDirection: "row", justifyContent: "space-between" },
});
