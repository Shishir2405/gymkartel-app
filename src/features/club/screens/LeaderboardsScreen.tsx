import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Timer, Trophy } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Chip,
  Divider,
  Avatar,
  Icon,
  Skeleton,
  StatePlaceholder,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { toUiError } from "@/lib/errors";
import {
  useLeaderboardQuery,
  LeaderboardSegment,
  type LeaderboardEntryRowFragment,
} from "@/graphql/generated/graphql";

const SCOPES: readonly LeaderboardSegment[] = [
  LeaderboardSegment.Zone,
  LeaderboardSegment.State,
  LeaderboardSegment.India,
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** "2026-07" -> "July 2026". Falls back to the raw key if it can't parse. */
function seasonLabel(season: string): string {
  const parts = season.split("-");
  const year = parts[0];
  const monthIdx = Number(parts[1]) - 1;
  const month = MONTHS[monthIdx];
  return month && year ? `${month} ${year}` : season;
}

/**
 * Leaderboards. A custom segmented control (selected pill orange) switches
 * scope, re-querying `leaderboard` per segment. The top three sit on a podium
 * where only #1 carries the gold stroke. A ranked list follows, and the
 * viewer's own row — from the server's sticky `self` (or an `isSelf` page row)
 * — is pinned to the bottom with an orange hairline so it is always visible.
 */
export function LeaderboardsScreen(_props: MemberScreenProps<"Leaderboards">) {
  const [scope, setScope] = useState<LeaderboardSegment>(LeaderboardSegment.Zone);
  const [{ data, fetching, error }, refetch] = useLeaderboardQuery({
    variables: { segment: scope },
  });
  const uiError = toUiError(error);

  const board = data?.leaderboard ?? null;
  const page = board?.page ?? [];
  const podium = page.filter((e) => e.position <= 3);
  const rest = page.filter((e) => e.position > 3);
  const selfEntry = board?.self ?? page.find((e) => e.isSelf) ?? null;

  const header = (
    <View style={styles.header}>
      <Text preset="title">Leaderboards</Text>
      {board ? (
        <View style={styles.seasonChip}>
          <Icon icon={Timer} size={14} color={colors.text.secondary} />
          <Text preset="label" color="secondary" style={styles.seasonText}>
            {seasonLabel(board.season)} season
          </Text>
        </View>
      ) : null}
    </View>
  );

  const segments = (
    <View style={styles.segments}>
      {SCOPES.map((s) => (
        <Chip
          key={s}
          testID={`leaderboards.segment.${s}`}
          label={s}
          selected={scope === s}
          onPress={() => setScope(s)}
        />
      ))}
    </View>
  );

  return (
    <Screen scroll={false} testID="leaderboards">
      {header}
      {segments}

      {uiError ? (
        <StatePlaceholder
          variant={uiError.code === "OFFLINE" ? "offline" : "error"}
          icon={<Icon icon={Trophy} size={40} color={colors.text.secondary} />}
          title="We could not load the board"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      ) : fetching && !board ? (
        <View style={styles.flex}>
          <Skeleton height={140} radius={radius.card} style={{ marginBottom: spacing.md }} />
          <Skeleton height={72} radius={radius.card} style={{ marginBottom: spacing.md }} />
          <Skeleton height={72} radius={radius.card} />
        </View>
      ) : page.length === 0 ? (
        <StatePlaceholder
          variant="empty"
          icon={<Icon icon={Trophy} size={40} color={colors.text.secondary} />}
          title="No standings yet"
          body="Check in this season to appear on the board."
        />
      ) : (
        <>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Podium — only #1 gets the gold stroke */}
            {podium.length > 0 ? (
              <View style={styles.podium}>
                {podium.map((entry) => (
                  <PodiumPillar key={entry.userId} entry={entry} />
                ))}
              </View>
            ) : null}

            {/* Ranked list */}
            <Card padded={false} style={styles.listCard}>
              {rest.map((entry, index) => (
                <View key={entry.userId}>
                  {index > 0 ? <Divider /> : null}
                  <RankRow entry={entry} />
                </View>
              ))}
            </Card>
          </ScrollView>

          {/* Sticky viewer row */}
          {selfEntry ? (
            <View style={styles.sticky} testID="leaderboards.self">
              <RankRow entry={selfEntry} emphasized />
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

function PodiumPillar({ entry }: { entry: LeaderboardEntryRowFragment }) {
  const isFirst = entry.position === 1;
  return (
    <View style={styles.pillar}>
      <View
        style={[
          styles.pillarAvatar,
          isFirst ? styles.pillarGold : styles.pillarNeutral,
        ]}
      >
        <Avatar name={entry.displayName} size={isFirst ? 60 : 48} />
      </View>
      <Text
        preset="label"
        color={isFirst ? "gold" : "secondary"}
        style={styles.pillarRank}
      >
        #{entry.position}
      </Text>
      <Text preset="body" numberOfLines={1} style={styles.pillarName}>
        {entry.displayName}
      </Text>
      <Text preset="label" color="secondary">
        {entry.totalCheckIns}
      </Text>
    </View>
  );
}

function RankRow({
  entry,
  emphasized = false,
}: {
  entry: LeaderboardEntryRowFragment;
  emphasized?: boolean;
}) {
  return (
    <View style={styles.rankRow}>
      <Text
        preset="bodyMedium"
        color={emphasized ? "accent" : "secondary"}
        style={styles.rankNumber}
      >
        {entry.position}
      </Text>
      <Avatar name={entry.displayName} size={36} />
      <View style={styles.rankBody}>
        <Text preset="bodyMedium" numberOfLines={1}>
          {entry.isSelf ? "You" : entry.displayName}
        </Text>
        <Text preset="body" color="secondary">
          {entry.streak} day streak
        </Text>
      </View>
      <Text preset="bodyMedium" color="secondary">
        {entry.totalCheckIns}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  seasonChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
  },
  seasonText: {},
  segments: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  listContent: { paddingBottom: 96 },
  podium: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    marginBottom: spacing.xl,
  },
  pillar: { alignItems: "center", flex: 1 },
  pillarAvatar: {
    borderRadius: radius.pill,
    padding: 3,
    borderWidth: 2,
  },
  pillarGold: { borderColor: colors.accent.gold },
  pillarNeutral: { borderColor: colors.stroke.hairline },
  pillarRank: { marginTop: spacing.sm },
  pillarName: { marginTop: 2, maxWidth: 96 },
  listCard: { paddingHorizontal: spacing.lg },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rankNumber: { width: 36 },
  rankBody: { flex: 1 },
  sticky: {
    position: "absolute",
    left: spacing.screen,
    right: spacing.screen,
    bottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.accent.primary,
    backgroundColor: colors.surface.raised,
  },
});
