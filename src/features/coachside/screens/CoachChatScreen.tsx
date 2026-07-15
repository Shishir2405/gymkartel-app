import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatCircle } from "phosphor-react-native";
import {
  Text,
  Card,
  Divider,
  Avatar,
  StatePlaceholder,
  PressableRow,
  colors,
  spacing,
} from "@/ui";
import type { CoachTabScreenProps } from "@/app/navigation/types";
import { MOCK_THREADS, maskPii, type CoachThread } from "@/features/coachside/lib/mock";

/**
 * Coach inbox. One row per client thread. Chat only exists once a client books,
 * so the empty state says exactly that. Preview text is masked so no contact
 * detail leaks into the list.
 */
export function CoachChatScreen({ navigation }: CoachTabScreenProps<"CoachChat">) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text preset="title">Messages</Text>
      </View>

      {MOCK_THREADS.length === 0 ? (
        <StatePlaceholder
          variant="empty"
          icon={<ChatCircle size={40} color={colors.text.disabled} />}
          title="No messages yet"
          body="Chat opens after a client books."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Card padded={false}>
            {MOCK_THREADS.map((t, i) => (
              <View key={t.bookingId}>
                {i > 0 ? <Divider /> : null}
                <ThreadRow
                  thread={t}
                  onPress={() =>
                    navigation.navigate("CoachChatThread", {
                      bookingId: t.bookingId,
                      peerName: t.peerName,
                    })
                  }
                />
              </View>
            ))}
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function ThreadRow({ thread, onPress }: { thread: CoachThread; onPress: () => void }) {
  return (
    <PressableRow onPress={onPress} style={styles.threadRow}>
      <Avatar name={thread.peerName} size={44} />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text preset="bodyMedium">{thread.peerName}</Text>
        <Text preset="body" color="secondary" numberOfLines={1}>
          {maskPii(thread.lastMessage)}
        </Text>
      </View>
      {thread.unread ? <View style={styles.dot} /> : null}
    </PressableRow>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.base },
  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  content: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
  threadRow: { paddingHorizontal: spacing.lg },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent.primary,
  },
});
