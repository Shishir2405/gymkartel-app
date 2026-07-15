import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Check, MapPin } from "phosphor-react-native";
import {
  Text,
  Button,
  Screen,
  Divider,
  PressableRow,
  StatePlaceholder,
  useToast,
  colors,
  spacing,
} from "@/ui";
import type { AuthScreenProps } from "@/app/navigation/types";
import { useOnboardingStore } from "@/store/onboardingStore";
import { haptics } from "@/lib/haptics";
import { Field } from "../components/Field";

interface ZoneOption {
  zone: string;
  city: string;
  state: string;
}

/** UI options only — geography for the leaderboard, not pricing. */
const ZONES: ZoneOption[] = [
  { zone: "Indiranagar", city: "Bengaluru", state: "Karnataka" },
  { zone: "Koramangala", city: "Bengaluru", state: "Karnataka" },
  { zone: "Bandra", city: "Mumbai", state: "Maharashtra" },
  { zone: "Andheri", city: "Mumbai", state: "Maharashtra" },
  { zone: "Saket", city: "Delhi", state: "Delhi" },
  { zone: "Hauz Khas", city: "Delhi", state: "Delhi" },
];

/**
 * City and zone. This is the finest grain of the leaderboard geography, so the
 * choice matters — but it is not money. A search field narrows the list; the
 * selected zone writes zone and state to the onboarding form. The last button
 * simply confirms: the auth gate already routes a signed-in member onward.
 */
export function CityZoneScreen({ navigation }: AuthScreenProps<"CityZone">) {
  const zone = useOnboardingStore((s) => s.zone);
  const set = useOnboardingStore((s) => s.set);
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [done, setDone] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ZONES;
    return ZONES.filter(
      (o) =>
        o.zone.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.state.toLowerCase().includes(q),
    );
  }, [query]);

  const onSelect = (option: ZoneOption) => {
    set({ zone: option.zone, state: option.state });
    void haptics.light();
  };

  const onConfirm = () => {
    if (!zone) return;
    void haptics.success();
    setDone(true);
    toast.show("You are in");
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen
        testID="city-zone"
        footer={
          <Button
            testID="city-zone.enter"
            label={done ? "You are in" : "Enter the Club"}
            onPress={onConfirm}
            disabled={zone === null || done}
          />
        }
      >
        <View style={styles.header}>
          <Text preset="title">Where do you train</Text>
          <Text preset="body" color="secondary" style={styles.sub}>
            Pick your home zone. It sets your local leaderboard.
          </Text>
        </View>

        <Field
          testID="city-zone.search"
          label="Search"
          value={query}
          onChangeText={setQuery}
          placeholder="City or area"
          autoCapitalize="words"
        />

        <View style={styles.list}>
          {results.length === 0 ? (
            <StatePlaceholder
              variant="empty"
              title="No matches"
              body="Try another city or area name."
            />
          ) : (
            results.map((option, i) => {
              const isSelected = zone === option.zone;
              return (
                <View key={`${option.city}-${option.zone}`}>
                  {i > 0 ? <Divider /> : null}
                  <PressableRow
                    testID={`city-zone.zone.${option.zone}`}
                    onPress={() => onSelect(option)}
                    style={styles.row}
                  >
                    <MapPin
                      size={20}
                      weight={isSelected ? "fill" : "regular"}
                      color={isSelected ? colors.accent.primary : colors.text.secondary}
                    />
                    <View style={styles.rowText}>
                      <Text preset="bodyMedium">{option.zone}</Text>
                      <Text preset="body" color="secondary">
                        {`${option.city}, ${option.state}`}
                      </Text>
                    </View>
                    {isSelected ? (
                      <Check size={18} weight="bold" color={colors.accent.primary} />
                    ) : null}
                  </PressableRow>
                </View>
              );
            })
          )}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg.base },
  header: { marginBottom: spacing.xl },
  sub: { marginTop: spacing.sm },
  list: { marginTop: spacing.xl },
  row: { alignItems: "center", gap: spacing.md },
  rowText: { flex: 1 },
});
