import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Barbell, NotePencil, MapPin } from "phosphor-react-native";
import {
  Text,
  Card,
  Avatar,
  IconButton,
  SectionHeader,
  Skeleton,
  StatePlaceholder,
  PressableRow,
  Badge,
  colors,
  spacing,
} from "../../../ui";
import type { MemberTabScreenProps } from "../../../app/navigation/types";
import { greeting, formatDistance, busyLabel } from "../../../lib/format";
import { useHome } from "../hooks/useHome";
import { PassHeroCard, NoPassHeroCard } from "../components/PassHero";

export function HomeScreen({ navigation }: MemberTabScreenProps<"Home">) {
  const { viewer, gyms, nextBooking, fetching, error } = useHome();

  const firstName = viewer?.name?.split(" ")[0] ?? "there";
  const hasPass = viewer?.activePass?.status === "ACTIVE";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]} testID="home">
      <View style={styles.header}>
        <PressableRow onPress={() => navigation.navigate("Profile")}>
          <Avatar uri={viewer?.avatarUrl} name={viewer?.name} size={40} />
        </PressableRow>
        <IconButton
          icon={Bell}
          accessibilityLabel="Notifications"
          onPress={() => navigation.navigate("Notifications")}
          color={colors.text.secondary}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text preset="title" style={styles.greeting}>
          {greeting()}, {firstName}.
        </Text>

        {fetching && !viewer ? (
          <Skeleton height={168} radius={16} style={{ marginTop: spacing.md }} />
        ) : error && !viewer ? (
          <View style={styles.errorBlock}>
            <StatePlaceholder
              variant="error"
              title="We could not load your home"
              body="Check your connection and pull to try again."
            />
          </View>
        ) : hasPass && viewer?.activePass ? (
          <View style={styles.hero}>
            <PassHeroCard
              data={{
                tier: viewer.activePass.tier,
                daysLeft: viewer.activePass.daysLeft,
                validUntil: viewer.activePass.validUntil,
                streak: viewer.streak.current,
              }}
            />
          </View>
        ) : (
          <View style={styles.hero}>
            <NoPassHeroCard onGetPass={() => navigation.navigate("PassLadder")} />
          </View>
        )}

        {}
        {nextBooking ? (
          <PressableRow
            onPress={() =>
              navigation.navigate("BookingConfirmed", { bookingId: nextBooking.id })
            }
          >
            <Card padded style={styles.stripCard}>
              <Text preset="label" color="secondary">
                NEXT SESSION
              </Text>
              <Text preset="bodyMedium" style={{ marginTop: 4 }}>
                {nextBooking.coach.displayName} · {nextBooking.gym.name}
              </Text>
            </Card>
          </PressableRow>
        ) : null}

        {}
        <View style={styles.twin}>
          <TwinCard
            icon={<Barbell size={24} color={colors.text.primary} />}
            label="Book a Coach"
            onPress={() => navigation.navigate("CoachBrowse")}
          />
          <TwinCard
            icon={<NotePencil size={24} color={colors.text.primary} />}
            label="Log workout"
            onPress={() => navigation.navigate("LogWorkout")}
          />
        </View>

        {}
        <SectionHeader
          title="Nearby gyms"
          actionLabel="See all"
          onAction={() => navigation.navigate("Gyms")}
        />
        {fetching && gyms.length === 0 ? (
          <View style={styles.carousel}>
            <Skeleton width={220} height={120} radius={16} />
            <Skeleton width={220} height={120} radius={16} />
          </View>
        ) : gyms.length === 0 ? (
          <Card padded>
            <Text preset="body" color="secondary">
              No gyms in your zone yet. Join the waitlist and we will tell you
              when one opens.
            </Text>
          </Card>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          >
            {gyms.slice(0, 6).map((gym) => (
              <PressableRow
                key={gym.id}
                onPress={() => navigation.navigate("GymDetail", { gymId: gym.id })}
              >
                <Card padded style={styles.gymCard}>
                  <View style={styles.gymTop}>
                    <MapPin size={18} color={colors.text.secondary} />
                    <Badge label={gym.tier} tone="neutral" />
                  </View>
                  <Text preset="bodyMedium" numberOfLines={1} style={{ marginTop: spacing.sm }}>
                    {gym.name}
                  </Text>
                  <Text preset="body" color="secondary">
                    {formatDistance(gym.distanceMeters)} · {busyLabel(gym.liveBusyFraction)}
                  </Text>
                </Card>
              </PressableRow>
            ))}
          </ScrollView>
        )}

        {}
        <PressableRow onPress={() => navigation.navigate("TheCount")}>
          <Card padded style={styles.count}>
            <Text preset="label" color="secondary">
              THE COUNT
            </Text>
            <View style={styles.countRow}>
              <Text preset="displayMedium">
                {viewer?.streak.current ?? 0}
              </Text>
              <Text preset="body" color="secondary" style={{ marginLeft: spacing.md, flex: 1 }}>
                days in a row. First entry writes the record.
              </Text>
            </View>
          </Card>
        </PressableRow>
      </ScrollView>
    </SafeAreaView>
  );
}

function TwinCard({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <PressableRow onPress={onPress} style={styles.twinItem}>
      <Card padded style={styles.twinCard}>
        {icon}
        <Text preset="bodyMedium" style={{ marginTop: spacing.md }}>
          {label}
        </Text>
      </Card>
    </PressableRow>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.base },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
  },
  content: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
  greeting: { marginBottom: spacing.sm },
  hero: { marginTop: spacing.sm },
  errorBlock: { height: 220 },
  stripCard: { marginTop: spacing.md, width: "100%" },
  twin: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  twinItem: { flex: 1 },
  twinCard: { alignItems: "flex-start", minHeight: 96, justifyContent: "center" },
  carousel: { gap: spacing.md, paddingRight: spacing.screen },
  gymCard: { width: 200 },
  gymTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  count: { marginTop: spacing.lg, width: "100%" },
  countRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.xs },
});
