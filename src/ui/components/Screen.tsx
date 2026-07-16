import React from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { colors, spacing } from "../tokens";

export interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: readonly Edge[];
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
  testID?: string;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ["top", "left", "right"],
  footer,
  contentStyle,
  testID,
}: ScreenProps) {
  const pad: ViewStyle = padded ? { paddingHorizontal: spacing.screen } : {};
  return (
    <SafeAreaView style={styles.safe} edges={edges} testID={testID}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, pad, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, pad, contentStyle]}>{children}</View>
      )}
      {footer ? (
        <View style={[styles.footer, padded && { paddingHorizontal: spacing.screen }]}>
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.base },
  flex: { flex: 1 },
  scrollContent: { paddingTop: spacing.lg, paddingBottom: spacing.xxxl },
  footer: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.bg.base,
  },
});
