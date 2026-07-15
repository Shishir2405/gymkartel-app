import React from "react";
import { StyleSheet, View } from "react-native";
import { Bell, Flame, Barbell, Receipt, ShieldWarning, CircleNotch } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Divider,
  Skeleton,
  StatePlaceholder,
  PressableRow,
  colors,
  spacing,
} from "../../../ui";
import type { MemberScreenProps } from "../../../app/navigation/types";
import { formatDate } from "../../../lib/format";
import { toUiError } from "../../../lib/errors";
import {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  NotificationKind,
  type NotificationRowFragment,
} from "../../../graphql/generated/graphql";

/**
 * Notifications ("Intel"). Plain, factual entries — no exclamation marks, no
 * emojis. Live from `notifications`; tapping an unread row marks it read via
 * `markNotificationRead`. Loading / empty / error states preserved.
 */
export function NotificationsScreen(_props: MemberScreenProps<"Notifications">) {
  const [{ data, fetching, error }, refetch] = useNotificationsQuery();
  const [, markRead] = useMarkNotificationReadMutation();
  const uiError = toUiError(error);

  const items = data?.notifications ?? [];

  if (fetching && !data) {
    return (
      <Screen scroll>
        <Text preset="title" style={{ marginBottom: spacing.md }}>
          Intel
        </Text>
        <Card padded>
          <Skeleton height={16} width="70%" />
          <Skeleton height={16} width="50%" style={{ marginTop: spacing.md }} />
          <Skeleton height={16} width="60%" style={{ marginTop: spacing.md }} />
        </Card>
      </Screen>
    );
  }

  if (uiError) {
    return (
      <Screen>
        <Text preset="title" style={{ marginBottom: spacing.md }}>
          Intel
        </Text>
        <StatePlaceholder
          variant={uiError.code === "OFFLINE" ? "offline" : "error"}
          icon={<Bell size={40} color={colors.text.secondary} />}
          title="We could not load your intel"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      </Screen>
    );
  }

  if (items.length === 0) {
    return (
      <Screen>
        <StatePlaceholder
          icon={<Bell size={40} color={colors.text.disabled} />}
          variant="empty"
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
            <IntelRow item={item} onRead={() => void markRead({ id: item.id })} />
            {i < items.length - 1 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
          </View>
        ))}
      </Card>
    </Screen>
  );
}

function iconFor(kind: NotificationKind): React.ReactNode {
  switch (kind) {
    case NotificationKind.Streak:
      return <Flame size={20} weight="fill" color={colors.accent.primary} />;
    case NotificationKind.Booking:
      return <Barbell size={20} color={colors.text.secondary} />;
    case NotificationKind.Pass:
      return <Receipt size={20} color={colors.text.secondary} />;
    case NotificationKind.Safety:
      return <ShieldWarning size={20} color={colors.text.secondary} />;
    case NotificationKind.General:
    default:
      return <CircleNotch size={20} color={colors.text.secondary} />;
  }
}

function IntelRow({ item, onRead }: { item: NotificationRowFragment; onRead: () => void }) {
  return (
    <PressableRow
      onPress={() => {
        if (!item.read) onRead();
      }}
      style={styles.row}
    >
      <View style={styles.icon}>{iconFor(item.kind)}</View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text preset="bodyMedium" style={styles.title}>
            {item.title}
          </Text>
          {!item.read ? <View style={styles.unreadDot} /> : null}
        </View>
        <Text preset="body" color="secondary" style={{ marginTop: 2 }}>
          {item.body}
        </Text>
        <Text preset="label" color="disabled" style={{ marginTop: 6 }}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </PressableRow>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start" },
  icon: { marginRight: spacing.md, marginTop: 2 },
  body: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { flex: 1 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
    backgroundColor: colors.accent.primary,
  },
});
