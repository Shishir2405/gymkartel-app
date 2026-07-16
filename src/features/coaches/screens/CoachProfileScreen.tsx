import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  SealCheck,
  Star,
  ChatCircle,
  CaretLeft,
  CheckCircle,
} from "phosphor-react-native";
import {
  Text,
  Card,
  Chip,
  Badge,
  Button,
  Avatar,
  Divider,
  Skeleton,
  StatePlaceholder,
  IconButton,
  colors,
  spacing,
  radius,
} from "../../../ui";
import type { MemberScreenProps } from "../../../app/navigation/types";
import { useCoachQuery } from "../../../graphql/generated/graphql";
import { formatRupees } from "../../../lib/format";
import { toUiError } from "../../../lib/errors";

export function CoachProfileScreen({ navigation, route }: MemberScreenProps<"CoachProfile">) {
  const { coachId } = route.params;
  const [{ data, fetching, error }] = useCoachQuery({ variables: { id: coachId } });
  const coach = data?.coach;
  const uiError = toUiError(error);

  if (fetching && !coach) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <Skeleton height={220} radius={0} />
          <View style={{ padding: spacing.screen }}>
            <Skeleton height={24} width="60%" />
            <Skeleton height={16} width="40%" style={{ marginTop: spacing.md }} />
            <Skeleton height={120} radius={radius.card} style={{ marginTop: spacing.xl }} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (uiError || !coach) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatePlaceholder
          variant="error"
          title="We could not load this coach"
          body={uiError?.message ?? "Please try again."}
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const isLegend = coach.badge === "LEGEND";

  return (
    <View style={styles.root} testID="coach-profile">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {}
        <View style={styles.cover}>
          {coach.transformationPhotoUrls[0] ? (
            <Image source={{ uri: coach.transformationPhotoUrls[0] }} style={styles.coverImg} />
          ) : (
            <View style={[styles.coverImg, styles.coverFallback]} />
          )}
          <SafeAreaView style={styles.coverBar} edges={["top"]}>
            <IconButton
              icon={CaretLeft}
              accessibilityLabel="Back"
              onPress={() => navigation.goBack()}
            />
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          {}
          <View style={styles.identity}>
            <Avatar name={coach.displayName} size={72} />
            <View style={styles.nameBlock}>
              <View style={styles.nameRow}>
                <Text preset="title">{coach.displayName}</Text>
                {coach.verified ? (
                  <SealCheck size={20} weight="fill" color={colors.accent.primary} />
                ) : null}
              </View>
              <View style={styles.badgeRow}>
                {coach.badge ? (
                  <Badge label={coach.badge} tone={isLegend ? "gold" : "accent"} />
                ) : null}
                {coach.ratingAverage != null ? (
                  <View style={styles.rating}>
                    <Star size={14} weight="fill" color={colors.text.secondary} />
                    <Text preset="body" color="secondary" style={{ marginLeft: 4 }}>
                      {coach.ratingAverage.toFixed(1)} · {coach.sessionsCompleted} sessions
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          {}
          <Card padded style={styles.priceCard}>
            <Text preset="label" color="secondary">
              PER SESSION
            </Text>
            <Text preset="displayMedium" style={{ marginTop: 2 }}>
              {formatRupees(coach.pricePerSessionPaise)}
            </Text>
          </Card>

          {}
          <Text preset="body" color="secondary" style={styles.bio}>
            {coach.bio}
          </Text>

          {}
          {coach.specialties.length > 0 ? (
            <>
              <Text preset="label" color="secondary" style={styles.section}>
                SPECIALTIES
              </Text>
              <View style={styles.chips}>
                {coach.specialties.map((s) => (
                  <Chip key={s} label={s} />
                ))}
              </View>
            </>
          ) : null}

          {}
          <Text preset="label" color="secondary" style={styles.section}>
            CERTIFICATIONS
          </Text>
          <Card padded>
            <CertRow title="Certified Personal Trainer" issuer="K11 Academy" verified />
            <Divider style={{ marginVertical: spacing.md }} />
            <CertRow title="Strength & Conditioning" issuer="NSCA" verified={coach.verified} />
          </Card>

          {}
          {coach.transformationPhotoUrls.length > 0 ? (
            <>
              <Text preset="label" color="secondary" style={styles.section}>
                TRANSFORMATIONS
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
                {coach.transformationPhotoUrls.map((uri, i) => (
                  <Image key={i} source={{ uri }} style={styles.galleryImg} />
                ))}
              </ScrollView>
            </>
          ) : null}

          {}
          <Text preset="label" color="secondary" style={styles.section}>
            REVIEWS
          </Text>
          <Card padded>
            <ReviewRow name="Ravi" text="Clear plan, held me to it. Real progress in six weeks." />
            <Divider style={{ marginVertical: spacing.md }} />
            <ReviewRow name="Meera" text="Patient with a returning knee injury. Adjusted every session." />
            <Button
              label="See all reviews"
              variant="ghost"
              onPress={() => navigation.navigate("CoachReviews", { coachId })}
            />
          </Card>
        </View>
      </ScrollView>

      {}
      <SafeAreaView edges={["bottom"]} style={styles.stickyWrap}>
        <View style={styles.sticky}>
          <View style={{ flex: 1 }}>
            <Button
              testID="coach-profile.book"
              label={`Book · ${formatRupees(coach.pricePerSessionPaise)}`}
              onPress={() => navigation.navigate("PickSlot", { coachId })}
            />
          </View>
          <IconButton
            icon={ChatCircle}
            testID="coach-profile.chat"
            accessibilityLabel="Message coach"
            style={styles.chatBtn}
            onPress={() =>
              navigation.navigate("ChatThread", { bookingId: coachId, peerName: coach.displayName })
            }
            color={colors.text.secondary}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function CertRow({ title, issuer, verified }: { title: string; issuer: string; verified: boolean }) {
  return (
    <View style={styles.certRow}>
      <View style={{ flex: 1 }}>
        <Text preset="bodyMedium">{title}</Text>
        <Text preset="body" color="secondary">
          {issuer}
        </Text>
      </View>
      {verified ? (
        <View style={styles.certTick}>
          <CheckCircle size={18} weight="fill" color={colors.accent.primary} />
          <Text preset="label" color="accent" style={{ marginLeft: 4 }}>
            VERIFIED
          </Text>
        </View>
      ) : (
        <Text preset="label" color="disabled">
          PENDING
        </Text>
      )}
    </View>
  );
}

function ReviewRow({ name, text }: { name: string; text: string }) {
  return (
    <View>
      <View style={styles.reviewHead}>
        <Text preset="bodyMedium">{name}</Text>
        <View style={styles.stars}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={12} weight="fill" color={colors.text.secondary} />
          ))}
        </View>
      </View>
      <Text preset="body" color="secondary" style={{ marginTop: 4 }}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.base },
  safe: { flex: 1, backgroundColor: colors.bg.base },
  loading: { flex: 1 },
  scroll: { paddingBottom: 120 },
  cover: { height: 200 },
  coverImg: { width: "100%", height: "100%" },
  coverFallback: { backgroundColor: colors.surface.raised },
  coverBar: { position: "absolute", top: 0, left: spacing.md },
  body: { paddingHorizontal: spacing.screen, marginTop: -28 },
  identity: { flexDirection: "row", alignItems: "flex-end" },
  nameBlock: { marginLeft: spacing.md, flex: 1, paddingBottom: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 6 },
  rating: { flexDirection: "row", alignItems: "center" },
  priceCard: { marginTop: spacing.lg },
  bio: { marginTop: spacing.lg, lineHeight: 22 },
  section: { marginTop: spacing.xl, marginBottom: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  gallery: { gap: spacing.md },
  galleryImg: { width: 140, height: 180, borderRadius: radius.card, backgroundColor: colors.surface.raised },
  certRow: { flexDirection: "row", alignItems: "center" },
  certTick: { flexDirection: "row", alignItems: "center" },
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
  chatBtn: {
    width: 56,
    height: 56,
    borderRadius: radius.button,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
});
