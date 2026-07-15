import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, Screen, colors, spacing, fontFamily } from "@/ui";
import type { AuthScreenProps } from "@/app/navigation/types";

/**
 * The front door. Wordmark centered in Barlow, a single quiet tagline, and the
 * one orange button pinned at the bottom. No decoration, no noise — the calm
 * before the club.
 */
export function SplashScreen({ navigation }: AuthScreenProps<"Splash">) {
  return (
    <Screen
      testID="splash"
      contentStyle={styles.content}
      footer={
        <Button
          testID="splash.enter"
          label="Enter the Club"
          onPress={() => navigation.navigate("PhoneOtp")}
        />
      }
    >
      <View style={styles.center}>
        <Text preset="label" color="secondary" style={styles.kicker}>
          Members only
        </Text>
        <Text style={styles.wordmark} align="center">
          GYM KARTEL
        </Text>
        <Text preset="body" color="secondary" align="center" style={styles.tagline}>
          One pass. Every gym. Any city in India.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  kicker: { marginBottom: spacing.lg },
  wordmark: {
    fontFamily: fontFamily.numberBold,
    fontSize: 56,
    lineHeight: 58,
    letterSpacing: 1,
    color: colors.text.primary,
  },
  tagline: { marginTop: spacing.md, maxWidth: 260 },
});
