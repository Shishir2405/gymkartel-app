import React from "react";
import { StyleSheet, Switch, View } from "react-native";
import { Text, Button, Chip, Divider, colors, spacing } from "@/ui";
import { Screen } from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { formatRupees } from "@/lib/format";
import {
  useCoachFilters,
  COACH_SPECIALTIES,
  COACH_PRICE_STEPS_PAISE,
  COACH_RATING_STEPS,
} from "../hooks/useCoachFilters";

/**
 * Coach filters. Selected chips carry the orange inset (the design system's
 * selection signature). Selection is stored in the client filter store and
 * applied by Browse on goBack. The one orange action sits at the bottom.
 */
export function CoachFiltersScreen({ navigation }: MemberScreenProps<"CoachFilters">) {
  const { specialty, maxPricePaise, minRating, femaleOnly, set, reset } = useCoachFilters();

  return (
    <Screen
      scroll
      footer={<Button label="Show coaches" onPress={() => navigation.goBack()} />}
    >
      <View style={styles.head}>
        <Text preset="title">Filters</Text>
        <Button label="Reset" variant="ghost" fullWidth={false} onPress={() => reset()} />
      </View>

      <Text preset="label" color="secondary" style={styles.section}>
        SPECIALTY
      </Text>
      <View style={styles.chips}>
        {COACH_SPECIALTIES.map((s) => (
          <Chip
            key={s}
            label={s}
            selected={specialty === s}
            onPress={() => set({ specialty: specialty === s ? null : s })}
          />
        ))}
      </View>

      <Divider style={styles.divider} />

      <Text preset="label" color="secondary" style={styles.section}>
        MAX PRICE
      </Text>
      <View style={styles.chips}>
        {COACH_PRICE_STEPS_PAISE.map((p) => (
          <Chip
            key={p}
            label={`Under ${formatRupees(p)}`}
            selected={maxPricePaise === p}
            onPress={() => set({ maxPricePaise: maxPricePaise === p ? null : p })}
          />
        ))}
      </View>

      <Divider style={styles.divider} />

      <Text preset="label" color="secondary" style={styles.section}>
        MINIMUM RATING
      </Text>
      <View style={styles.chips}>
        {COACH_RATING_STEPS.map((r) => (
          <Chip
            key={r}
            label={`${r.toFixed(1)} and up`}
            selected={minRating === r}
            onPress={() => set({ minRating: minRating === r ? null : r })}
          />
        ))}
      </View>

      <Divider style={styles.divider} />

      <View style={styles.toggleRow}>
        <View style={styles.toggleText}>
          <Text preset="bodyMedium">Female coaches</Text>
          <Text preset="body" color="secondary">
            Show only coaches who train women
          </Text>
        </View>
        <Switch
          value={femaleOnly}
          onValueChange={(v) => set({ femaleOnly: v })}
          trackColor={{ true: colors.accent.primary, false: colors.surface.pressed }}
          thumbColor={colors.text.primary}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  section: { marginTop: spacing.lg, marginBottom: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  divider: { marginTop: spacing.xl },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  toggleText: { flex: 1 },
});
