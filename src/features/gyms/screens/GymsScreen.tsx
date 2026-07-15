import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MapPin, Star, SlidersHorizontal } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Chip,
  Button,
  TierBadge,
  Skeleton,
  StatePlaceholder,
  ProgressBar,
  PressableRow,
  OfflineBanner,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberTabScreenProps } from "@/app/navigation/types";
import { useGymsQuery, type GymCardFragment } from "@/graphql/generated/graphql";
import { formatDistance, busyLabel } from "@/lib/format";
import { toUiError } from "@/lib/errors";
import { useUiStore } from "@/store/uiStore";
import { GymMap } from "@/features/gyms/components/GymMap";

/**
 * The Gyms tab — a tier-filtered list of nearby gyms. A real map needs native
 * config, so the default view is a calm LIST with a small non-interactive map
 * placeholder banner on top. The "Peek other tiers" chip lets a member browse
 * gyms above/below their pass tier without leaving the list.
 */
export function GymsScreen({ navigation }: MemberTabScreenProps<"Gyms">) {
  const peekOtherTiers = useUiStore((s) => s.peekOtherTiers);
  const togglePeek = useUiStore((s) => s.togglePeek);
  const isOnline = useUiStore((s) => s.isOnline);

  const [{ data, fetching, error }, refetch] = useGymsQuery({
    variables: { peekOtherTiers },
  });
  const gyms = data?.gyms ?? [];
  const uiError = toUiError(error);

  const [view, setView] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // The one orange marker: the tapped gym, else the nearest (first) one.
  const activeId = selectedId ?? gyms[0]?.id ?? null;

  const header = (
    <View>
      {!isOnline ? <OfflineBanner /> : null}
      <View style={styles.titleRow}>
        <Text preset="title">Gyms near you</Text>
        <Chip
          label="Peek other tiers"
          selected={peekOtherTiers}
          onPress={togglePeek}
        />
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.toggle}>
          <Chip label="List" selected={view === "list"} onPress={() => setView("list")} />
          <Chip label="Map" selected={view === "map"} onPress={() => setView("map")} />
        </View>
        <Button
          label="Filters"
          variant="secondary"
          fullWidth={false}
          icon={
            <SlidersHorizontal size={18} color={colors.text.primary} weight="regular" />
          }
          onPress={() => navigation.navigate("GymFilters")}
        />
      </View>
    </View>
  );

  if (fetching && gyms.length === 0) {
    return (
      <Screen scroll>
        {header}
        <View style={{ marginTop: spacing.lg }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              height={96}
              radius={radius.card}
              style={{ marginBottom: spacing.md }}
            />
          ))}
        </View>
      </Screen>
    );
  }

  if (uiError) {
    return (
      <Screen>
        <StatePlaceholder
          variant={uiError.code === "OFFLINE" ? "offline" : "error"}
          icon={<MapPin size={40} color={colors.text.secondary} weight="regular" />}
          title="We could not load gyms"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      </Screen>
    );
  }

  if (gyms.length === 0) {
    return (
      <Screen scroll>
        {header}
        <StatePlaceholder
          variant="empty"
          icon={<MapPin size={40} color={colors.text.secondary} weight="regular" />}
          title="No gyms in your zone yet"
          body="We are onboarding gyms near you. Join the waitlist and we will let you know the moment your zone opens."
        />
      </Screen>
    );
  }

  if (view === "map") {
    const activeGym = gyms.find((g) => g.id === activeId) ?? null;
    return (
      <Screen scroll>
        {header}
        <View style={styles.mapWrap}>
          <GymMap
            markers={gyms.map((g) => ({ id: g.id, name: g.name, location: g.location }))}
            selectedGymId={activeId}
            onSelectMarker={setSelectedId}
            height={320}
            fallbackBody="Live map opens in the dev-client build. Browse the list for now — distances are from your zone."
          />
        </View>
        {activeGym ? (
          <View style={{ marginTop: spacing.md }}>
            <GymRow
              gym={activeGym}
              onPress={() => navigation.navigate("GymDetail", { gymId: activeGym.id })}
            />
          </View>
        ) : null}
      </Screen>
    );
  }

  return (
    <Screen scroll>
      {header}
      <View style={{ marginTop: spacing.lg }}>
        {gyms.map((gym) => (
          <GymRow
            key={gym.id}
            gym={gym}
            onPress={() => navigation.navigate("GymDetail", { gymId: gym.id })}
          />
        ))}
      </View>
    </Screen>
  );
}

function GymRow({ gym, onPress }: { gym: GymCardFragment; onPress: () => void }) {
  const busy = gym.liveBusyFraction;
  return (
    <Card padded style={styles.rowCard} elevation="raised">
      <PressableRow onPress={onPress} style={styles.rowInner}>
        <View style={styles.rowMain}>
          <View style={styles.nameRow}>
            <Text preset="bodyMedium" numberOfLines={1} style={styles.name}>
              {gym.name}
            </Text>
            <TierBadge tier={gym.tier} />
          </View>

          <View style={styles.metaRow}>
            {gym.distanceMeters != null ? (
              <Text preset="body" color="secondary">
                {formatDistance(gym.distanceMeters)}
              </Text>
            ) : null}
            {gym.rating != null ? (
              <View style={styles.rating}>
                <Star size={13} weight="fill" color={colors.text.secondary} />
                <Text preset="body" color="secondary" style={{ marginLeft: 4 }}>
                  {gym.rating.toFixed(1)}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.busyRow}>
            <View style={styles.busyMeter}>
              <ProgressBar value={busy ?? 0} tone="accent" height={6} />
            </View>
            <Text preset="label" color="secondary" style={styles.busyLabel}>
              {busyLabel(busy)}
            </Text>
          </View>
        </View>
      </PressableRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  toggle: { flexDirection: "row", gap: spacing.sm },
  mapWrap: { marginTop: spacing.lg },
  rowCard: { marginBottom: spacing.md },
  rowInner: { paddingVertical: 0 },
  rowMain: { flex: 1, gap: spacing.sm },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  name: { flex: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rating: { flexDirection: "row", alignItems: "center" },
  busyRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  busyMeter: { flex: 1 },
  busyLabel: { minWidth: 52, textAlign: "right" },
});
