import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotePencil } from "phosphor-react-native";
import {
  Text,
  Card,
  Chip,
  Button,
  Divider,
  useToast,
  colors,
  spacing,
  typePresets,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { parseWorkout } from "@/features/ledger/parser/workoutParser";
import { useLogWorkoutMutation, type LedgerEntryRowFragment } from "@/graphql/generated/graphql";
import { LedgerRow } from "@/features/ledger/screens/TodayScreen";
import { toUiError } from "@/lib/errors";
import { haptics } from "@/lib/haptics";

const PLACEHOLDERS = ["bench 4x8 60kg", "squat 5x5 100kg", "deadlift 3x5 120kg"];

/**
 * The AI log input. Keyboard opens on entry; the placeholder cycles through real
 * examples while the field is empty. Every keystroke re-parses live on-device —
 * recognized tokens show as normal chips, anything ambiguous surfaces as an
 * amber "?" chip; we never silently guess. Save sends the raw text to the
 * `logWorkout` mutation and the server's parsed ledger entries append to the
 * session list.
 */
export function LogWorkoutScreen(_props: MemberScreenProps<"LogWorkout">) {
  const toast = useToast();
  const inputRef = useRef<TextInput>(null);
  const [{ fetching, error }, logWorkout] = useLogWorkoutMutation();
  const [entries, setEntries] = useState<LedgerEntryRowFragment[]>([]);

  const [value, setValue] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  // Cycle the placeholder only while the field is empty.
  useEffect(() => {
    if (value.length > 0) return;
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 2500);
    return () => clearInterval(id);
  }, [value.length]);

  const parsed = useMemo(() => parseWorkout(value), [value]);
  const trimmed = value.trim();
  const canSave = trimmed.length > 0 && !fetching;

  const onSave = async () => {
    if (!canSave) return;
    const result = await logWorkout({ text: trimmed });
    const uiError = toUiError(result.error);
    if (uiError) {
      toast.show(uiError.message);
      return;
    }
    const logged = result.data?.logWorkout ?? [];
    setEntries((prev) => [...logged, ...prev]);
    void haptics.success();
    toast.show("Logged");
    setValue("");
    setPlaceholderIdx(0);
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.top}>
          <Text preset="label" color="secondary">
            LOG A SET
          </Text>
          <Card padded style={styles.inputCard}>
            <TextInput
              ref={inputRef}
              autoFocus
              value={value}
              onChangeText={setValue}
              placeholder={PLACEHOLDERS[placeholderIdx] ?? PLACEHOLDERS[0]}
              placeholderTextColor={colors.text.disabled}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => void onSave()}
              selectionColor={colors.accent.primary}
            />
            {parsed.chips.length > 0 ? (
              <View style={styles.chips}>
                {parsed.chips.map((c, i) => (
                  <Chip key={`${c.kind}-${c.value}-${i}`} label={c.label} uncertain={c.uncertain} />
                ))}
              </View>
            ) : value.length > 0 ? (
              <Text preset="body" color="secondary" style={styles.hint}>
                Keep typing — sets, reps and weight will appear as chips.
              </Text>
            ) : null}
          </Card>

          {parsed.chips.some((c) => c.uncertain) ? (
            <Text preset="body" color="secondary" style={styles.uncertainNote}>
              Amber chips are unsure. Tidy the wording, for example "60kg" or "4x8".
            </Text>
          ) : null}

          {error ? (
            <Text preset="body" style={styles.errorNote}>
              {toUiError(error)?.message}
            </Text>
          ) : null}

          <Text preset="label" color="secondary" style={styles.listHeading}>
            LOGGED THIS SESSION
          </Text>
          {entries.length === 0 ? (
            <Card padded>
              <Text preset="body" color="secondary">
                Nothing logged yet. First entry writes the record.
              </Text>
            </Card>
          ) : (
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Card padded>
                {entries.map((e, i) => (
                  <View key={e.id}>
                    {i > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
                    <LedgerRow entry={e} />
                  </View>
                ))}
              </Card>
            </ScrollView>
          )}
        </View>

        <View style={styles.footer}>
          <Button
            label="Save"
            icon={<NotePencil size={20} color={colors.text.primary} weight="regular" />}
            onPress={() => void onSave()}
            disabled={!canSave}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.base },
  flex: { flex: 1 },
  top: { flex: 1, paddingHorizontal: spacing.screen, paddingTop: spacing.lg },
  inputCard: { marginTop: spacing.sm },
  input: {
    ...typePresets.title,
    color: colors.text.primary,
    padding: 0,
    minHeight: 32,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.lg },
  hint: { marginTop: spacing.md },
  uncertainNote: { marginTop: spacing.md },
  errorNote: { marginTop: spacing.md, color: colors.serious.danger },
  listHeading: { marginTop: spacing.xl, marginBottom: spacing.md },
  list: { flex: 1 },
  listContent: { paddingBottom: spacing.lg },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.bg.base,
  },
});
