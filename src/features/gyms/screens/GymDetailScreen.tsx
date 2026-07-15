import React from "react";
import { Linking, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { CaretLeft, MapTrifold, Star } from "phosphor-react-native";
import {
  Text,
  Card,
  Button,
  TierBadge,
  Divider,
  Skeleton,
  StatePlaceholder,
  ProgressBar,
  IconButton,
  Icon,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useGymQuery, useViewerQuery } from "@/graphql/generated/graphql";
import { formatDistance, busyLabel } from "@/lib/format";
import { toUiError } from "@/lib/errors";
import { useAmenityIcon, amenityLabel } from "@/features/gyms/components/amenityIcon";
import { GymMap } from "@/features/gyms/components/GymMap";
import { gymCoords } from "@/features/gyms/lib/gymCoords";

/** Open the gym's location in the platform maps app (Apple / Google Maps). */
function openInMaps(name: string, lat: number, lng: number): void {
  const label = encodeURIComponent(name);
  const url =
    Platform.OS === "ios"
      ? `maps:0,0?q=${label}@${lat},${lng}`
      : `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
  void Linking.openURL(url).catch(() => {
    void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
  });
}

const HOURS: ReadonlyArray<{ day: string; hours: string }> = [
  { day: "Mon - Fri", hours: "5:00 AM - 11:00 PM" },
  { day: "Saturday", hours: "6:00 AM - 10:00 PM" },
  { day: "Sunday", hours: "7:00 AM - 9:00 PM" },
];

const REVIEWS: ReadonlyArray<{ name: string; text: string }> = [
  { name: "Arjun", text: "Clean floor, plenty of racks. Rarely a wait even in the evening." },
  { name: "Nisha", text: "Staff were helpful on my first check-in. Showers are spotless." },
  { name: "Kabir", text: "Good free-weights section. Cardio machines are well maintained." },
];

/**
 * Gym detail. A gallery, identity, amenity row, live-busy meter, plain weekly
 * hours, a small map snippet placeholder and three reviews. The sticky bottom
 * bar is adaptive: an ACTIVE pass shows "Check in here" (opens the scanner tab),
 * otherwise the one orange button routes to the pass ladder.
 */
export function GymDetailScreen({ navigation, route }: MemberScreenProps<"GymDetail">) {
  const { gymId } = route.params;
  const [{ data, fetching, error }] = useGymQuery({ variables: { id: gymId } });
  const [{ data: viewerData }] = useViewerQuery();

  const gym = data?.gym;
  const uiError = toUiError(error);
  const hasActivePass = viewerData?.viewer?.activePass?.status === "ACTIVE";

  if (fetching && !gym) {
    return (
      <SafeAreaView style={styles.safe}>
        <Skeleton height={240} radius={0} />
        <View style={{ padding: spacing.screen }}>
          <Skeleton height={24} width="60%" />
          <Skeleton height={16} width="40%" style={{ marginTop: spacing.md }} />
          <Skeleton height={120} radius={radius.card} style={{ marginTop: spacing.xl }} />
        </View>
      </SafeAreaView>
    );
  }

  if (uiError || !gym) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatePlaceholder
          variant={uiError?.code === "OFFLINE" ? "offline" : "error"}
          title="We could not load this gym"
          body={uiError?.message ?? "Please try again."}
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Gallery */}
        <View style={styles.gallery}>
          {gym.photoUrls.length > 0 ? (
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {gym.photoUrls.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.galleryImg} contentFit="cover" />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.galleryImg, styles.galleryFallback]}>
              <MapTrifold size={32} color={colors.text.disabled} weight="regular" />
            </View>
          )}
          <SafeAreaView style={styles.topBar} edges={["top"]}>
            <IconButton
              icon={CaretLeft}
              accessibilityLabel="Back"
              onPress={() => navigation.goBack()}
            />
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          {/* Identity */}
          <View style={styles.nameRow}>
            <Text preset="title" style={{ flex: 1 }}>
              {gym.name}
            </Text>
            <TierBadge tier={gym.tier} />
          </View>
          <View style={styles.metaRow}>
            {gym.rating != null ? (
              <View style={styles.rating}>
                <Star size={14} weight="fill" color={colors.text.secondary} />
                <Text preset="body" color="secondary" style={{ marginLeft: 4 }}>
                  {gym.rating.toFixed(1)}
                </Text>
              </View>
            ) : null}
            {gym.distanceMeters != null ? (
              <Text preset="body" color="secondary">
                {formatDistance(gym.distanceMeters)}
              </Text>
            ) : null}
          </View>
          <Text preset="body" color="secondary" style={styles.address}>
            {gym.address}
          </Text>

          {/* Live-busy meter */}
          <Card padded style={styles.section}>
            <View style={styles.busyHead}>
              <Text preset="label" color="secondary">
                RIGHT NOW
              </Text>
              <Text preset="label" color="secondary">
                {busyLabel(gym.liveBusyFraction)}
              </Text>
            </View>
            <View style={{ marginTop: spacing.sm }}>
              <ProgressBar value={gym.liveBusyFraction ?? 0} tone="accent" height={8} />
            </View>
          </Card>

          {/* Amenities */}
          {gym.amenities.length > 0 ? (
            <>
              <Text preset="label" color="secondary" style={styles.sectionLabel}>
                AMENITIES
              </Text>
              <View style={styles.amenities}>
                {gym.amenities.map((a) => (
                  <View key={a} style={styles.amenity}>
                    <Icon icon={useAmenityIcon(a)} size={22} color={colors.text.primary} />
                    <Text preset="body" color="secondary" style={styles.amenityLabel}>
                      {amenityLabel(a)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {/* Hours */}
          <Text preset="label" color="secondary" style={styles.sectionLabel}>
            HOURS
          </Text>
          <Card padded>
            {HOURS.map((h, i) => (
              <View key={h.day}>
                {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
                <View style={styles.hoursRow}>
                  <Text preset="body">{h.day}</Text>
                  <Text preset="body" color="secondary">
                    {h.hours}
                  </Text>
                </View>
              </View>
            ))}
          </Card>

          {/* Map snippet — tapping opens the platform maps app. */}
          <Text preset="label" color="secondary" style={styles.sectionLabel}>
            LOCATION
          </Text>
          <GymMap
            markers={[{ id: gym.id, name: gym.name }]}
            selectedGymId={gym.id}
            center={gymCoords(gym.id)}
            interactive={false}
            height={160}
            onPressMap={() => {
              const c = gymCoords(gym.id);
              openInMaps(gym.name, c.latitude, c.longitude);
            }}
            fallbackBody="Tap to open this gym in your maps app. Distances are from your zone."
          />
          <Text preset="body" color="secondary" style={styles.mapHint}>
            {gym.address}
          </Text>

          {/* Reviews */}
          <Text preset="label" color="secondary" style={styles.sectionLabel}>
            REVIEWS
          </Text>
          <Card padded>
            {REVIEWS.map((r, i) => (
              <View key={r.name}>
                {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
                <View style={styles.reviewHead}>
                  <Text preset="bodyMedium">{r.name}</Text>
                  <View style={styles.stars}>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} size={12} weight="fill" color={colors.text.secondary} />
                    ))}
                  </View>
                </View>
                <Text preset="body" color="secondary" style={{ marginTop: 4 }}>
                  {r.text}
                </Text>
              </View>
            ))}
            <Button label="See all reviews" variant="ghost" onPress={() => undefined} />
          </Card>
        </View>
      </ScrollView>

      {/* Sticky adaptive bottom bar */}
      <SafeAreaView edges={["bottom"]} style={styles.stickyWrap}>
        <View style={styles.sticky}>
          {hasActivePass ? (
            <View style={{ flex: 1 }}>
              <Button
                label="Check in here"
                onPress={() => navigation.navigate("Tabs")}
              />
              <Text preset="label" color="secondary" align="center" style={styles.stickyNote}>
                Opens the scanner
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Button label="Get Pass" onPress={() => navigation.navigate("PassLadder")} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.base },
  safe: { flex: 1, backgroundColor: colors.bg.base },
  scroll: { paddingBottom: 140 },
  gallery: { height: 240 },
  galleryImg: { width: 360, maxWidth: "100%", height: 240, backgroundColor: colors.surface.raised },
  galleryFallback: { alignItems: "center", justifyContent: "center", width: "100%" },
  topBar: { position: "absolute", top: 0, left: spacing.md },
  body: { paddingHorizontal: spacing.screen, marginTop: spacing.lg },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.sm },
  rating: { flexDirection: "row", alignItems: "center" },
  address: { marginTop: spacing.sm, lineHeight: 20 },
  section: { marginTop: spacing.xl },
  sectionLabel: { marginTop: spacing.xl, marginBottom: spacing.md },
  busyHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  amenities: { flexDirection: "row", flexWrap: "wrap", gap: spacing.lg },
  amenity: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minWidth: "42%" },
  amenityLabel: {},
  hoursRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  mapHint: { marginTop: spacing.sm },
  reviewHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stars: { flexDirection: "row", gap: 2 },
  stickyWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg.base,
    borderTopWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  sticky: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  stickyNote: { marginTop: spacing.sm },
});
