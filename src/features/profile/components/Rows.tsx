import React from "react";
import { StyleSheet, Switch, View } from "react-native";
import { CaretRight } from "phosphor-react-native";
import { Text, PressableRow, Divider, colors, spacing } from "@/ui";
import type { PhosphorIcon } from "@/ui";

export function NavRow({
  icon,
  label,
  subtitle,
  onPress,
  destructive = false,
  showCaret = true,
}: {
  icon?: PhosphorIcon;
  label: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
  showCaret?: boolean;
}) {
  const IconGlyph = icon;
  const tint = destructive ? colors.accent.primary : colors.text.secondary;
  return (
    <PressableRow onPress={onPress} style={styles.row}>
      {IconGlyph ? (
        <View style={styles.leading}>
          <IconGlyph size={22} color={tint} />
        </View>
      ) : null}
      <View style={styles.body}>
        <Text
          preset="bodyMedium"
          style={destructive ? { color: colors.accent.primary } : undefined}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text preset="body" color="secondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {showCaret && !destructive ? (
        <CaretRight size={18} color={colors.text.disabled} />
      ) : null}
    </PressableRow>
  );
}

export function ToggleRow({
  icon,
  label,
  subtitle,
  value,
  onValueChange,
}: {
  icon?: PhosphorIcon;
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  const IconGlyph = icon;
  return (
    <View style={styles.row}>
      {IconGlyph ? (
        <View style={styles.leading}>
          <IconGlyph size={22} color={colors.text.secondary} />
        </View>
      ) : null}
      <View style={styles.body}>
        <Text preset="bodyMedium">{label}</Text>
        {subtitle ? (
          <Text preset="body" color="secondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.accent.primary, false: colors.surface.pressed }}
        thumbColor={colors.text.primary}
        ios_backgroundColor={colors.surface.pressed}
      />
    </View>
  );
}

export function RowDivider() {
  return <Divider style={styles.divider} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  leading: { width: 34 },
  body: { flex: 1 },
  subtitle: { marginTop: 2 },
  divider: { marginVertical: spacing.xs },
});
