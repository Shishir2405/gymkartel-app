import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Text, Button, Screen, colors, spacing } from "@/ui";
import type { AuthScreenProps } from "@/app/navigation/types";
import {
  useRequestOtpMutation,
  useVerifyOtpMutation,
} from "@/graphql/generated/graphql";
import { useAuth } from "@/app/providers/AuthProvider";
import { useOnboardingStore } from "@/store/onboardingStore";
import { toUiError } from "@/lib/errors";
import { haptics } from "@/lib/haptics";
import { Field } from "../components/Field";

type Phase = "phone" | "otp";

const DIGITS = /^\d*$/;

/** +91 followed by a 10-digit Indian mobile starting 6-9. */
function isValidLocal(local: string): boolean {
  return /^[6-9]\d{9}$/.test(local);
}

/**
 * Phone then OTP, one screen in two phases. Sign-in happens here: a verified
 * OTP mints the session, the phone is saved to the onboarding form, and we move
 * on to name and photo. Errors are mapped to plain copy — never a raw message.
 */
export function PhoneOtpScreen({ navigation }: AuthScreenProps<"PhoneOtp">) {
  const [phase, setPhase] = useState<Phase>("phone");
  const [local, setLocal] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [{ fetching: sending }, requestOtp] = useRequestOtpMutation();
  const [{ fetching: verifying }, verifyOtp] = useVerifyOtpMutation();
  const { signIn } = useAuth();
  const setOnboarding = useOnboardingStore((s) => s.set);

  const phone = `+91${local}`;
  const phoneValid = isValidLocal(local);
  const codeValid = /^\d{6}$/.test(code);

  const onSend = async () => {
    if (!phoneValid || sending) return;
    setError(null);
    const result = await requestOtp({ input: { phone } });
    const uiError = toUiError(result.error);
    if (uiError) {
      setError(uiError.message);
      void haptics.error();
      return;
    }
    void haptics.success();
    setCode("");
    setPhase("otp");
  };

  const onVerify = async () => {
    if (!codeValid || verifying) return;
    setError(null);
    const result = await verifyOtp({ input: { phone, code } });
    const uiError = toUiError(result.error);
    if (uiError) {
      setError(uiError.message);
      void haptics.error();
      return;
    }
    const tokens = result.data?.verifyOtp;
    if (!tokens) {
      setError("That code did not match. Check it and try again.");
      void haptics.error();
      return;
    }
    void haptics.success();
    await signIn(tokens.accessToken, tokens.refreshToken);
    setOnboarding({ phone });
    navigation.navigate("NamePhoto");
  };

  const isPhone = phase === "phone";
  const busy = isPhone ? sending : verifying;
  const canSubmit = isPhone ? phoneValid : codeValid;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen
        testID="phone-otp"
        footer={
          <Button
            testID="phone-otp.submit"
            label={isPhone ? "Send code" : "Verify"}
            onPress={isPhone ? onSend : onVerify}
            disabled={!canSubmit}
            loading={busy}
          />
        }
      >
        <View style={styles.header}>
          <Text preset="title">{isPhone ? "Your number" : "Enter the code"}</Text>
          <Text preset="body" color="secondary" style={styles.sub}>
            {isPhone
              ? "We use it to sign you in and secure your pass."
              : `We sent a 6-digit code to ${phone}.`}
          </Text>
        </View>

        {isPhone ? (
          <Field
            testID="phone-otp.phone-input"
            label="Mobile number"
            value={local}
            onChangeText={(next) => {
              if (DIGITS.test(next)) {
                setLocal(next.slice(0, 10));
                setError(null);
              }
            }}
            prefix="+91"
            placeholder="98765 43210"
            keyboardType="number-pad"
            maxLength={10}
            autoFocus
            hint={
              error
                ? error
                : local.length > 0 && !phoneValid
                  ? "Enter a 10-digit number starting 6 to 9."
                  : "Indian mobile numbers only."
            }
            hintTone={error || (local.length > 0 && !phoneValid) ? "error" : "secondary"}
          />
        ) : (
          <>
            <Field
              testID="phone-otp.otp-input"
              label="Verification code"
              value={code}
              onChangeText={(next) => {
                if (DIGITS.test(next)) {
                  setCode(next.slice(0, 6));
                  setError(null);
                }
              }}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              hint={error ?? "6 digits."}
              hintTone={error ? "error" : "secondary"}
            />
            <View style={styles.actions}>
              <Button
                label="Change number"
                variant="ghost"
                onPress={() => {
                  setPhase("phone");
                  setError(null);
                }}
              />
              <Button
                label="Resend code"
                variant="ghost"
                onPress={onSend}
                disabled={sending}
              />
            </View>
          </>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg.base },
  header: { marginBottom: spacing.xl },
  sub: { marginTop: spacing.sm },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
});
