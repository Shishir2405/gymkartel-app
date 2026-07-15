import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CaretLeft } from "phosphor-react-native";
import { useToast, colors, spacing, radius } from "@/ui";
import type { CoachScreenProps } from "@/app/navigation/types";

type Severity = "MINOR" | "MODERATE" | "SERIOUS";
const SEVERITIES: { key: Severity; label: string }[] = [
  { key: "MINOR", label: "Minor" },
  { key: "MODERATE", label: "Moderate" },
  { key: "SERIOUS", label: "Serious" },
];

/**
 * Incident report. A serious moment, so the soft-dark theme is dropped for a
 * plain light human surface (white background, dark text) like the SOS overlay.
 * Restrained, factual, no decoration. The coach records what happened, when and
 * how serious, then submits.
 */
export function CoachIncidentReportScreen({ navigation }: CoachScreenProps<"CoachIncidentReport">) {
  const { show } = useToast();
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");
  const [severity, setSeverity] = useState<Severity | null>(null);

  const canSubmit = what.trim().length > 0 && when.trim().length > 0 && severity !== null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityLabel="Back">
            <CaretLeft size={24} color={colors.serious.text} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <RNText style={styles.title}>Report an incident</RNText>
          <RNText style={styles.subtitle}>
            Tell us what happened plainly. This goes to our safety team, not to the client. Take the
            time you need.
          </RNText>

          <RNText style={styles.label}>WHAT HAPPENED</RNText>
          <TextInput
            value={what}
            onChangeText={setWhat}
            placeholder="Describe the incident in your own words"
            placeholderTextColor={colors.serious.subtext}
            style={[styles.input, styles.multiline]}
            multiline
          />

          <RNText style={styles.label}>WHEN</RNText>
          <TextInput
            value={when}
            onChangeText={setWhen}
            placeholder="Date and rough time, e.g. 14 Jul, around 7 PM"
            placeholderTextColor={colors.serious.subtext}
            style={styles.input}
          />

          <RNText style={styles.label}>SEVERITY</RNText>
          <View style={styles.severityRow}>
            {SEVERITIES.map((s) => {
              const on = s.key === severity;
              return (
                <Pressable
                  key={s.key}
                  onPress={() => setSeverity(s.key)}
                  style={[styles.sevChip, on && styles.sevChipOn]}
                >
                  <RNText style={[styles.sevText, on && styles.sevTextOn]}>{s.label}</RNText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={() => {
              if (!canSubmit) return;
              show("Report submitted");
              navigation.goBack();
            }}
            disabled={!canSubmit}
            style={[styles.submit, !canSubmit && styles.submitDisabled]}
          >
            <RNText style={styles.submitText}>Submit report</RNText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.serious.surface },
  topBar: { paddingHorizontal: spacing.screen, paddingTop: spacing.sm },
  content: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xxl },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.serious.text,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.serious.subtext,
    marginTop: spacing.sm,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "600",
    color: colors.serious.subtext,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.serious.stroke,
    backgroundColor: colors.serious.surface,
    color: colors.serious.text,
    padding: spacing.md,
    fontSize: 15,
  },
  multiline: { minHeight: 120, textAlignVertical: "top" },
  severityRow: { flexDirection: "row", gap: spacing.sm },
  sevChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.serious.stroke,
    backgroundColor: colors.serious.surface,
  },
  sevChipOn: { borderColor: colors.serious.danger, borderWidth: 1.5 },
  sevText: { fontSize: 14, color: colors.serious.subtext, fontWeight: "500" },
  sevTextOn: { color: colors.serious.danger, fontWeight: "600" },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.serious.stroke,
  },
  submit: {
    height: 56,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.serious.danger,
  },
  submitDisabled: { backgroundColor: colors.serious.stroke },
  submitText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
});
