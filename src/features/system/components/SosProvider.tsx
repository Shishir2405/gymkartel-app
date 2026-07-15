import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Phone, UserFocus, WarningOctagon, X } from "phosphor-react-native";
import { colors, spacing, radius } from "../../../ui";
import { Text, useToast } from "../../../ui";
import { useTriggerSosMutation, SosKind } from "../../../graphql/generated/graphql";
import { toUiError } from "../../../lib/errors";

/**
 * SOS is a SERIOUS moment — it drops the Soft-Dark Luxury theme entirely for a
 * plain, high-contrast, human overlay (golden rule 6). No orange branding, no
 * flourish. Three unmistakable actions.
 *
 * Exposed app-wide via context so the scanner, an active session and chat can
 * each mount the shield and open this overlay on a deliberate long-press.
 */
interface SosApi {
  open: () => void;
  close: () => void;
  visible: boolean;
}

const SosContext = createContext<SosApi>({ open: () => {}, close: () => {}, visible: false });

export function SosProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const { show } = useToast();
  const [, triggerSos] = useTriggerSosMutation();
  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);
  const api = useMemo(() => ({ open, close, visible }), [open, close, visible]);

  const fireSos = useCallback(
    async (kind: SosKind, okMessage: string) => {
      const result = await triggerSos({ input: { kind } });
      const uiError = toUiError(result.error);
      show(uiError ? uiError.message : okMessage);
      setVisible(false);
    },
    [triggerSos, show],
  );

  return (
    <SosContext.Provider value={api}>
      {children}
      <Modal visible={visible} animationType="fade" onRequestClose={close}>
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.heading}>Emergency</Text>
            <Pressable onPress={close} hitSlop={12} accessibilityLabel="Close">
              <X size={26} color={colors.serious.text} />
            </Pressable>
          </View>
          <Text style={styles.sub}>
            Choose an action. Your trusted contact can be alerted with your live
            location.
          </Text>

          <View style={styles.actions}>
            <SosAction
              icon={<Phone size={26} color={colors.serious.surface} weight="fill" />}
              title="Call emergency services"
              body="Dials the local emergency number."
              danger
              onPress={() => {
                void Linking.openURL("tel:112");
                void fireSos(SosKind.CallEmergency, "Emergency services dialled");
              }}
            />
            <SosAction
              icon={<UserFocus size={26} color={colors.serious.text} />}
              title="Alert trusted contact"
              body="Sends your live location to the contact you saved."
              onPress={() => void fireSos(SosKind.AlertTrustedContact, "Your trusted contact has been alerted")}
            />
            <SosAction
              icon={<WarningOctagon size={26} color={colors.serious.text} />}
              title="Report an incident"
              body="Opens a plain form. We review every report."
              onPress={() => void fireSos(SosKind.ReportIncident, "Report sent to our safety team")}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SosContext.Provider>
  );
}

function SosAction({
  icon,
  title,
  body,
  onPress,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        danger && styles.actionDanger,
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={[styles.actionIcon, danger && styles.actionIconDanger]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionTitle, danger && { color: colors.serious.surface }]}>
          {title}
        </Text>
        <Text style={[styles.actionBody, danger && { color: colors.serious.surface }]}>
          {body}
        </Text>
      </View>
    </Pressable>
  );
}

export function useSos(): SosApi {
  return useContext(SosContext);
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.serious.surface,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: { fontSize: 28, fontWeight: "700", color: colors.serious.text },
  sub: { fontSize: 15, color: colors.serious.subtext, marginTop: spacing.sm, lineHeight: 22 },
  actions: { marginTop: spacing.xl, gap: spacing.md },
  action: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F6",
    borderRadius: radius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.serious.stroke,
  },
  actionDanger: { backgroundColor: colors.serious.danger, borderColor: colors.serious.danger },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginRight: spacing.md,
  },
  actionIconDanger: { backgroundColor: "rgba(255,255,255,0.18)" },
  actionTitle: { fontSize: 17, fontWeight: "600", color: colors.serious.text },
  actionBody: { fontSize: 13, color: colors.serious.subtext, marginTop: 2 },
});
