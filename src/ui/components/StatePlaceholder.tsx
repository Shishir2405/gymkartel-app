import React from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "../tokens";
import { Text } from "./Text";
import { Button } from "./Button";

export interface StatePlaceholderProps {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "empty" | "error" | "offline";
  testID?: string;
}

export function StatePlaceholder({
  icon,
  title,
  body,
  actionLabel,
  onAction,
  testID,
}: StatePlaceholderProps) {
  return (
    <View style={styles.wrap} testID={testID}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text preset="title" align="center">
        {title}
      </Text>
      {body ? (
        <Text preset="body" color="secondary" align="center" style={styles.body}>
          {body}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} fullWidth={false} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  icon: { marginBottom: spacing.lg },
  body: { marginTop: spacing.sm, maxWidth: 300 },
  action: { marginTop: spacing.xl, minWidth: 220 },
});
