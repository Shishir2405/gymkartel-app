import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../tokens";
import { Text } from "./Text";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  uncertain?: boolean;
  testID?: string;
}

export function Chip({ label, selected = false, onPress, uncertain = false, testID }: ChipProps) {
  return (
    <Pressable testID={testID} onPress={onPress} accessibilityRole="button">
      <View
        style={[
          styles.base,
          selected && styles.selected,
          uncertain && styles.uncertain,
        ]}
      >
        {uncertain ? (
          <Text preset="label" style={{ color: colors.support.warning, marginRight: spacing.xs }}>
            ?
          </Text>
        ) : null}
        <Text
          preset="label"
          style={{
            color: uncertain
              ? colors.support.warning
              : selected
                ? colors.accent.primary
                : colors.text.secondary,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
  },
  selected: {
    backgroundColor: colors.surface.pressed,
    borderWidth: 1.5,
    borderColor: colors.accent.primary,
  },
  uncertain: {
    borderWidth: 1.5,
    borderColor: colors.support.warning,
    backgroundColor: colors.surface.pressed,
  },
});
