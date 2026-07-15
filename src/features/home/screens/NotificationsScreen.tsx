import React from "react";
import { StyleSheet, View } from "react-native";
import { Bell, Flame, Barbell, Receipt } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Divider,
  StatePlaceholder,
  colors,
  spacing,
} from "../../../ui";
import type { MemberScreenProps } from "../../../app/navigation/types";
import { formatDate } from "../../../lib/format";

interface Intel {
  id: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  at: string;
}

/**
 * Notifications ("Intel"). Plain, factual entries — no exclamation marks, no
 * emojis. Grouped in one card list with hairline dividers.
 */
export function NotificationsScreen(_props: MemberScreenProps<"Notifications">) {
  const items: Intel[] = [
    {
      id: "1",
      icon: <Flame size={20} weight="fill" color={colors.accent.primary} />,
      title: "Streak held",
      body: "You checked in three days running. Two more days earns a bonus day.",
      at: new Date(Date.now() - 3600_000).toISOString(),
    },
    {
      id: "2",
      icon: <Barbell size={20} color={colors.text.secondary} />,
      title: "Session confirmed",
      body: "Your session with Arjun is set for Saturday morning.",
      at: new Date(Date.now() - 86_400_000).toISOString(),
    },
    {
      id: "3",
      icon: <Receipt size={20} color={colors.text.secondary} />,
      title: "Payment received",
      body: "Your 15-day pass is active. Days roll over inside the window.",
      at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    },
  ];

  if (items.length === 0) {
    return (
      <Screen>
        <StatePlaceholder
          icon={<Bell size={40} color={colors.text.disabled} />}
          title="No intel yet"
          body="Check-ins, sessions and payments will show up here."
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text preset="title" style={{ marginBottom: spacing.md }}>
        Intel
      </Text>
      <Card padded>
        {items.map((item, i) => (
          <View key={item.id}>
            <View style={styles.row}>
              <View style={styles.icon}>{item.icon}</View>
              <View style={styles.body}>
                <Text preset="bodyMedium">{item.title}</Text>
                <Text preset="body" color="secondary" style={{ marginTop: 2 }}>
                  {item.body}
                </Text>
                <Text preset="label" color="disabled" style={{ marginTop: 6 }}>
                  {formatDate(item.at)}
                </Text>
              </View>
            </View>
            {i < items.length - 1 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start" },
  icon: { marginRight: spacing.md, marginTop: 2 },
  body: { flex: 1 },
});
