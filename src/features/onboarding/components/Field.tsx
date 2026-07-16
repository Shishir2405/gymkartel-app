import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Text, colors, radius, spacing, fontFamily } from "@/ui";

export interface FieldProps {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  autoFocus?: boolean;
  prefix?: string;
  hint?: string;
  hintTone?: "secondary" | "error";
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  testID?: string;
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  autoFocus,
  prefix,
  hint,
  hintTone = "secondary",
  multiline = false,
  autoCapitalize = "sentences",
  testID,
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  const boxStyle: ViewStyle[] = [styles.box];
  if (multiline) boxStyle.push(styles.boxMultiline);
  if (focused) boxStyle.push(styles.boxFocused);

  return (
    <View>
      <Text preset="label" color="secondary" style={styles.label}>
        {label}
      </Text>
      <View style={boxStyle}>
        {prefix ? (
          <Text preset="bodyMedium" color="secondary" style={styles.prefix}>
            {prefix}
          </Text>
        ) : null}
        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.disabled}
          selectionColor={colors.accent.primary}
          style={[styles.input, multiline ? styles.inputMultiline : null] as TextStyle[]}
          keyboardType={keyboardType ?? "default"}
          maxLength={maxLength ?? undefined}
          autoFocus={autoFocus ?? false}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {hint ? (
        <Text
          preset="body"
          color="secondary"
          style={[styles.hint, hintTone === "error" ? styles.hintError : null]}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.sm },
  box: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: spacing.lg,
  },
  boxMultiline: {
    alignItems: "flex-start",
    paddingVertical: spacing.md,
    minHeight: 96,
  },
  boxFocused: {
    borderColor: colors.text.secondary,
  },
  prefix: { marginRight: spacing.sm },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: fontFamily.sans,
    fontSize: 15,
    paddingVertical: spacing.md,
  },
  inputMultiline: {
    textAlignVertical: "top",
    minHeight: 72,
  },
  hint: { marginTop: spacing.sm },
  hintError: { color: colors.accent.primary },
});
