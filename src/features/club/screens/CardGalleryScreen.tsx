import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { LockSimple, Seal } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Badge,
  Divider,
  PressableRow,
  Icon,
  Sheet,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { CARDS, type CollectibleCard } from "@/features/club/data/mock";

export function CardGalleryScreen(_props: MemberScreenProps<"CardGallery">) {
  const [active, setActive] = useState<CollectibleCard | null>(null);
  const earnedCount = CARDS.filter((c) => c.earned).length;

  return (
    <Screen scroll testID="card-gallery">
      <Text preset="title" style={styles.heading}>
        Cards
      </Text>
      <Text preset="body" color="secondary" style={styles.subhead}>
        {earnedCount} of {CARDS.length} earned. Each card marks a milestone you
        have crossed.
      </Text>

      <View style={styles.grid}>
        {CARDS.map((card) => (
          <View key={card.id} style={styles.gridItem}>
            <PressableRow onPress={() => setActive(card)} style={styles.pressReset}>
              <Card
                padded
                elevation={card.earned ? "raised" : "flat"}
                style={styles.tile}
              >
                <View style={styles.tileTop}>
                  {card.earned ? (
                    <Icon icon={Seal} size={24} color={colors.accent.gold} weight="fill" />
                  ) : (
                    <Icon icon={LockSimple} size={24} color={colors.text.disabled} />
                  )}
                </View>
                <Text
                  preset="bodyMedium"
                  color={card.earned ? "primary" : "disabled"}
                  numberOfLines={1}
                  style={styles.tileTitle}
                >
                  {card.title}
                </Text>
                <Text
                  preset="label"
                  color={card.earned ? "secondary" : "disabled"}
                >
                  {card.earned ? "Earned" : "Locked"}
                </Text>
                {card.earned ? null : <View style={styles.frost} pointerEvents="none" />}
              </Card>
            </PressableRow>
          </View>
        ))}
      </View>

      <Sheet
        visible={active !== null}
        onClose={() => setActive(null)}
        title={active?.title ?? ""}
      >
        {active ? (
          <View style={styles.previewBody}>
            <View style={styles.previewBadge}>
              <Badge
                label={active.earned ? "EARNED" : "LOCKED"}
                tone={active.earned ? "gold" : "neutral"}
              />
            </View>
            <View style={styles.previewArt}>
              <Icon
                icon={active.earned ? Seal : LockSimple}
                size={64}
                color={active.earned ? colors.accent.gold : colors.text.disabled}
                weight={active.earned ? "fill" : "regular"}
              />
            </View>
            <Divider style={styles.previewDivider} />
            <Text preset="body" color="secondary">
              {active.earned ? active.detail : active.requirement}
            </Text>
          </View>
        ) : null}
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: spacing.sm },
  subhead: { marginBottom: spacing.lg },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: { width: "48%", marginBottom: spacing.md },
  pressReset: { paddingVertical: 0 },
  tile: {
    width: "100%",
    minHeight: 128,
    overflow: "hidden",
  },
  tileTop: { marginBottom: spacing.md },
  tileTitle: { marginBottom: spacing.xs },
  frost: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.support.frost,
    borderRadius: radius.card,
  },
  previewBody: { paddingBottom: spacing.xl },
  previewBadge: { marginBottom: spacing.lg },
  previewArt: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.pressed,
  },
  previewDivider: { marginVertical: spacing.lg },
});
