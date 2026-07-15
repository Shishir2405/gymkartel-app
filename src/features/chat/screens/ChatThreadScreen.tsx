import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CaretLeft,
  PaperPlaneRight,
  MapPin,
  EyeSlash,
  LockSimple,
} from "phosphor-react-native";
import {
  Text,
  IconButton,
  StatePlaceholder,
  colors,
  radius,
  spacing,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useBookingsQuery } from "@/graphql/generated/graphql";
import { formatTime } from "@/lib/format";
import { haptics } from "@/lib/haptics";
import { SosShield } from "@/features/system/components/SosShield";
import { maskPii } from "../lib/mask";
import { mockThread, type ChatMessage } from "../lib/messages";

/**
 * Chat thread. EVERY message body — mock, incoming, and just-sent — is rendered
 * through `maskPii`, so phone numbers, emails and links are hidden in both
 * directions. The SOS shield sits top-right; a location affordance and a safety
 * strip keep the on-platform guarantees visible. If the booking is not unlocked
 * the thread is replaced by a plain locked state.
 */
export function ChatThreadScreen({ navigation, route }: MemberScreenProps<"ChatThread">) {
  const { bookingId, peerName } = route.params;
  const [{ data }] = useBookingsQuery();

  // Only a booking we can positively see AND is not unlocked is treated as
  // locked; unknown bookings (no server / entered from a profile) stay usable.
  const booking = data?.bookings.find((b) => b.id === bookingId);
  const locked = booking != null && !booking.chatUnlocked;

  const [messages, setMessages] = useState<ChatMessage[]>(() => mockThread(bookingId));
  const [draft, setDraft] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const ordered = useMemo(() => [...messages].reverse(), [messages]);

  const onSend = useCallback(() => {
    const body = draft.trim();
    if (!body) return;
    void haptics.light();
    setMessages((prev) => [
      ...prev,
      {
        id: `${bookingId}-local-${prev.length + 1}`,
        fromMe: true,
        body,
        sentAtIso: new Date().toISOString(),
      },
    ]);
    setDraft("");
  }, [draft, bookingId]);

  const header = (
    <SafeAreaView edges={["top"]}>
      <View style={styles.header}>
        <IconButton
          icon={CaretLeft}
          accessibilityLabel="Back"
          onPress={() => navigation.goBack()}
          color={colors.text.primary}
        />
        <Text preset="title" numberOfLines={1} style={styles.headerTitle}>
          {peerName}
        </Text>
        <SosShield />
      </View>
    </SafeAreaView>
  );

  if (locked) {
    return (
      <View style={styles.root}>
        {header}
        <StatePlaceholder
          icon={<LockSimple size={40} color={colors.text.secondary} />}
          title="Chat is locked"
          body="This chat opens once your booking is confirmed."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {header}

      {/* Safety strip */}
      <View style={styles.strip}>
        <EyeSlash size={14} color={colors.text.secondary} />
        <Text preset="body" color="secondary" style={styles.stripText}>
          Numbers and links are hidden for your safety.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <FlatList
          ref={listRef}
          data={ordered}
          inverted
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <Bubble message={item} />}
        />

        <SafeAreaView edges={["bottom"]} style={styles.inputWrap}>
          <View style={styles.inputBar}>
            <IconButton
              icon={MapPin}
              accessibilityLabel="Share location"
              onPress={() => navigation.navigate("LocationShare", { bookingId })}
              color={colors.text.secondary}
            />
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="Message"
              placeholderTextColor={colors.text.disabled}
              multiline
              onSubmitEditing={onSend}
            />
            <IconButton
              icon={PaperPlaneRight}
              accessibilityLabel="Send"
              onPress={onSend}
              color={draft.trim() ? colors.accent.primary : colors.text.disabled}
              weight="fill"
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const masked = maskPii(message.body);
  return (
    <View style={[styles.bubbleRow, message.fromMe ? styles.rowMe : styles.rowPeer]}>
      <View style={[styles.bubble, message.fromMe ? styles.bubbleMe : styles.bubblePeer]}>
        <Text preset="body">{masked}</Text>
        <Text preset="label" color="secondary" style={styles.time}>
          {formatTime(message.sentAtIso)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.base },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  headerTitle: { flex: 1 },
  strip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.raised,
    borderBottomWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  stripText: { flex: 1 },
  messages: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  bubbleRow: { width: "100%", flexDirection: "row" },
  rowMe: { justifyContent: "flex-end" },
  rowPeer: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  bubbleMe: { backgroundColor: colors.surface.pressed },
  bubblePeer: { backgroundColor: colors.surface.raised },
  time: { marginTop: 4, alignSelf: "flex-end" },
  inputWrap: {
    borderTopWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.bg.base,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    color: colors.text.primary,
    fontSize: 15,
  },
});
