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
  StatePlaceholder,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import {
  leaderboardFor,
  SEASON_DAYS_LEFT,
  type LeaderboardScope,
  type LeaderboardEntry,
} from "@/features/club/data/mock";

const SCOPES: readonly LeaderboardScope[] = ["ZONE", "STATE", "INDIA"];

/**
 * Leaderboards. A custom segmented control (selected pill orange) switches
 * scope. The top three sit on a podium where only #1 carries the gold stroke.
 * A ranked list follows, and the viewer's own row is pinned to the bottom over
 * the list with an orange hairline so it is always visible.
 */
export function LeaderboardsScreen(_props: MemberScreenProps<"Leaderboards">) {
  const [scope, setScope] = useState<LeaderboardScope>("ZONE");
  const board = leaderboardFor(scope);

  const podium = board.filter((e) => !e.isViewer && e.rank <= 3);
  const rest = board.filter((e) => !e.isViewer && e.rank > 3);
  const viewer = board.find((e) => e.isViewer) ?? null;

  return (
    <Screen scroll={false} testID="leaderboards">
      <View style={styles.header}>
        <Text preset="title">Leaderboards</Text>
        <View style={styles.seasonChip}>
          <Icon icon={Timer} size={14} color={colors.text.secondary} />
          <Text preset="label" color="secondary" style={styles.seasonText}>
            Season ends in {SEASON_DAYS_LEFT} days
          </Text>
        </View>
      </View>

      {/* Segmented control */}
      <View style={styles.segments}>
        {SCOPES.map((s) => (
          <Chip
            key={s}
            label={s}
            selected={scope === s}
            onPress={() => setScope(s)}
          />
        ))}
      </View>

      {board.length === 0 ? (
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
                  <PodiumPillar key={entry.id} entry={entry} />
                ))}
              </View>
            ) : null}

            {/* Ranked list */}
            <Card padded={false} style={styles.listCard}>
              {rest.map((entry, index) => (
                <View key={entry.id}>
                  {index > 0 ? <Divider /> : null}
                  <RankRow entry={entry} />
                </View>
              ))}
            </Card>
          </ScrollView>

          {/* Sticky viewer row */}
          {viewer ? (
            <View style={styles.sticky}>
              <RankRow entry={viewer} emphasized />
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

function PodiumPillar({ entry }: { entry: LeaderboardEntry }) {
  const isFirst = entry.rank === 1;
  return (
    <View style={styles.pillar}>
      <View
        style={[
          styles.pillarAvatar,
          isFirst ? styles.pillarGold : styles.pillarNeutral,
        ]}
      >
        <Avatar name={entry.name} size={isFirst ? 60 : 48} />
      </View>
      <Text
        preset="label"
        color={isFirst ? "gold" : "secondary"}
        style={styles.pillarRank}
      >
        #{entry.rank}
      </Text>
      <Text preset="body" numberOfLines={1} style={styles.pillarName}>
        {entry.name}
      </Text>
      <Text preset="label" color="secondary">
        {entry.checkIns}
      </Text>
    </View>
  );
}

function RankRow({
  entry,
  emphasized = false,
}: {
  entry: LeaderboardEntry;
  emphasized?: boolean;
}) {
  return (
    <View style={styles.rankRow}>
      <Text
        preset="bodyMedium"
        color={emphasized ? "accent" : "secondary"}
        style={styles.rankNumber}
      >
        {entry.rank}
      </Text>
      <Avatar name={entry.name} size={36} />
      <View style={styles.rankBody}>
        <Text preset="bodyMedium" numberOfLines={1}>
          {entry.name}
        </Text>
        <Text preset="body" color="secondary">
          {entry.zone}
        </Text>
      </View>
      <Text preset="bodyMedium" color="secondary">
        {entry.checkIns}
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
