import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ChatCircle } from "phosphor-react-native";
import {
  Text,
  Card,
  Avatar,
  Divider,
  Skeleton,
  StatePlaceholder,
  PressableRow,
  colors,
  spacing,
} from "@/ui";
import { Screen } from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useBookingsQuery, type BookingRowFragment } from "@/graphql/generated/graphql";
import { toUiError } from "@/lib/errors";
import { formatTime } from "@/lib/format";
import { maskPii } from "../lib/mask";
import { mockThread } from "../lib/messages";

/**
 * Chat inbox — one thread per booking that has unlocked chat. The last-message
 * preview is masked exactly like the thread itself, so PII never leaks even in
 * the list. When nothing is unlocked, the empty state explains the gate.
 */
export function ChatInboxScreen({ navigation }: MemberScreenProps<"ChatInbox">) {
  const [{ data, fetching, error }, refetch] = useBookingsQuery();
  const uiError = toUiError(error);

  const threads = (data?.bookings ?? []).filter((b) => b.chatUnlocked);

  if (fetching && !data) {
    return (
      <Screen>
        <Text preset="title" style={styles.title}>
          Messages
        </Text>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={72} radius={16} style={styles.skeleton} />
        ))}
      </Screen>
    );
  }

  if (uiError) {
    return (
      <Screen>
        <Text preset="title" style={styles.title}>
          Messages
        </Text>
        <StatePlaceholder
          variant="error"
          title="We could not load your messages"
          body={uiError.message}
          actionLabel="Try again"
          onAction={() => refetch({ requestPolicy: "network-only" })}
        />
      </Screen>
    );
  }

  if (threads.length === 0) {
    return (
      <Screen>
        <Text preset="title" style={styles.title}>
          Messages
        </Text>
        <StatePlaceholder
          variant="empty"
          icon={<ChatCircle size={40} color={colors.text.secondary} />}
          title="No conversations yet"
          body="Chat unlocks after you book a session."
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={threads}
        keyExtractor={(b) => b.id}
        ListHeaderComponent={
          <Text preset="title" style={styles.listTitle}>
            Messages
          </Text>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <InboxRow
            booking={item}
            onPress={() =>
              navigation.navigate("ChatThread", {
                bookingId: item.id,
                peerName: item.coach.displayName,
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Screen>
  );
}

function InboxRow({
  booking,
  onPress,
}: {
  booking: BookingRowFragment;
  onPress: () => void;
}) {
  const thread = mockThread(booking.id);
  const last = thread[thread.length - 1];
  const preview = last ? maskPii(last.body) : "";
  const time = last ? formatTime(last.sentAtIso) : "";

  return (
    <PressableRow onPress={onPress} style={styles.row}>
      <Avatar name={booking.coach.displayName} size={48} />
      <View style={styles.rowText}>
        <View style={styles.rowHead}>
          <Text preset="bodyMedium" numberOfLines={1} style={styles.name}>
            {booking.coach.displayName}
          </Text>
          <Text preset="body" color="secondary">
            {time}
          </Text>
        </View>
        <Text preset="body" color="secondary" numberOfLines={1}>
          {preview}
        </Text>
      </View>
    </PressableRow>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.lg },
  listTitle: { paddingTop: spacing.sm, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
  skeleton: { marginBottom: spacing.md },
  row: { gap: spacing.md },
  rowText: { flex: 1, gap: 2 },
  rowHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  name: { flexShrink: 1 },
});
