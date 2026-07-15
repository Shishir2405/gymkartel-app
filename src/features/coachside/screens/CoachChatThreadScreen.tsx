import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CaretLeft, ShieldCheck, PaperPlaneRight } from "phosphor-react-native";
import {
  Text,
  IconButton,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { CoachScreenProps } from "@/app/navigation/types";
import { formatTime } from "@/lib/format";
import { maskPii, threadSeed, type CoachChatMessage } from "@/features/coachside/lib/mock";

/**
 * Coach chat thread. Every message is passed through maskPii on render, so phone
 * numbers and emails never surface even if typed. A quiet safety strip sits
 * under the header — keep it in-app, no side deals.
 */
export function CoachChatThreadScreen({ navigation, route }: CoachScreenProps<"CoachChatThread">) {
  const { peerName } = route.params;
  const [messages, setMessages] = useState<CoachChatMessage[]>(() => threadSeed(peerName));
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, fromMe: true, text, timeIso: new Date().toISOString() },
    ]);
    setDraft("");
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <IconButton icon={CaretLeft} accessibilityLabel="Back" onPress={() => navigation.goBack()} />
        <Text preset="bodyMedium" style={{ flex: 1, marginLeft: spacing.sm }}>
          {peerName}
        </Text>
      </View>

      {/* Safety strip */}
      <View style={styles.safety}>
        <ShieldCheck size={14} color={colors.text.secondary} />
        <Text preset="label" color="secondary" style={{ marginLeft: 6, flex: 1 }}>
          KEEP IT IN-APP. CONTACT DETAILS ARE HIDDEN FOR BOTH OF YOU.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((m) => (
            <View key={m.id} style={[styles.bubbleRow, m.fromMe ? styles.mineRow : styles.theirsRow]}>
              <View style={[styles.bubble, m.fromMe ? styles.mine : styles.theirs]}>
                <Text preset="body" color={m.fromMe ? "onAccent" : "primary"}>
                  {maskPii(m.text)}
                </Text>
                <Text
                  preset="label"
                  color={m.fromMe ? "onAccent" : "secondary"}
                  style={{ marginTop: 4, opacity: 0.7 }}
                >
                  {formatTime(m.timeIso)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message"
            placeholderTextColor={colors.text.disabled}
            style={styles.composerInput}
            multiline
          />
          <IconButton
            icon={PaperPlaneRight}
            accessibilityLabel="Send"
            onPress={send}
            color={draft.trim() ? colors.accent.primary : colors.text.disabled}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.base },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  safety: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.raised,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  messages: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.sm },
  bubbleRow: { flexDirection: "row" },
  mineRow: { justifyContent: "flex-end" },
  theirsRow: { justifyContent: "flex-start" },
  bubble: { maxWidth: "78%", padding: spacing.md, borderRadius: radius.card },
  mine: { backgroundColor: colors.accent.primary, borderBottomRightRadius: 4 },
  theirs: {
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    borderBottomLeftRadius: 4,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.bg.base,
    gap: spacing.sm,
  },
  composerInput: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.pressed,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
  },
});
