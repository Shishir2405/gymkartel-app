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
import { useViewerQuery } from "@/graphql/generated/graphql";
import { RANK_LADDER, MOCK_CHECK_INS, rankProgress } from "@/features/club/data/mock";

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
 * toward the next rank, and the plain remaining-check-ins line. Streak comes
 * from the viewer query; rank and ladder are local mock data. Below the hero,
 * quiet navigation rows lead to the five club destinations, and the full rank
 * ladder is listed plainly at the bottom.
 */
export function ClubHomeScreen({ navigation }: MemberTabScreenProps<"Club">) {
  const [viewer] = useViewerQuery();
  const data = viewer.data?.viewer ?? null;
  const streak = data?.streak.current ?? 0;
  const progress = rankProgress(MOCK_CHECK_INS);

  const loading = viewer.fetching && !data;
  const errored = Boolean(viewer.error) && !data;

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
      ) : (
        <Card padded style={styles.hero}>
          <Text preset="label" color="secondary">
            YOUR RANK
          </Text>
          <Text preset="displayLarge" style={styles.rankName}>
            {progress.current.name}
          </Text>

          <View style={styles.progressWrap}>
            <ProgressBar value={progress.fraction} />
          </View>

          <Text preset="body" color="secondary" style={styles.progressLine}>
            {progress.next
              ? `${progress.remaining} check-ins to ${progress.next.name}`
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
      )}

      {/* Navigation rows */}
      <Card padded={false} style={styles.rows}>
        {ROWS.map((row, index) => (
          <View key={row.to}>
            {index > 0 ? <Divider /> : null}
            <PressableRow
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

      {/* Rank ladder, stated plainly */}
      <Text preset="label" color="secondary" style={styles.ladderHeading}>
        RANK LADDER
      </Text>
      <Card padded>
        {RANK_LADDER.map((rank, index) => {
          const isCurrent = rank.name === progress.current.name;
          return (
            <View key={rank.name}>
              {index > 0 ? <Divider style={styles.ladderDivider} /> : null}
              <View style={styles.ladderRow}>
                <Text
                  preset="bodyMedium"
                  color={isCurrent ? "accent" : "primary"}
                >
                  {rank.name}
                </Text>
                <Text preset="body" color="secondary">
                  {rank.checkInsRequired === 0
                    ? "Entry"
                    : `${rank.checkInsRequired} check-ins`}
                </Text>
              </View>
            </View>
          );
        })}
      </Card>
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
