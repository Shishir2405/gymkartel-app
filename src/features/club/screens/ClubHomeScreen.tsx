import React from "react";
import { StyleSheet, View } from "react-native";
import {
  CalendarBlank,
  Trophy,
  MapTrifold,
  Cards,
  UserPlus,
  CaretRight,
} from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  ProgressBar,
  PressableRow,
  Divider,
  Skeleton,
  StatePlaceholder,
  Icon,
  colors,
  spacing,
  type PhosphorIcon,
} from "@/ui";
import type { MemberTabScreenProps } from "@/app/navigation/types";
import { useViewerQuery, useRankCardQuery } from "@/graphql/generated/graphql";

type ClubDestination =
  | "StreakCalendar"
  | "Leaderboards"
  | "TerritoryWars"
  | "CardGallery"
  | "Recruit";

interface ClubRow {
  readonly icon: PhosphorIcon;
  readonly label: string;
  readonly hint: string;
  readonly to: ClubDestination;
}

const ROWS: readonly ClubRow[] = [
  { icon: CalendarBlank, label: "Streak calendar", hint: "Your check-in days", to: "StreakCalendar" },
  { icon: Trophy, label: "Leaderboards", hint: "Zone, state and India", to: "Leaderboards" },
  { icon: MapTrifold, label: "Territory wars", hint: "Zones competing now", to: "TerritoryWars" },
  { icon: Cards, label: "Card gallery", hint: "Earned and locked cards", to: "CardGallery" },
  { icon: UserPlus, label: "Recruit", hint: "Invite and earn a bonus day", to: "Recruit" },
];

/**
 * Club home. The rank card is the hero: current rank in Barlow, a progress bar
 * toward the next rank, and the plain weeks-to-next line — all sourced from the
 * `rankCard` query with its public `thresholds` ladder. Streak comes from the
 * viewer query. Below the hero, quiet navigation rows lead to the five club
 * destinations, and the full rank ladder is listed plainly at the bottom.
 */
export function ClubHomeScreen({ navigation }: MemberTabScreenProps<"Club">) {
  const [viewer] = useViewerQuery();
  const [rank] = useRankCardQuery();

  const streak = viewer.data?.viewer?.streak.current ?? 0;
  const card = rank.data?.rankCard ?? null;

  const loading = rank.fetching && !card;
  const errored = Boolean(rank.error) && !card;

  const nextLabel = card?.next
    ? (card.thresholds.find((t) => t.key === card.next)?.label ?? card.next)
    : null;

  const fraction = (() => {
    if (!card) return 0;
    const currentMin = card.thresholds.find((t) => t.key === card.current)?.minWeeks ?? 0;
    const nextMin = card.next
      ? card.thresholds.find((t) => t.key === card.next)?.minWeeks ?? null
      : null;
    if (nextMin == null || nextMin <= currentMin) return 1;
    return Math.max(0, Math.min(1, (card.streakWeeks - currentMin) / (nextMin - currentMin)));
  })();

  return (
    <Screen scroll testID="club-home">
      <Text preset="title" style={styles.heading}>
        Club
      </Text>

      {loading ? (
        <Skeleton height={196} radius={16} />
      ) : errored ? (
        <View style={styles.errorBlock}>
          <StatePlaceholder
            variant="error"
            title="We could not load your club"
            body="Check your connection and try again."
          />
        </View>
      ) : card ? (
        <Card padded style={styles.hero}>
          <Text preset="label" color="secondary">
            YOUR RANK
          </Text>
          <Text preset="displayLarge" style={styles.rankName}>
            {card.label}
          </Text>

          <View style={styles.progressWrap}>
            <ProgressBar value={fraction} />
          </View>

          <Text preset="body" color="secondary" style={styles.progressLine}>
            {nextLabel && card.weeksToNext != null
              ? `${card.weeksToNext} ${card.weeksToNext === 1 ? "week" : "weeks"} to ${nextLabel}`
              : "Top rank held. Keep the streak alive."}
          </Text>

          <Divider style={styles.heroDivider} />

          <View style={styles.streakRow}>
            <Text preset="displayMedium">{streak}</Text>
            <Text preset="body" color="secondary" style={styles.streakLabel}>
              day streak. Check in today to extend it.
            </Text>
          </View>
        </Card>
      ) : null}

      {/* Navigation rows */}
      <Card padded={false} style={styles.rows}>
        {ROWS.map((row, index) => (
          <View key={row.to}>
            {index > 0 ? <Divider /> : null}
            <PressableRow
              testID={`club.nav.${row.to}`}
              onPress={() => navigation.navigate(row.to)}
              style={styles.navRow}
            >
              <View style={styles.navIcon}>
                <Icon icon={row.icon} size={22} color={colors.text.secondary} />
              </View>
              <View style={styles.navText}>
                <Text preset="bodyMedium">{row.label}</Text>
                <Text preset="body" color="secondary">
                  {row.hint}
                </Text>
              </View>
              <Icon icon={CaretRight} size={18} color={colors.text.disabled} />
            </PressableRow>
          </View>
        ))}
      </Card>

      {/* Rank ladder, stated plainly from the public thresholds */}
      {card ? (
        <>
          <Text preset="label" color="secondary" style={styles.ladderHeading}>
            RANK LADDER
          </Text>
          <Card padded>
            {card.thresholds.map((threshold, index) => {
              const isCurrent = threshold.key === card.current;
              return (
                <View key={threshold.key}>
                  {index > 0 ? <Divider style={styles.ladderDivider} /> : null}
                  <View style={styles.ladderRow}>
                    <Text preset="bodyMedium" color={isCurrent ? "accent" : "primary"}>
                      {threshold.label}
                    </Text>
                    <Text preset="body" color="secondary">
                      {threshold.minWeeks === 0
                        ? "Entry"
                        : `${threshold.minWeeks} ${threshold.minWeeks === 1 ? "week" : "weeks"}`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: spacing.lg },
  errorBlock: { height: 220 },
  hero: {},
  rankName: { marginTop: spacing.xs },
  progressWrap: { marginTop: spacing.lg },
  progressLine: { marginTop: spacing.sm },
  heroDivider: { marginVertical: spacing.lg },
  streakRow: { flexDirection: "row", alignItems: "center" },
  streakLabel: { marginLeft: spacing.md, flex: 1 },
  rows: { marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  navRow: { alignItems: "center" },
  navIcon: { width: 32 },
  navText: { flex: 1 },
  ladderHeading: { marginTop: spacing.xl, marginBottom: spacing.md },
  ladderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  ladderDivider: {},
});
