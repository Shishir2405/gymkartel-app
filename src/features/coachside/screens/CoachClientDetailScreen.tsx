import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CaretLeft, LockSimple } from "phosphor-react-native";
import {
  Text,
  Card,
  Divider,
  Button,
  Avatar,
  IconButton,
  Skeleton,
  StatePlaceholder,
  useToast,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { CoachScreenProps } from "@/app/navigation/types";
import { formatDate } from "@/lib/format";
import { toUiError } from "@/lib/errors";
import { useCoachClientQuery } from "@/graphql/generated/graphql";

type Section = "LOG" | "HISTORY" | "PHOTOS" | "NOTES";
const SECTIONS: { key: Section; label: string }[] = [
  { key: "LOG", label: "Log" },
  { key: "HISTORY", label: "History" },
  { key: "PHOTOS", label: "Photos" },
  { key: "NOTES", label: "Notes" },
];

const HISTORY = [
  { id: "h1", title: "Lower body, 60 min", dayOffset: -2 },
  { id: "h2", title: "Push day, 55 min", dayOffset: -5 },
  { id: "h3", title: "Intake and assessment", dayOffset: -14 },
];

export function CoachClientDetailScreen({ navigation, route }: CoachScreenProps<"CoachClientDetail">) {
  const { clientId } = route.params;
  const { show } = useToast();
  const [{ data, fetching, error }] = useCoachClientQuery({ variables: { id: clientId } });
  const client = data?.coachClient ?? null;
  const uiError = toUiError(error);
  const [section, setSection] = useState<Section>("LOG");

  const [logNote, setLogNote] = useState("");
  const [privateNote, setPrivateNote] = useState("");

  if (fetching && !client) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.topBar}>
          <IconButton icon={CaretLeft} accessibilityLabel="Back" onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.content}>
          <Skeleton height={64} radius={radius.card} />
          <Skeleton height={44} radius={radius.card} style={{ marginTop: spacing.xl }} />
          <Skeleton height={160} radius={radius.card} style={{ marginTop: spacing.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  if (!client) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <IconButton icon={CaretLeft} accessibilityLabel="Back" onPress={() => navigation.goBack()} />
        </View>
        <StatePlaceholder
          variant={uiError?.code === "OFFLINE" ? "offline" : "error"}
          title="We could not find this client"
          body={uiError?.message ?? "They may have been removed from your roster."}
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.topBar}>
        <IconButton icon={CaretLeft} accessibilityLabel="Back" onPress={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {}
        <View style={styles.identity}>
          <Avatar uri={client.avatarUrl ?? undefined} name={client.name} size={64} />
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text preset="title">{client.name}</Text>
            <Text preset="body" color="secondary">
              {client.sessions} {client.sessions === 1 ? "session" : "sessions"} together
            </Text>
          </View>
        </View>

        {}
        <View style={styles.segment}>
          {SECTIONS.map((s) => {
            const on = s.key === section;
            return (
              <View key={s.key} style={styles.segItemWrap}>
                <Text
                  preset="label"
                  color={on ? "accent" : "secondary"}
                  align="center"
                  onPress={() => setSection(s.key)}
                  style={[styles.segItem, on && styles.segItemOn]}
                >
                  {s.label.toUpperCase()}
                </Text>
              </View>
            );
          })}
        </View>

        {section === "LOG" ? (
          <Card padded>
            <Text preset="bodyMedium">Log a session</Text>
            <Text preset="body" color="secondary" style={{ marginTop: 4 }}>
              Record what you covered so it lands in this client's history.
            </Text>
            <TextInput
              value={logNote}
              onChangeText={setLogNote}
              placeholder="e.g. Squat 5x5, RDL, core finisher"
              placeholderTextColor={colors.text.disabled}
              style={styles.input}
              multiline
            />
            <View style={{ marginTop: spacing.md }}>
              <Button
                label="Save to history"
                disabled={logNote.trim().length === 0}
                onPress={() => {
                  setLogNote("");
                  show("Logged");
                }}
              />
            </View>
          </Card>
        ) : null}

        {section === "HISTORY" ? (
          <Card padded>
            {HISTORY.map((h, i) => {
              const d = new Date();
              d.setDate(d.getDate() + h.dayOffset);
              return (
                <View key={h.id}>
                  {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
                  <View style={styles.historyRow}>
                    <Text preset="bodyMedium" style={{ flex: 1 }}>
                      {h.title}
                    </Text>
                    <Text preset="label" color="secondary">
                      {formatDate(d.toISOString()).toUpperCase()}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Card>
        ) : null}

        {section === "PHOTOS" ? (
          <View>
            <View style={styles.consentRow}>
              <LockSimple size={14} color={colors.text.secondary} />
              <Text preset="label" color="secondary" style={{ marginLeft: 6 }}>
                SHOWN WITH CLIENT CONSENT
              </Text>
            </View>
            <View style={styles.photoGrid}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={styles.photo}>
                  <Image
                    source={{ uri: `https://picsum.photos/seed/coachclient${clientId}${i}/300` }}
                    style={styles.photoImg}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {section === "NOTES" ? (
          <Card padded>
            <View style={styles.notesHead}>
              <LockSimple size={14} color={colors.text.secondary} />
              <Text preset="label" color="secondary" style={{ marginLeft: 6 }}>
                PRIVATE, COACH ONLY
              </Text>
            </View>
            <TextInput
              value={privateNote}
              onChangeText={setPrivateNote}
              placeholder="Notes only you can see. Injuries to watch, form cues, plan for next block."
              placeholderTextColor={colors.text.disabled}
              style={[styles.input, { minHeight: 140 }]}
              multiline
            />
            <View style={{ marginTop: spacing.md }}>
              <Button label="Save note" onPress={() => show("Saved")} />
            </View>
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.base },
  topBar: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  content: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxxl },
  identity: { flexDirection: "row", alignItems: "center", marginTop: spacing.sm },
  segment: {
    flexDirection: "row",
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
    padding: spacing.xs,
  },
  segItemWrap: { flex: 1 },
  segItem: { paddingVertical: spacing.sm, borderRadius: radius.sm },
  segItemOn: { backgroundColor: colors.surface.pressed },
  input: {
    marginTop: spacing.md,
    minHeight: 88,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.pressed,
    color: colors.text.primary,
    padding: spacing.md,
    textAlignVertical: "top",
    fontSize: 15,
  },
  historyRow: { flexDirection: "row", alignItems: "center" },
  consentRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  photo: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: radius.card,
    overflow: "hidden",
    backgroundColor: colors.surface.raised,
  },
  photoImg: { width: "100%", height: "100%" },
  notesHead: { flexDirection: "row", alignItems: "center" },
});
