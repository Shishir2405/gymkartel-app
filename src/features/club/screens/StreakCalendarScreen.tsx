import React from "react";
import { StyleSheet, View } from "react-native";
import { Flame } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Divider,
  Icon,
  Skeleton,
  StatePlaceholder,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { toUiError } from "@/lib/errors";
import { useStreakCalendarQuery } from "@/graphql/generated/graphql";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"] as const;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** Build a Monday-first grid of cells for a month. Null cells pad the lead-in. */
function buildMonthCells(year: number, month: number): readonly (number | null)[] {
  const first = new Date(year, month, 1);
  // JS getDay: 0 = Sunday. Shift so Monday = 0.
  const lead = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/**
 * Streak calendar. The month grid marks recorded check-in days from the
 * server's `streakCalendar.days`, today carries the only orange (the active
 * flame), the streak rule is stated plainly, and the current streak (in weeks)
 * is shown in Barlow. Loading / empty / error states preserved.
 */
export function StreakCalendarScreen(_props: MemberScreenProps<"StreakCalendar">) {
  const [{ data, fetching, error }, refetch] = useStreakCalendarQuery();
  const uiError = toUiError(error);
  const cal = data?.streakCalendar ?? null;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();
  const monthName = MONTH_NAMES[month] ?? "";
  const cells = buildMonthCells(year, month);

  // Days of the current display month that have a recorded check-in.
  const checkedIn = new Set<number>();
  for (const iso of cal?.days ?? []) {
    const d = new Date(iso);
    if (d.getFullYear() === year && d.getMonth() === month) {
      checkedIn.add(d.getDate());
    }
  }

  if (fetching && !cal) {
    return (
      <Screen scroll testID="streak-calendar">
        <Text preset="title" style={styles.heading}>
          Streak
        </Text>
        <Skeleton height={96} radius={radius.card} />
        <Skeleton height={360} radius={radius.card} style={{ marginTop: spacing.lg }} />
      </Screen>
    );
  }

  if (uiError) {
    return (
      <Screen testID="streak-calendar">
        <StatePlaceholder
          variant={uiError.code === "OFFLINE" ? "offline" : "error"}
          icon={<Icon icon={Flame} size={40} color={colors.text.secondary} />}
          title="We could not load your streak"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      </Screen>
    );
  }

  if (!cal) return null;

  return (
    <Screen scroll testID="streak-calendar">
      <Text preset="title" style={styles.heading}>
        Streak
      </Text>

      <Card padded style={styles.streakCard}>
        <Text preset="label" color="secondary">
          CURRENT STREAK
        </Text>
        <View style={styles.streakRow}>
          <Text preset="displayLarge">{cal.weeks}</Text>
          <Text preset="body" color="secondary" style={styles.streakUnit}>
            {cal.weeks === 1 ? "week held" : "weeks held"}
          </Text>
        </View>
      </Card>

      <Card padded style={styles.calendarCard}>
        <Text preset="bodyMedium" style={styles.monthLabel}>
          {monthName} {year}
        </Text>

        <View style={styles.weekRow}>
          {WEEKDAYS.map((w, i) => (
            <View key={`${w}-${i}`} style={styles.cell}>
              <Text preset="label" color="disabled">
                {w}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((day, index) => {
            if (day === null) {
              return <View key={`pad-${index}`} style={styles.cell} />;
            }
            const isToday = day === todayDate;
            const isCheckedIn = checkedIn.has(day);
            return (
              <View key={day} style={styles.cell}>
                <View
                  style={[
                    styles.dayDot,
                    isCheckedIn && !isToday && styles.dayChecked,
                    isToday && styles.dayToday,
                  ]}
                >
                  {isToday ? (
                    <Icon icon={Flame} size={16} color={colors.text.primary} weight="fill" />
                  ) : (
                    <Text preset="body" color={isCheckedIn ? "primary" : "secondary"}>
                      {day}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <Divider style={styles.legendDivider} />
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, styles.dayChecked]} />
            <Text preset="body" color="secondary">
              Check-in
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, styles.dayToday]} />
            <Text preset="body" color="secondary">
              Today
            </Text>
          </View>
        </View>
      </Card>

      <Card padded style={styles.ruleCard}>
        <Text preset="label" color="secondary">
          HOW THE STREAK HOLDS
        </Text>
        <Text preset="body" color="secondary" style={styles.ruleBody}>
          Check in on any 5 of 7 days to hold your streak. A held week earns one
          bonus day. You have {cal.daysThisWindow} of this window logged
          {cal.windowDaysLeft > 0
            ? `, with ${cal.windowDaysLeft} ${cal.windowDaysLeft === 1 ? "day" : "days"} left`
            : ""}
          {cal.bonusDaysEarned > 0
            ? `. ${cal.bonusDaysEarned} bonus ${cal.bonusDaysEarned === 1 ? "day" : "days"} earned so far`
            : ""}
          .
        </Text>
      </Card>
    </Screen>
  );
}

const CELL = 40;

const styles = StyleSheet.create({
  heading: { marginBottom: spacing.lg },
  streakCard: {},
  streakRow: { flexDirection: "row", alignItems: "flex-end", marginTop: spacing.xs },
  streakUnit: { marginLeft: spacing.md, marginBottom: spacing.sm },
  calendarCard: { marginTop: spacing.lg },
  monthLabel: { marginBottom: spacing.md },
  weekRow: { flexDirection: "row" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: `${100 / 7}%`,
    height: CELL,
    alignItems: "center",
    justifyContent: "center",
  },
  dayDot: {
    width: CELL - 8,
    height: CELL - 8,
    borderRadius: (CELL - 8) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayChecked: {
    backgroundColor: colors.surface.pressed,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  dayToday: {
    backgroundColor: colors.accent.primary,
  },
  legendDivider: { marginVertical: spacing.md },
  legend: { flexDirection: "row", gap: spacing.xl },
  legendItem: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  legendSwatch: {
    width: 18,
    height: 18,
    borderRadius: radius.sm,
  },
  ruleCard: { marginTop: spacing.lg },
  ruleBody: { marginTop: spacing.sm },
});
