import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Screen,
  Text,
  Button,
  Chip,
  Divider,
  spacing,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { AMENITY_ORDER, amenityLabel } from "@/features/gyms/components/amenityIcon";

const RADII = [1, 3, 5, 10] as const; // km
const RATINGS = [3, 3.5, 4, 4.5] as const;
const SORTS = ["Nearest", "Busiest", "Top rated"] as const;

/**
 * Gym filters, presented as a sheet-style screen. Selected chips carry the
 * orange selection signature. Filter state is local for now (wiring to the
 * query is a later pass); the single bottom orange button applies and returns.
 */
export function GymFiltersScreen({ navigation }: MemberScreenProps<"GymFilters">) {
  const [amenities, setAmenities] = useState<Set<string>>(new Set());
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Nearest");

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a);
      else next.add(a);
      return next;
    });
  };

  return (
    <Screen
      scroll
      footer={<Button label="Show gyms" onPress={() => navigation.goBack()} />}
    >
      <Text preset="title">Filters</Text>

      <Text preset="label" color="secondary" style={styles.section}>
        AMENITIES
      </Text>
      <View style={styles.chips}>
        {AMENITY_ORDER.map((a) => (
          <Chip
            key={a}
            label={amenityLabel(a)}
            selected={amenities.has(a)}
            onPress={() => toggleAmenity(a)}
          />
        ))}
      </View>

      <Divider style={styles.divider} />

      <Text preset="label" color="secondary" style={styles.section}>
        DISTANCE RADIUS
      </Text>
      <View style={styles.chips}>
        {RADII.map((r) => (
          <Chip
            key={r}
            label={`${r} km`}
            selected={radiusKm === r}
            onPress={() => setRadiusKm(r)}
          />
        ))}
      </View>

      <Divider style={styles.divider} />

      <Text preset="label" color="secondary" style={styles.section}>
        MINIMUM RATING
      </Text>
      <View style={styles.chips}>
        <Chip
          label="Any"
          selected={minRating === null}
          onPress={() => setMinRating(null)}
        />
        {RATINGS.map((r) => (
          <Chip
            key={r}
            label={`${r.toFixed(1)}+`}
            selected={minRating === r}
            onPress={() => setMinRating(r)}
          />
        ))}
      </View>

      <Divider style={styles.divider} />

      <Text preset="label" color="secondary" style={styles.section}>
        SORT BY
      </Text>
      <View style={styles.chips}>
        {SORTS.map((s) => (
          <Chip
            key={s}
            label={s}
            selected={sort === s}
            onPress={() => setSort(s)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl, marginBottom: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  divider: { marginTop: spacing.xl },
});
