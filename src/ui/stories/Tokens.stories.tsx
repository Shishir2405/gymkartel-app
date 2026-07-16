import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { Meta, StoryObj } from "../../../.storybook/types";
import { colors, spacing, typePresets } from "../tokens";
import { Text } from "../components/Text";
import { Card } from "../components/Card";

function TokenLibrary() {
  const swatches: { name: string; value: string; locked?: string }[] = [
    { name: "bg/base", value: colors.bg.base },
    { name: "surface/raised", value: colors.surface.raised },
    { name: "surface/pressed", value: colors.surface.pressed },
    { name: "accent/primary (THE orange)", value: colors.accent.primary },
    { name: "accent/pressed", value: colors.accent.pressed },
    { name: "accent/gold (LOCKED)", value: colors.accent.gold, locked: "#1 rank + Legend only" },
    { name: "text/primary", value: colors.text.primary },
    { name: "text/secondary", value: colors.text.secondary },
    { name: "stroke/hairline", value: colors.stroke.hairline },
  ];

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text preset="label" color="secondary">
        COLOR
      </Text>
      <Card padded style={styles.block}>
        {swatches.map((s) => (
          <View key={s.name} style={styles.swatchRow}>
            <View style={[styles.swatch, { backgroundColor: s.value }]} />
            <View style={{ flex: 1 }}>
              <Text preset="bodyMedium">{s.name}</Text>
              <Text preset="label" color="secondary">
                {s.value}
                {s.locked ? ` · ${s.locked}` : ""}
              </Text>
            </View>
          </View>
        ))}
      </Card>

      <Text preset="label" color="secondary" style={{ marginTop: spacing.xl }}>
        TYPE SCALE
      </Text>
      <Card padded style={styles.block}>
        <Text style={typePresets.displayLarge}>DAY 47</Text>
        <Text preset="title" style={styles.typeRow}>
          Title · Inter SemiBold 20
        </Text>
        <Text preset="body" style={styles.typeRow}>
          Body · Inter 15
        </Text>
        <Text preset="label" color="secondary" style={styles.typeRow}>
          LABEL · INTER 12 UPPERCASE
        </Text>
      </Card>
    </ScrollView>
  );
}

const meta: Meta = {
  title: "Design System/Tokens",
  component: TokenLibrary,
};
export default meta;

export const Library: StoryObj = {
  name: "Token library",
  render: () => <TokenLibrary />,
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.base },
  content: { padding: spacing.screen },
  block: { marginTop: spacing.md },
  swatchRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    marginRight: spacing.md,
  },
  typeRow: { marginTop: spacing.md },
});
