import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ChatCircle } from "phosphor-react-native";
import {
  Text,
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
import { useChatInboxQuery, type ChatThreadRowFragment } from "@/graphql/generated/graphql";
import { toUiError } from "@/lib/errors";
import { formatTime } from "@/lib/format";
import { maskPii } from "../lib/mask";

export function ChatInboxScreen({ navigation }: MemberScreenProps<"ChatInbox">) {
  const [{ data, fetching, error }, refetch] = useChatInboxQuery();
  const uiError = toUiError(error);

  const threads = data?.chatInbox ?? [];

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
          variant={uiError.code === "OFFLINE" ? "offline" : "error"}
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
        keyExtractor={(t) => t.bookingId}
        ListHeaderComponent={
          <Text preset="title" style={styles.listTitle}>
            Messages
          </Text>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <InboxRow
            thread={item}
            onPress={() =>
              navigation.navigate("ChatThread", {
                bookingId: item.bookingId,
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
  thread,
  onPress,
}: {
  thread: ChatThreadRowFragment;
  onPress: () => void;
}) {
  const last = thread.lastMessage;
  const preview = last ? maskPii(last.text) : "No messages yet";
  const time = last ? formatTime(last.sentAt) : "";

  return (
    <PressableRow onPress={onPress} style={styles.row}>
      <Avatar name={thread.coach.displayName} size={48} />
      <View style={styles.rowText}>
        <View style={styles.rowHead}>
          <Text preset="bodyMedium" numberOfLines={1} style={styles.name}>
            {thread.coach.displayName}
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
