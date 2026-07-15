import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ShieldWarning } from "phosphor-react-native";
import {
  Screen,
  Text,
  Card,
  Button,
  Divider,
  useToast,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useSos } from "@/features/system/components/SosProvider";
import {
  useTrustedContactQuery,
  useSetTrustedContactMutation,
} from "@/graphql/generated/graphql";
import { toUiError } from "@/lib/errors";
import { haptics } from "@/lib/haptics";

/**
 * Trusted contact + SOS test. This is a safety screen, so it stays calm and
 * plain: no orange beyond the single Save button, quiet copy, one clear job.
 * The contact saved here is who we alert with live location during a session.
 */
export function SosContactsScreen(_props: MemberScreenProps<"SosContacts">) {
  const sos = useSos();
  const toast = useToast();
  const [{ data }] = useTrustedContactQuery();
  const [{ fetching }, setTrustedContact] = useSetTrustedContactMutation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Prefill from the saved trusted contact once it resolves.
  const saved = data?.trustedContact;
  useEffect(() => {
    if (saved) {
      setName((prev) => (prev.length === 0 ? saved.name : prev));
      setPhone((prev) => (prev.length === 0 ? saved.phone.replace(/^\+91/, "") : prev));
    }
  }, [saved]);

  const canSave = name.trim().length > 0 && phone.trim().length >= 10 && !fetching;

  const onSave = async () => {
    if (!canSave) return;
    const result = await setTrustedContact({
      input: { name: name.trim(), phone: `+91${phone.trim()}` },
    });
    const uiError = toUiError(result.error);
    if (uiError) {
      toast.show(uiError.message);
      return;
    }
    void haptics.success();
    toast.show("Saved");
  };

  return (
    <Screen
      scroll
      footer={<Button label="Save contact" onPress={() => void onSave()} disabled={!canSave} />}
    >
      <Text preset="title">SOS & trusted contact</Text>
      <Text preset="body" color="secondary" style={styles.intro}>
        Your trusted contact can be alerted with your live location during a
        session. We only share it when you trigger SOS.
      </Text>

      <Card padded style={styles.form}>
        <Text preset="label" color="secondary">
          FULL NAME
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Contact name"
          placeholderTextColor={colors.text.disabled}
          style={styles.input}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Divider style={styles.formDivider} />

        <Text preset="label" color="secondary">
          PHONE
        </Text>
        <View style={styles.phoneRow}>
          <View style={styles.prefix}>
            <Text preset="bodyMedium" color="secondary">
              +91
            </Text>
          </View>
          <TextInput
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, "").slice(0, 10))}
            placeholder="10-digit number"
            placeholderTextColor={colors.text.disabled}
            style={[styles.input, styles.phoneInput]}
            keyboardType="phone-pad"
            returnKeyType="done"
          />
        </View>
      </Card>

      <Card padded style={styles.testCard}>
        <View style={styles.testRow}>
          <ShieldWarning size={22} color={colors.text.secondary} />
          <View style={styles.testBody}>
            <Text preset="bodyMedium">Test SOS</Text>
            <Text preset="body" color="secondary" style={styles.testSub}>
              Open the emergency screen to see exactly what happens.
            </Text>
          </View>
          <Button
            label="Open"
            variant="secondary"
            fullWidth={false}
            onPress={sos.open}
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.md, marginBottom: spacing.lg },
  form: { marginBottom: spacing.lg },
  input: {
    marginTop: spacing.sm,
    color: colors.text.primary,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  formDivider: { marginTop: spacing.md },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  prefix: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surface.pressed,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  phoneInput: { flex: 1 },
  testCard: {},
  testRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  testBody: { flex: 1 },
  testSub: { marginTop: 2 },
});
