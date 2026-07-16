import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { MapPin } from "phosphor-react-native";
import {
  Text,
  Button,
  Skeleton,
  StatePlaceholder,
  PressableRow,
  Divider,
  colors,
  radius,
  spacing,
} from "@/ui";
import { Screen } from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useGymsQuery } from "@/graphql/generated/graphql";
import { toUiError } from "@/lib/errors";
import { haptics } from "@/lib/haptics";

const SLOT_HOURS = [6, 7, 8, 9, 17, 18, 19, 20];

function isTaken(dayIndex: number, hour: number): boolean {
  return (dayIndex * 3 + hour) % 4 === 0;
}

function hourLabel(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:00 ${period}`;
}

export function PickSlotScreen({ navigation, route }: MemberScreenProps<"PickSlot">) {
  const { coachId } = route.params;
  const [{ data, fetching, error }, refetch] = useGymsQuery({ variables: {} });
  const gyms = data?.gyms ?? [];
  const uiError = toUiError(error);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const [dayIndex, setDayIndex] = useState(0);
  const [hour, setHour] = useState<number | null>(null);
  const [gymId, setGymId] = useState<string | null>(null);

  const canContinue = hour != null && gymId != null;

  const onContinue = () => {
    const day = days[dayIndex];
    if (day == null || hour == null || gymId == null) return;
    const slot = new Date(day);
    slot.setHours(hour, 0, 0, 0);
    navigation.navigate("ReviewPay", {
      coachId,
      slotIso: slot.toISOString(),
      gymId,
    });
  };

  return (
    <Screen
      scroll
      testID="pick-slot"
      footer={
        <Button testID="pick-slot.continue" label="Continue" onPress={onContinue} disabled={!canContinue} />
      }
    >
      <Text preset="title" style={styles.title}>
        Pick a slot
      </Text>

      {}
      <Text preset="label" color="secondary" style={styles.section}>
        DATE
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateRow}
      >
        {days.map((d, i) => {
          const selected = i === dayIndex;
          return (
            <Pressable
              key={d.toISOString()}
              testID={`pick-slot.date.${i}`}
              onPress={() => {
                void haptics.light();
                setDayIndex(i);
                setHour(null);
              }}
            >
              <View style={[styles.datePill, selected && styles.selectedSurface]}>
                <Text preset="label" color={selected ? "accent" : "secondary"}>
                  {d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase()}
                </Text>
                <Text
                  preset="bodyMedium"
                  style={{ color: selected ? colors.accent.primary : colors.text.primary }}
                >
                  {d.getDate()}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {}
      <Text preset="label" color="secondary" style={styles.section}>
        TIME
      </Text>
      <View style={styles.timeGrid}>
        {SLOT_HOURS.map((h) => {
          const taken = isTaken(dayIndex, h);
          const selected = hour === h;
          return (
            <Pressable
              key={h}
              testID={`pick-slot.time.${h}`}
              disabled={taken}
              onPress={() => {
                void haptics.light();
                setHour(h);
              }}
              style={styles.timeCell}
            >
              <View
                style={[
                  styles.timeSlot,
                  taken ? styles.timeTaken : styles.timeFree,
                  selected && styles.selectedSurface,
                ]}
              >
                <Text
                  preset="bodyMedium"
                  color={taken ? "disabled" : selected ? "accent" : "primary"}
                >
                  {hourLabel(h)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {}
      <Text preset="label" color="secondary" style={styles.section}>
        GYM
      </Text>
      {fetching && gyms.length === 0 ? (
        <View>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={64} radius={12} style={styles.gymSkeleton} />
          ))}
        </View>
      ) : uiError ? (
        <StatePlaceholder
          variant="error"
          title="We could not load gyms"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      ) : gyms.length === 0 ? (
        <StatePlaceholder
          variant="empty"
          icon={<MapPin size={40} color={colors.text.secondary} />}
          title="No gyms available"
          body="Gyms in your zone will appear here."
        />
      ) : (
        <View style={styles.gymList}>
          {gyms.map((g, i) => {
            const selected = gymId === g.id;
            return (
              <View key={g.id}>
                {i > 0 ? <Divider /> : null}
                <PressableRow testID={`pick-slot.gym.${g.id}`} onPress={() => setGymId(g.id)} style={styles.gymRow}>
                  <MapPin
                    size={20}
                    color={selected ? colors.accent.primary : colors.text.secondary}
                  />
                  <View style={styles.gymText}>
                    <Text
                      preset="bodyMedium"
                      color={selected ? "accent" : "primary"}
                    >
                      {g.name}
                    </Text>
                    <Text preset="body" color="secondary">
                      {g.zone} · {g.tier}
                    </Text>
                  </View>
                </PressableRow>
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.sm },
  section: { marginTop: spacing.xl, marginBottom: spacing.md },
  dateRow: { gap: spacing.sm, paddingRight: spacing.screen },
  datePill: {
    width: 60,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  timeCell: { width: "31%" },
  timeSlot: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  timeFree: { backgroundColor: colors.surface.raised },
  timeTaken: { backgroundColor: colors.surface.pressed, opacity: 0.4 },
  selectedSurface: {
    backgroundColor: colors.surface.pressed,
    borderWidth: 1.5,
    borderColor: colors.accent.primary,
  },
  gymSkeleton: { marginBottom: spacing.md },
  gymList: {},
  gymRow: { gap: spacing.md },
  gymText: { flex: 1 },
});
