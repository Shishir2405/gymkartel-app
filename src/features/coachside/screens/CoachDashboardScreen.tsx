import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarBlank, UsersThree, Wallet, Star, GearSix, CaretRight } from "phosphor-react-native";
import {
  Text,
  Card,
  Divider,
  Button,
  Skeleton,
  Sheet,
  IconButton,
  StatePlaceholder,
  PressableRow,
  useToast,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { CoachTabScreenProps } from "@/app/navigation/types";
import { useViewerQuery, useCoachDashboardQuery } from "@/graphql/generated/graphql";
import { useAuth } from "@/app/providers/AuthProvider";
import { formatRupees, formatTime, greeting } from "@/lib/format";
import { toUiError } from "@/lib/errors";
import { MOCK_REVIEWS, type CoachReview } from "@/features/coachside/lib/mock";

export function CoachDashboardScreen({ navigation }: CoachTabScreenProps<"CoachDashboard">) {
  const [{ data: viewerData }] = useViewerQuery();
  const [{ data, fetching, error }, refetch] = useCoachDashboardQuery();
  const viewer = viewerData?.viewer;
  const dashboard = data?.coachDashboard ?? null;
  const { setRole, signOut } = useAuth();
  const { show } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const uiError = toUiError(error);

  const firstName = viewer?.name?.split(" ")[0] ?? "Coach";
  const todaysSessions = dashboard?.todaysSessions ?? [];
  const pending = dashboard?.pendingRequests ?? [];

  if (fetching && !dashboard) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.content}>
          <Skeleton height={28} width="55%" />
          <Skeleton height={140} radius={radius.card} style={{ marginTop: spacing.xl }} />
          <Skeleton height={72} radius={radius.card} style={{ marginTop: spacing.md }} />
          <Skeleton height={72} radius={radius.card} style={{ marginTop: spacing.md }} />
        </View>
      </SafeAreaView>
    );
  }

  if (uiError && !dashboard) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <StatePlaceholder
          variant={uiError.code === "OFFLINE" ? "offline" : "error"}
          title="We could not load your dashboard"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text preset="label" color="secondary">
            {greeting().toUpperCase()}
          </Text>
          <Text preset="title">{firstName}</Text>
        </View>
        <IconButton
          icon={GearSix}
          accessibilityLabel="Coach settings"
          onPress={() => setMenuOpen(true)}
          color={colors.text.secondary}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {}
        <Card padded style={styles.hero}>
          <Text preset="label" color="secondary">
            YOUR TAKE-HOME PREVIEW
          </Text>
          <Text preset="displayLarge" style={{ marginTop: spacing.xs }}>
            {formatRupees(dashboard?.earningsPaise ?? 0)}
          </Text>
          <Text preset="body" color="secondary" style={{ marginTop: spacing.xs }}>
            After the 20 percent platform fee. Payouts land T+2.
          </Text>
        </Card>

        {}
        <View style={styles.statRow}>
          <StatTile value={String(todaysSessions.length)} label="TODAY" />
          <StatTile value={String(pending.length)} label="REQUESTS" />
          <StatTile
            value={dashboard?.ratingAverage != null ? dashboard.ratingAverage.toFixed(1) : "—"}
            label="RATING"
            icon={<Star size={14} weight="fill" color={colors.text.secondary} />}
          />
        </View>

        {}
        <Text preset="label" color="secondary" style={styles.section}>
          TODAY
        </Text>
        {todaysSessions.length === 0 ? (
          <Card padded>
            <Text preset="body" color="secondary">
              No sessions today. Open a slot from your calendar and clients can book it.
            </Text>
          </Card>
        ) : (
          <Card padded>
            {todaysSessions.map((s, i) => (
              <View key={s.id}>
                {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
                <View style={styles.sessionRow}>
                  <View style={{ flex: 1 }}>
                    <Text preset="bodyMedium">{s.gym.name}</Text>
                    <Text preset="body" color="secondary">
                      {formatRupees(s.pricePaise)}
                    </Text>
                  </View>
                  <Text preset="bodyMedium" color="secondary">
                    {formatTime(s.scheduledFor)}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {}
        <Text preset="label" color="secondary" style={styles.section}>
          MANAGE
        </Text>
        <Card padded={false}>
          <QuickRow
            icon={<CalendarBlank size={20} color={colors.text.secondary} />}
            label="Calendar"
            onPress={() => navigation.navigate("CoachCalendar")}
          />
          <Divider />
          <QuickRow
            icon={<UsersThree size={20} color={colors.text.secondary} />}
            label="Clients"
            onPress={() => navigation.navigate("CoachClients")}
          />
          <Divider />
          <QuickRow
            icon={<Wallet size={20} color={colors.text.secondary} />}
            label="Earnings"
            onPress={() => navigation.navigate("CoachEarnings")}
          />
          <Divider />
          <QuickRow
            icon={<Star size={20} color={colors.text.secondary} />}
            label="Edit profile and price"
            onPress={() => navigation.navigate("CoachProfileEditor")}
          />
        </Card>

        {}
        <Text preset="label" color="secondary" style={styles.section}>
          RECENT REVIEWS
        </Text>
        <Card padded>
          {MOCK_REVIEWS.map((r, i) => (
            <View key={r.id}>
              {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
              <ReviewRow review={r} onPosted={() => show("Reply posted")} />
            </View>
          ))}
        </Card>
      </ScrollView>

      {}
      <Sheet visible={menuOpen} onClose={() => setMenuOpen(false)} title="Settings">
        <Button
          label="Sign out"
          variant="destructive"
          onPress={() => {
            setMenuOpen(false);
            void signOut();
          }}
        />
        <Divider style={{ marginVertical: spacing.sm }} />
        <PressableRow
          onPress={() => {
            setMenuOpen(false);
            setRole("MEMBER");
          }}
        >
          <View style={{ flex: 1 }}>
            <Text preset="bodyMedium">Switch to member mode</Text>
            <Text preset="body" color="secondary">
              Same account, member view.
            </Text>
          </View>
          <CaretRight size={18} color={colors.text.secondary} />
        </PressableRow>
      </Sheet>
    </SafeAreaView>
  );
}

function StatTile({ value, label, icon }: { value: string; label: string; icon?: React.ReactNode }) {
  return (
    <Card padded style={styles.statTile}>
      <View style={styles.statValueRow}>
        {icon ? <View style={{ marginRight: 4 }}>{icon}</View> : null}
        <Text preset="displayMedium">{value}</Text>
      </View>
      <Text preset="label" color="secondary" style={{ marginTop: 2 }}>
        {label}
      </Text>
    </Card>
  );
}

function QuickRow({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <PressableRow onPress={onPress} style={styles.quickRow}>
      {icon}
      <Text preset="bodyMedium" style={{ flex: 1, marginLeft: spacing.md }}>
        {label}
      </Text>
      <CaretRight size={18} color={colors.text.secondary} />
    </PressableRow>
  );
}

function ReviewRow({ review, onPosted }: { review: CoachReview; onPosted: () => void }) {
  const [reply, setReply] = useState<string | null>(review.reply);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  return (
    <View>
      <View style={styles.reviewHead}>
        <Text preset="bodyMedium">{review.author}</Text>
        <View style={styles.stars}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              size={12}
              weight="fill"
              color={i < review.rating ? colors.text.secondary : colors.text.disabled}
            />
          ))}
        </View>
      </View>
      <Text preset="body" color="secondary" style={{ marginTop: 4 }}>
        {review.text}
      </Text>

      {reply ? (
        <View style={styles.replyBox}>
          <Text preset="label" color="secondary">
            YOUR PUBLIC REPLY
          </Text>
          <Text preset="body" style={{ marginTop: 4 }}>
            {reply}
          </Text>
        </View>
      ) : editing ? (
        <View style={{ marginTop: spacing.sm }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a public reply"
            placeholderTextColor={colors.text.disabled}
            style={styles.input}
            multiline
          />
          <View style={styles.replyActions}>
            <Button label="Cancel" variant="ghost" fullWidth={false} onPress={() => setEditing(false)} />
            <Button
              label="Post reply"
              variant="secondary"
              fullWidth={false}
              disabled={draft.trim().length === 0}
              onPress={() => {
                setReply(draft.trim());
                setEditing(false);
                onPosted();
              }}
            />
          </View>
        </View>
      ) : (
        <PressableRow onPress={() => setEditing(true)}>
          <Text preset="label" color="accent">
            REPLY PUBLICLY
          </Text>
        </PressableRow>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.base },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  content: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
  hero: { marginTop: spacing.sm },
  statRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  statTile: { flex: 1, alignItems: "flex-start" },
  statValueRow: { flexDirection: "row", alignItems: "center" },
  section: { marginTop: spacing.xl, marginBottom: spacing.md },
  sessionRow: { flexDirection: "row", alignItems: "center" },
  quickRow: { paddingHorizontal: spacing.lg },
  reviewHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stars: { flexDirection: "row", gap: 2 },
  replyBox: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface.pressed,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  input: {
    minHeight: 72,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.pressed,
    color: colors.text.primary,
    padding: spacing.md,
    textAlignVertical: "top",
    fontSize: 15,
  },
  replyActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm, marginTop: spacing.sm },
});
