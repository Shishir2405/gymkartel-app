import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Bell,
  Vibrate,
  FileText,
  Lock,
  Scroll,
  SignOut,
  UserSwitch,
} from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Button,
  Sheet,
  Divider,
  SectionHeader,
  useToast,
  colors,
  spacing,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useAuth } from "@/app/providers/AuthProvider";
import { NavRow, ToggleRow } from "../components/Rows";

export function SettingsScreen(_props: MemberScreenProps<"Settings">) {
  const { setRole, signOut } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState(true);
  const [hapticsOn, setHapticsOn] = useState(true);
  const [signOutOpen, setSignOutOpen] = useState(false);

  return (
    <Screen scroll>
      <Text preset="title">Settings</Text>

      <SectionHeader title="Preferences" />
      <Card padded style={styles.card}>
        <ToggleRow
          icon={Bell}
          label="Notifications"
          subtitle="Streaks, bookings and pass reminders."
          value={notifications}
          onValueChange={setNotifications}
        />
        <Divider />
        <ToggleRow
          icon={Vibrate}
          label="Haptics"
          subtitle="Feedback on check-ins and key actions."
          value={hapticsOn}
          onValueChange={setHapticsOn}
        />
      </Card>

      <SectionHeader title="Account" />
      <Card padded style={styles.card}>
        <NavRow
          icon={UserSwitch}
          label="Switch to coach mode"
          subtitle="Same app, your coaching tools."
          onPress={() => {
            setRole("COACH");
            toast.show("Switched to coach mode");
          }}
        />
      </Card>

      <SectionHeader title="Legal" />
      <Card padded style={styles.card}>
        <NavRow icon={FileText} label="Terms of service" onPress={() => toast.show("Opening Terms")} />
        <Divider />
        <NavRow icon={Lock} label="Privacy policy" onPress={() => toast.show("Opening Privacy")} />
        <Divider />
        <NavRow icon={Scroll} label="Licenses" onPress={() => toast.show("Opening Licenses")} />
      </Card>

      <Card padded style={[styles.card, styles.signOutCard]}>
        <NavRow
          icon={SignOut}
          label="Sign out"
          destructive
          onPress={() => setSignOutOpen(true)}
        />
      </Card>

      <Sheet visible={signOutOpen} onClose={() => setSignOutOpen(false)} title="Sign out">
        <View style={styles.sheetTopAction}>
          <Button
            label="Sign out"
            variant="destructive"
            onPress={() => {
              setSignOutOpen(false);
              void signOut();
            }}
          />
        </View>
        <Text preset="body" color="secondary" style={styles.sheetBody}>
          You will need your phone number to sign back in. Your pass, streak and
          history stay on your account.
        </Text>
        <Button label="Stay signed in" onPress={() => setSignOutOpen(false)} />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {},
  signOutCard: { marginTop: spacing.xl },
  sheetTopAction: { marginBottom: spacing.sm },
  sheetBody: { marginBottom: spacing.lg, lineHeight: 22 },
});
