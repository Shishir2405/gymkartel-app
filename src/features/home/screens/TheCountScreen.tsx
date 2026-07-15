import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Screen,
  Text,
  Card,
  Divider,
  Skeleton,
  colors,
  spacing,
} from "../../../ui";
import type { MemberScreenProps } from "../../../app/navigation/types";
import { useViewerQuery, useCheckInHistoryQuery } from "../../../graphql/generated/graphql";
import { formatDate } from "../../../lib/format";

/**
 * The Count detail. The lifetime record: total check-ins, current streak, and a
 * plain list of recent entries. The big figures are Barlow Condensed; the copy
 * stays factual ("First entry writes the record").
 */
export function TheCountScreen(_props: MemberScreenProps<"TheCount">) {
  const [viewer] = useViewerQuery();
  const [history] = useCheckInHistoryQuery({ variables: { limit: 30 } });

  const streak = viewer.data?.viewer?.streak.current ?? 0;
  const entries = history.data?.checkInHistory ?? [];

  return (
    <Screen scroll>
      <Text preset="title" style={{ marginBottom: spacing.md }}>
        The Count
      </Text>

      <View style={styles.stats}>
        <Card padded style={styles.stat}>
          <Text preset="displayMedium">{streak}</Text>
          <Text preset="label" color="secondary">
            CURRENT STREAK
          </Text>
        </Card>
        <Card padded style={styles.stat}>
          <Text preset="displayMedium">{entries.length}</Text>
          <Text preset="label" color="secondary">
            RECENT ENTRIES
          </Text>
        </Card>
      </View>

      <Text preset="label" color="secondary" style={styles.header}>
        THE RECORD
      </Text>

      {history.fetching && entries.length === 0 ? (
        <Card padded>
          <Skeleton height={16} width="70%" />
          <Skeleton height={16} width="50%" style={{ marginTop: spacing.md }} />
        </Card>
      ) : entries.length === 0 ? (
        <Card padded>
          <Text preset="body" color="secondary">
            First entry writes the record. Scan at any gym in your tier to begin.
          </Text>
        </Card>
      ) : (
        <Card padded>
          {entries.map((e, i) => (
            <View key={e.id}>
              <View style={styles.entryRow}>
                <View>
                  <Text preset="bodyMedium">{e.gym.name}</Text>
                  <Text preset="label" color="disabled" style={{ marginTop: 2 }}>
                    {formatDate(e.scannedAt)}
                  </Text>
                </View>
                <Text preset="displayMedium" style={{ color: colors.text.secondary }}>
                  {e.dayNumber}
                </Text>
              </View>
              {i < entries.length - 1 ? <Divider style={{ marginVertical: spacing.sm }} /> : null}
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: "row", gap: spacing.md },
  stat: { flex: 1 },
  header: { marginTop: spacing.xl, marginBottom: spacing.md },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
