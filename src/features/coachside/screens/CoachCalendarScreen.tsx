import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Check } from "phosphor-react-native";
import {
  Text,
  Card,
  Sheet,
  Button,
  PressableRow,
  useToast,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { CoachTabScreenProps } from "@/app/navigation/types";
import { formatTime } from "@/lib/format";
import { MOCK_SESSIONS, type CoachSession } from "@/features/coachside/lib/mock";

const HOURS = [6, 7, 8, 12, 17, 18, 19];

/**
 * Coach calendar. A row of date pills across the top, the selected day's
 * sessions below. Booked sessions carry the client, gym and time and open the
 * client detail. A manage-availability sheet toggles which hour slots are open.
 */
export function CoachCalendarScreen({ navigation }: CoachTabScreenProps<"CoachCalendar">) {
  const { show } = useToast();
  const [selected, setSelected] = useState(0);
  const [manageOpen, setManageOpen] = useState(false);
  const [openHours, setOpenHours] = useState<number[]>([6, 7, 18]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const selectedDate = days[selected] ?? new Date();
  const sessions = MOCK_SESSIONS.filter(
    (s) => new Date(s.startIso).toDateString() === selectedDate.toDateString(),
  ).sort((a, b) => a.startIso.localeCompare(b.startIso));

  const toggleHour = (h: number) => {
    setOpenHours((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text preset="title">Calendar</Text>
        <PressableRow onPress={() => setManageOpen(true)}>
          <Text preset="label" color="accent">
            MANAGE AVAILABILITY
          </Text>
        </PressableRow>
      </View>

      {/* Date pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pills}
      >
        {days.map((d, i) => {
          const isSel = i === selected;
          return (
            <PressableRow key={i} onPress={() => setSelected(i)}>
              <View style={[styles.pill, isSel && styles.pillSel]}>
                <Text preset="label" color={isSel ? "accent" : "secondary"}>
                  {d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase()}
                </Text>
                <Text preset="bodyMedium" color={isSel ? "primary" : "secondary"} style={{ marginTop: 2 }}>
                  {d.getDate()}
                </Text>
              </View>
            </PressableRow>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sessions.length === 0 ? (
          <Card padded style={{ marginTop: spacing.md }}>
            <Text preset="body" color="secondary">
              No sessions on this day. Open availability so clients can book.
            </Text>
          </Card>
        ) : (
          sessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              onPress={() => {
                if (s.clientId) navigation.navigate("CoachClientDetail", { clientId: s.clientId });
              }}
            />
          ))
        )}
      </ScrollView>

      {/* Manage availability */}
      <Sheet visible={manageOpen} onClose={() => setManageOpen(false)} title="Open hours">
        <Text preset="body" color="secondary" style={{ marginBottom: spacing.md }}>
          Tap the hours you want to hold open. Clients can only book slots you have opened.
        </Text>
        <View style={styles.grid}>
          {HOURS.map((h) => {
            const on = openHours.includes(h);
            return (
              <PressableRow key={h} onPress={() => toggleHour(h)}>
                <View style={[styles.slot, on && styles.slotOn]}>
                  {on ? <Check size={14} weight="bold" color={colors.accent.primary} /> : null}
                  <Text preset="label" color={on ? "accent" : "secondary"} style={{ marginLeft: on ? 4 : 0 }}>
                    {formatHour(h)}
                  </Text>
                </View>
              </PressableRow>
            );
          })}
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <Button
            label="Save availability"
            onPress={() => {
              setManageOpen(false);
              show("Availability saved");
            }}
          />
        </View>
      </Sheet>
    </SafeAreaView>
  );
}

function SessionCard({ session, onPress }: { session: CoachSession; onPress: () => void }) {
  if (session.status === "FREE") {
    return (
      <Card padded style={styles.sessionCard}>
        <View style={styles.freeRow}>
          <Plus size={18} color={colors.text.secondary} />
          <Text preset="bodyMedium" color="secondary" style={{ marginLeft: spacing.sm, flex: 1 }}>
            Open slot
          </Text>
          <Text preset="bodyMedium" color="secondary">
            {formatTime(session.startIso)}
          </Text>
        </View>
      </Card>
    );
  }
  return (
    <PressableRow onPress={onPress}>
      <Card padded style={styles.sessionCard}>
        <View style={styles.bookedRow}>
          <View style={{ flex: 1 }}>
            <Text preset="bodyMedium">{session.clientName}</Text>
            <Text preset="body" color="secondary">
              {session.gym}
            </Text>
          </View>
          <Text preset="bodyMedium">{formatTime(session.startIso)}</Text>
        </View>
      </Card>
    </PressableRow>
  );
}

function formatHour(h: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${period}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.base },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  pills: { paddingHorizontal: spacing.screen, gap: spacing.sm, paddingVertical: spacing.sm },
  pill: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
    minWidth: 52,
  },
  pillSel: { borderColor: colors.accent.primary, borderWidth: 1.5, backgroundColor: colors.surface.pressed },
  content: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
  sessionCard: { marginTop: spacing.md, width: "100%" },
  freeRow: { flexDirection: "row", alignItems: "center" },
  bookedRow: { flexDirection: "row", alignItems: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  slot: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
  },
  slotOn: { borderColor: colors.accent.primary, borderWidth: 1.5, backgroundColor: colors.surface.pressed },
});
