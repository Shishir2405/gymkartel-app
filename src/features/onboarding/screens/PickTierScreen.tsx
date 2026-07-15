import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Check } from "phosphor-react-native";
import { Text, Button, Screen, TierBadge, colors, spacing, radius } from "@/ui";
import type { AuthScreenProps } from "@/app/navigation/types";
import { useOnboardingStore } from "@/store/onboardingStore";
import { TIER_DAY_RATE, type Tier } from "@gymkartel/contracts";
import { formatPerDay } from "@/lib/format";
import { haptics } from "@/lib/haptics";

const TIERS: { tier: Tier; label: string }[] = [
  { tier: "BASIC", label: "Basic" },
  { tier: "STANDARD", label: "Standard" },
  { tier: "PREMIUM", label: "Premium" },
];

/**
 * Three tiers, one column. Every price comes from the contract's TIER_DAY_RATE
 * so the app never invents money. Standard is pre-highlighted from the store.
 * The selected card carries the orange inset stroke — the same selection
 * signature as a chip — while the button stays the single orange action.
 */
export function PickTierScreen({ navigation }: AuthScreenProps<"PickTier">) {
  const selected = useOnboardingStore((s) => s.tier);
  const set = useOnboardingStore((s) => s.set);

  const onSelect = (tier: Tier) => {
    set({ tier });
    void haptics.light();
  };

  return (
    <Screen
      scroll
      footer={
        <Button
          label="Continue"
          onPress={() => navigation.navigate("CityZone")}
          disabled={selected === null}
        />
      }
    >
      <View style={styles.header}>
        <Text preset="title">Choose your tier</Text>
        <Text preset="body" color="secondary" style={styles.sub}>
          Your tier sets the gyms you walk into for free. You can move up any time.
        </Text>
      </View>

      <View style={styles.list}>
        {TIERS.map(({ tier, label }) => {
          const isSelected = selected === tier;
          return (
            <Pressable
              key={tier}
              onPress={() => onSelect(tier)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[styles.card, isSelected ? styles.cardSelected : null]}
            >
              <View style={styles.cardTop}>
                <TierBadge tier={tier} />
                {isSelected ? (
                  <View style={styles.check}>
                    <Check size={16} weight="bold" color={colors.accent.primary} />
                  </View>
                ) : null}
              </View>

              <View style={styles.priceRow}>
                <Text preset="displayMedium">{formatPerDay(TIER_DAY_RATE[tier])}</Text>
              </View>

              <Text preset="body" color="secondary" style={styles.cardLine}>
                {`Works at every ${label} gym, in any city.`}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.xl },
  sub: { marginTop: spacing.sm },
  list: { gap: spacing.md },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
    padding: spacing.lg,
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: colors.accent.primary,
    backgroundColor: colors.surface.pressed,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.raised,
    borderWidth: 1.5,
    borderColor: colors.accent.primary,
  },
  priceRow: { marginTop: spacing.lg },
  cardLine: { marginTop: spacing.sm },
});
