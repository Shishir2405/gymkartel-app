import React, { useState } from "react";
import { View } from "react-native";
import { Linking } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../ui";
import { navigationTheme } from "./navTheme";
import { useAuth } from "../providers/AuthProvider";
import { useVersionGate } from "./useVersionGate";
import { AuthNavigator } from "./AuthNavigator";
import { MemberNavigator } from "./MemberNavigator";
import { CoachNavigator } from "./CoachNavigator";
import { HardUpdateGate, SoftUpdatePrompt } from "../../features/system";

/**
 * Top-level gates, applied in order:
 *  1. Version gate — hard gate blocks the whole app; soft prompt overlays it.
 *  2. Auth gate — signed out -> onboarding; signed in -> the app.
 *  3. Role switch — member vs coach experience (same design system).
 */
export function RootNavigator() {
  const { status, role } = useAuth();
  const { decision } = useVersionGate();
  const [softDismissed, setSoftDismissed] = useState(false);

  const openStore = () => {
    void Linking.openURL("https://gymkartel.app/download");
  };

  if (decision === "hard") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
        <StatusBar style="light" />
        <HardUpdateGate onUpdate={openStore} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="light" />
      {status === "loading" ? (
        <View style={{ flex: 1, backgroundColor: colors.bg.base }} />
      ) : status === "signedOut" ? (
        <AuthNavigator />
      ) : role === "COACH" ? (
        <CoachNavigator />
      ) : (
        <MemberNavigator />
      )}

      {decision === "soft" && !softDismissed ? (
        <SoftUpdatePrompt onDismiss={() => setSoftDismissed(true)} onUpdate={openStore} />
      ) : null}
    </NavigationContainer>
  );
}
