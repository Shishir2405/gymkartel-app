import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import {
  ChartLineUp,
  ClockCounterClockwise,
  Image as ImageIcon,
  Lock,
  NotePencil,
  CaretRight,
} from "phosphor-react-native";
import {
  Text,
  Card,
  Button,
  Divider,
  SectionHeader,
  PressableRow,
  Skeleton,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberTabScreenProps } from "@/app/navigation/types";
import { useViewerQuery, useLedgerTodayQuery, type LedgerEntryRowFragment } from "@/graphql/generated/graphql";
import { ProgressLineChart } from "@/features/ledger/components/ProgressLineChart";
import { MOCK_BENCH_1RM } from "@/features/ledger/data/mockLedger";

export function TodayScreen({ navigation }: MemberTabScreenProps<"Track">) {
  const [viewer] = useViewerQuery();
  const [today] = useLedgerTodayQuery();
  const todays = today.data?.ledgerToday ?? [];

  const hasPass = viewer.data?.viewer?.activePass?.status === "ACTIVE";
  const loading = viewer.fetching && !viewer.data;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.pad}>
          <Skeleton height={28} width={160} style={{ marginTop: spacing.lg }} />
          <Skeleton height={168} radius={radius.card} style={{ marginTop: spacing.lg }} />
          <Skeleton height={120} radius={radius.card} style={{ marginTop: spacing.md }} />
        </View>
      </SafeAreaView>
    );
  }

  if (!hasPass) {
    return <LockedLedger onGetPass={() => navigation.navigate("PassLadder")} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text preset="title" style={styles.heading}>
          Today
        </Text>

        <SectionHeader title="Logged today" />
        {today.fetching && todays.length === 0 ? (
          <Card padded>
            <Skeleton height={16} width="60%" />
            <Skeleton height={16} width="40%" style={{ marginTop: spacing.md }} />
          </Card>
        ) : todays.length === 0 ? (
          <Card padded>
            <Text preset="body" color="secondary">
              Nothing logged yet. First entry writes the record.
            </Text>
          </Card>
        ) : (
          <Card padded>
            {todays.map((entry, i) => (
              <View key={entry.id}>
                {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
                <LedgerRow entry={entry} />
              </View>
            ))}
          </Card>
        )}

        <SectionHeader title="The record" />
        <Card padded={false}>
          <LinkRow
            icon={<ClockCounterClockwise size={22} color={colors.text.secondary} />}
            label="Exercise history"
            onPress={() => navigation.navigate("ExerciseHistory")}
          />
          <Divider />
          <LinkRow
            icon={<ChartLineUp size={22} color={colors.text.secondary} />}
            label="Progress"
            onPress={() => navigation.navigate("ProgressCharts")}
          />
          <Divider />
          <LinkRow
            icon={<ImageIcon size={22} color={colors.text.secondary} />}
            label="Photos"
            onPress={() => navigation.navigate("ProgressPhotos")}
          />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Log workout"
          icon={<NotePencil size={20} color={colors.text.primary} weight="regular" />}
          onPress={() => navigation.navigate("LogWorkout")}
        />
      </View>
    </SafeAreaView>
  );
}

export function LedgerRow({ entry }: { entry: LedgerEntryRowFragment }) {
  const { chip } = entry;
  return (
    <View style={styles.logRow}>
      <View style={styles.logMeta}>
        <View style={styles.nameLine}>
          <Text preset="bodyMedium" numberOfLines={1} style={styles.name}>
            {chip.exercise ? titleCase(chip.exercise) : chip.raw}
          </Text>
          {chip.uncertain ? (
            <Text preset="label" style={styles.uncertainMark}>
              ?
            </Text>
          ) : null}
          {entry.isPR ? (
            <Text preset="label" color="accent" style={styles.prMark}>
              PR
            </Text>
          ) : null}
        </View>
        <Text preset="body" color="secondary">
          {setSummary(chip.sets, chip.reps)}
        </Text>
      </View>
      {chip.weightKg != null ? (
        <View style={styles.weightWrap}>
          <Text preset="displayMedium">{chip.weightKg}</Text>
          <Text preset="label" color="secondary">
            kg
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function LinkRow({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <PressableRow onPress={onPress} style={styles.linkRow}>
      {icon}
      <Text preset="bodyMedium" style={styles.linkLabel}>
        {label}
      </Text>
      <CaretRight size={18} color={colors.text.disabled} />
    </PressableRow>
  );
}

function LockedLedger({ onGetPass }: { onGetPass: () => void }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.lockRoot}>
        {}
        <View style={styles.pad} pointerEvents="none">
          <Text preset="title" style={styles.heading}>
            Today
          </Text>
          <Card padded style={{ marginTop: spacing.md }}>
            <Text preset="label" color="secondary">
              BENCH 1RM
            </Text>
            <View style={{ marginTop: spacing.md }}>
              <ProgressLineChart points={MOCK_BENCH_1RM.points} unit="kg" height={120} />
            </View>
          </Card>
          <View style={styles.fakeTwin}>
            <Card padded style={styles.fakeTwinCard}>
              <Text preset="label" color="secondary">
                STREAK
              </Text>
              <Text preset="displayMedium" style={{ marginTop: spacing.sm }}>
                18
              </Text>
            </Card>
            <Card padded style={styles.fakeTwinCard}>
              <Text preset="label" color="secondary">
                VOLUME
              </Text>
              <Text preset="displayMedium" style={{ marginTop: spacing.sm }}>
                7.2t
              </Text>
            </Card>
          </View>
        </View>

        {}
        <BlurView intensity={38} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.frostTint]} pointerEvents="none" />

        {}
        <View style={styles.lockContent}>
          <Lock size={40} color={colors.text.secondary} weight="regular" />
          <Text preset="title" align="center" style={styles.lockTitle}>
            The Ledger opens with a Pass
          </Text>
          <Text preset="body" color="secondary" align="center" style={styles.lockBody}>
            Log every set, watch the numbers climb, keep the record.
          </Text>
          <View style={styles.lockAction}>
            <Button label="Get your Pass" onPress={onGetPass} fullWidth={false} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function setSummary(sets: number | null, reps: number | null): string {
  if (sets != null && reps != null) return `${sets} sets · ${reps} reps`;
  if (sets != null) return `${sets} sets`;
  if (reps != null) return `${reps} reps`;
  return "Logged";
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w) => (w.length > 0 ? (w[0] ?? "").toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.base },
  pad: { paddingHorizontal: spacing.screen },
  content: { paddingHorizontal: spacing.screen, paddingTop: spacing.lg, paddingBottom: spacing.xxxl },
  heading: { marginBottom: spacing.sm },
  logRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logMeta: { flex: 1, paddingRight: spacing.md },
  nameLine: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { flexShrink: 1 },
  uncertainMark: { color: colors.support.warning },
  prMark: {},
  weightWrap: { alignItems: "flex-end" },
  linkRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  linkLabel: { flex: 1, marginLeft: spacing.md },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.bg.base,
  },
  lockRoot: { flex: 1 },
  fakeTwin: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  fakeTwinCard: { flex: 1 },
  frostTint: { backgroundColor: colors.support.frost },
  lockContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  lockTitle: { marginTop: spacing.lg, maxWidth: 280 },
  lockBody: { marginTop: spacing.sm, maxWidth: 300 },
  lockAction: { marginTop: spacing.xl, minWidth: 220 },
});
