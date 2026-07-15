import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Star } from "phosphor-react-native";
import {
  PASS_LADDER,
  passPrice,
  passPerDayPrice,
  type Tier,
  type PassPack,
} from "@gymkartel/contracts";
import {
  Screen,
  Text,
  Card,
  Button,
  Badge,
  PressableRow,
  Skeleton,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { usePassLadderQuery, useViewerQuery } from "@/graphql/generated/graphql";
import { formatRupees, formatPerDay } from "@/lib/format";

interface LadderRow {
  pack: PassPack;
  days: number;
  pricePaise: number;
  perDayPaise: number;
  badge: "MOST_CHOSEN" | "BEST_RATE" | null;
  rankMultiplier: number | null;
  emphasized: boolean;
}

const TIER_NOTE: Record<Tier, string> = {
  BASIC: "one pass, every BASIC gym",
  STANDARD: "one pass, every STANDARD gym",
  PREMIUM: "one pass, every PREMIUM gym",
};

/**
 * The pass ladder (Flow 2). The viewer's tier is locked at the top — we never
 * show every tier at once. Rows: Day / 7 / 15 (MOST CHOSEN, emphasized) /
 * 30 (BEST RATE + 2× rank). The 7-day is the decoy: rendered plainly, no badge,
 * visibly worse per-day than the 15-day. Prices come only from the contract.
 */
export function PassLadderScreen({ navigation }: MemberScreenProps<"PassLadder">) {
  const [{ data: viewerData, fetching: viewerFetching }] = useViewerQuery();
  const [{ data: ladderData }] = usePassLadderQuery();

  const tier: Tier = viewerData?.viewer?.tier ?? "STANDARD";

  const rows: LadderRow[] = useMemo(() => {
    const server = ladderData?.passLadder;
    if (server && server.length > 0) {
      return server.map((r) => ({
        pack: r.pack as PassPack,
        days: r.days,
        pricePaise: r.pricePaise,
        perDayPaise: r.perDayPaise,
        badge: (r.badge as LadderRow["badge"]) ?? null,
        rankMultiplier: r.rankMultiplier ?? null,
        emphasized: r.emphasized,
      }));
    }
    // Derive locally from the contract using the viewer's tier.
    return PASS_LADDER.map((r) => ({
      pack: r.pack,
      days: r.days,
      pricePaise: passPrice(tier, r.pack),
      perDayPaise: passPerDayPrice(tier, r.pack),
      badge: r.badge ?? null,
      rankMultiplier: r.rankMultiplier ?? null,
      emphasized: r.emphasized ?? false,
    }));
  }, [ladderData, tier]);

  const defaultPack: PassPack =
    rows.find((r) => r.emphasized)?.pack ?? rows[0]?.pack ?? "FIFTEEN_DAY";
  const [selected, setSelected] = useState<PassPack>(defaultPack);

  const selectedRow = rows.find((r) => r.pack === selected) ?? rows[0];

  if (viewerFetching && rows.length === 0) {
    return (
      <Screen scroll>
        <Skeleton height={72} radius={radius.card} />
        <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={96} radius={radius.card} />
          ))}
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      footer={
        <Button
          label={`Get your Pass · ${selectedRow ? formatRupees(selectedRow.pricePaise) : ""}`}
          onPress={() =>
            navigation.navigate("Payment", { pack: selected })
          }
        />
      }
    >
      <Text preset="title">Choose your Pass</Text>

      {/* Viewer tier — locked at the top, never all tiers at once. */}
      <Card padded style={styles.tierCard}>
        <Text preset="label" color="secondary">
          YOUR TIER
        </Text>
        <Text preset="bodyMedium" style={{ marginTop: 4 }}>
          {tier} — {TIER_NOTE[tier]}
        </Text>
      </Card>

      <View style={styles.rows}>
        {rows.map((row) => (
          <PackRow
            key={row.pack}
            row={row}
            selected={row.pack === selected}
            onPress={() => setSelected(row.pack)}
          />
        ))}
      </View>

      <Text preset="body" color="secondary" style={styles.wait}>
        Your days wait for you — 60-day window.
      </Text>
    </Screen>
  );
}

function PackRow({
  row,
  selected,
  onPress,
}: {
  row: LadderRow;
  selected: boolean;
  onPress: () => void;
}) {
  const badgeLabel =
    row.badge === "MOST_CHOSEN"
      ? "MOST CHOSEN"
      : row.badge === "BEST_RATE"
        ? "BEST RATE"
        : null;

  return (
    <Card
      padded
      elevation={selected ? "pressed" : "raised"}
      style={[styles.rowCard, selected && styles.rowSelected]}
    >
      <PressableRow onPress={onPress} style={styles.rowInner}>
        <View style={styles.rowMain}>
          <View style={styles.rowTop}>
            <Text preset="bodyMedium">
              {row.days} {row.days === 1 ? "day" : "days"}
            </Text>
            {badgeLabel ? (
              <Badge label={badgeLabel} tone="accent" />
            ) : null}
            {row.rankMultiplier && row.rankMultiplier > 1 ? (
              <View style={styles.rankPill}>
                <Star size={12} weight="fill" color={colors.accent.primary} />
                <Text preset="label" color="accent" style={{ marginLeft: 4 }}>
                  {row.rankMultiplier}× RANK
                </Text>
              </View>
            ) : null}
          </View>
          <Text preset="body" color="secondary" style={{ marginTop: 4 }}>
            {formatPerDay(row.perDayPaise)}
          </Text>
        </View>
        <View style={styles.rowRight}>
          <Text preset={row.emphasized ? "displayMedium" : "bodyMedium"}>
            {formatRupees(row.pricePaise)}
          </Text>
        </View>
      </PressableRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  tierCard: { marginTop: spacing.lg },
  rows: { marginTop: spacing.xl, gap: spacing.md },
  wait: { marginTop: spacing.xl, textAlign: "center" },
  rowCard: {},
  rowSelected: { borderColor: colors.accent.primary, borderWidth: 1.5 },
  rowInner: {
    paddingVertical: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowMain: { flex: 1 },
  rowTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  rankPill: { flexDirection: "row", alignItems: "center" },
  rowRight: { marginLeft: spacing.md, alignItems: "flex-end" },
});
