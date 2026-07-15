import React, { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { UsersThree, SlidersHorizontal } from "phosphor-react-native";
import {
  Text,
  Button,
  Skeleton,
  StatePlaceholder,
  colors,
  spacing,
} from "@/ui";
import { Screen } from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import {
  useCoachesQuery,
  type CoachCardFragment,
  type CoachesQueryVariables,
} from "@/graphql/generated/graphql";
import { toUiError } from "@/lib/errors";
import { CoachCard } from "../components/CoachCard";
import { useCoachFilters } from "../hooks/useCoachFilters";

/**
 * Coach browse — a two-column grid of coaches. Price is UPFRONT on every card.
 * Filters live behind a quiet secondary button; the selection is applied to the
 * query variables (specialty / femaleOnly / maxPrice) and, for rating, to the
 * list client-side.
 */
export function CoachBrowseScreen({ navigation }: MemberScreenProps<"CoachBrowse">) {
  const { specialty, maxPricePaise, femaleOnly, minRating } = useCoachFilters();

  const variables = useMemo<CoachesQueryVariables>(() => {
    const v: CoachesQueryVariables = {};
    if (specialty) v.specialty = specialty;
    if (femaleOnly) v.femaleOnly = true;
    if (maxPricePaise != null) v.maxPricePaise = maxPricePaise;
    return v;
  }, [specialty, femaleOnly, maxPricePaise]);

  const [{ data, fetching, error }, refetch] = useCoachesQuery({ variables });
  const uiError = toUiError(error);

  const coaches = useMemo<CoachCardFragment[]>(() => {
    const list = data?.coaches ?? [];
    if (minRating == null) return list;
    return list.filter((c) => (c.ratingAverage ?? 0) >= minRating);
  }, [data?.coaches, minRating]);

  const filtersActive = Boolean(specialty || femaleOnly || maxPricePaise != null || minRating != null);

  const header = (
    <View style={styles.header}>
      <Text preset="title">Coaches</Text>
      <Button
        label={filtersActive ? "Filters ·" : "Filters"}
        variant="secondary"
        fullWidth={false}
        icon={<SlidersHorizontal size={16} color={colors.text.primary} />}
        onPress={() => navigation.navigate("CoachFilters")}
      />
    </View>
  );

  if (fetching && coaches.length === 0) {
    return (
      <Screen>
        {header}
        <View style={styles.grid}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.gridItem}>
              <Skeleton height={220} radius={16} />
            </View>
          ))}
        </View>
      </Screen>
    );
  }

  if (uiError) {
    return (
      <Screen>
        {header}
        <StatePlaceholder
          variant="error"
          title="We could not load coaches"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      </Screen>
    );
  }

  if (coaches.length === 0) {
    return (
      <Screen>
        {header}
        {filtersActive ? (
          <StatePlaceholder
            variant="empty"
            icon={<UsersThree size={40} color={colors.text.secondary} />}
            title="No coaches match these filters"
            body="Try widening your price or rating."
            actionLabel="Edit filters"
            onAction={() => navigation.navigate("CoachFilters")}
          />
        ) : (
          <StatePlaceholder
            variant="empty"
            icon={<UsersThree size={40} color={colors.text.secondary} />}
            title="No coaches yet"
            body="Coaches appear here once they are onboarded in your zone."
          />
        )}
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={coaches}
        keyExtractor={(c) => c.id}
        numColumns={2}
        ListHeaderComponent={<View style={styles.headerPad}>{header}</View>}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <CoachCard
              coach={item}
              onPress={() => navigation.navigate("CoachProfile", { coachId: item.id })}
            />
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  headerPad: { paddingTop: spacing.sm },
  list: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
  column: { gap: spacing.md },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  gridItem: { flex: 1, marginBottom: spacing.md },
});
