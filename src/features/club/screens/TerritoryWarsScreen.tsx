import React from "react";
import { StyleSheet, View } from "react-native";
import { MapTrifold } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  ProgressBar,
  Badge,
  Icon,
  StatePlaceholder,
  colors,
  spacing,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { TERRITORIES, type Territory } from "@/features/club/data/mock";

export function TerritoryWarsScreen(_props: MemberScreenProps<"TerritoryWars">) {
  const leader = TERRITORIES.reduce((max, t) => Math.max(max, t.checkIns), 0);

  return (
    <Screen scroll testID="territory-wars">
      <Text preset="title" style={styles.heading}>
        Territory wars
      </Text>

      <Card padded style={styles.ruleCard}>
        <Text preset="label" color="secondary">
          HOW TERRITORY IS WON
        </Text>
        <Text preset="body" color="secondary" style={styles.ruleBody}>
          Every check-in adds to your zone total for the cycle. The zone with the
          most check-ins at the end holds the territory. Your check-ins count
          toward Bandra.
        </Text>
      </Card>

      {TERRITORIES.length === 0 ? (
        <View style={styles.errorBlock}>
          <StatePlaceholder
            variant="empty"
            icon={<Icon icon={MapTrifold} size={40} color={colors.text.secondary} />}
            title="No zones in play"
            body="Territory opens when zones start logging check-ins."
          />
        </View>
      ) : (
        <View style={styles.list}>
          {TERRITORIES.map((territory, index) => (
            <ZoneCard
              key={territory.id}
              territory={territory}
              position={index + 1}
              leader={leader}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

function ZoneCard({
  territory,
  position,
  leader,
}: {
  territory: Territory;
  position: number;
  leader: number;
}) {
  const fraction = leader > 0 ? territory.checkIns / leader : 0;
  const yours = territory.isYours === true;
  return (
    <Card
      padded
      style={[styles.zoneCard, yours ? styles.zoneYours : null]}
    >
      <View style={styles.zoneTop}>
        <View style={styles.zoneNameRow}>
          <Text preset="bodyMedium">
            {position}. {territory.zone}
          </Text>
          {yours ? <Badge label="YOUR ZONE" tone="accent" /> : null}
        </View>
        <Text preset="body" color="secondary">
          {territory.checkIns.toLocaleString("en-IN")}
        </Text>
      </View>
      <View style={styles.zoneMeter}>
        <ProgressBar value={fraction} tone={yours ? "accent" : "neutral"} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: spacing.lg },
  ruleCard: {},
  ruleBody: { marginTop: spacing.sm },
  errorBlock: { height: 260 },
  list: { marginTop: spacing.lg, gap: spacing.md },
  zoneCard: {},
  zoneYours: { borderColor: colors.accent.primary },
  zoneTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  zoneNameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  zoneMeter: { marginTop: spacing.md },
});
