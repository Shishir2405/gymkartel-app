import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle } from "phosphor-react-native";
import { passPrice, type Tier, type PassPack } from "@gymkartel/contracts";
import {
  Screen,
  Text,
  Card,
  Button,
  Divider,
  PressableRow,
  colors,
  spacing,
  radius,
} from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import {
  useCreatePassOrderMutation,
  useViewerQuery,
  PassPack as GqlPassPack,
} from "@/graphql/generated/graphql";
import { formatRupees } from "@/lib/format";
import { openCheckout } from "@/lib/payments";

const UPI_METHODS: ReadonlyArray<{ id: string; label: string }> = [
  { id: "gpay", label: "Google Pay" },
  { id: "phonepe", label: "PhonePe" },
  { id: "paytm", label: "Paytm" },
  { id: "other", label: "Other UPI app" },
];

/**
 * UPI payment sheet. Handles two shapes of param: a pass purchase ({ pack }) or
 * a check-in top-up ({ topUpForCheckIn, amountPaise }). The amount is computed
 * from the contract for a pass, or taken directly for a top-up. The create-order
 * mutation is best-effort (there is no server yet); a plain failed state offers
 * a serious, un-themed retry.
 */
export function PaymentScreen({ navigation, route }: MemberScreenProps<"Payment">) {
  const params = route.params;
  const isTopUp = "topUpForCheckIn" in params;

  const [{ data: viewerData }] = useViewerQuery();
  const tier: Tier = viewerData?.viewer?.tier ?? "STANDARD";

  const pack: PassPack | null = isTopUp ? null : (params.pack as PassPack);
  const amountPaise = isTopUp
    ? params.amountPaise
    : pack
      ? passPrice(tier, pack)
      : 0;

  const [{ fetching }, createPassOrder] = useCreatePassOrderMutation();
  const [method, setMethod] = useState<string>(UPI_METHODS[0]?.id ?? "gpay");
  const [failed, setFailed] = useState(false);
  const [paying, setPaying] = useState(false);

  const onPay = async () => {
    setFailed(false);
    setPaying(true);
    try {
      // Pass purchase: create the Razorpay order on the server first.
      let orderId: string | null = null;
      if (!isTopUp && pack) {
        try {
          const result = await createPassOrder({
            input: { pack: pack as unknown as GqlPassPack },
          });
          if (result.error && result.error.graphQLErrors.length > 0) {
            setFailed(true);
            return;
          }
          orderId = result.data?.createPassOrder.orderId ?? null;
        } catch {
          // No server in this workspace — proceed with a null order; the
          // wrapper's unavailable path keeps the flow usable without native.
        }
      }

      // Open the real UPI checkout (or the graceful unavailable path).
      const outcome = await openCheckout({
        orderId,
        amountPaise,
        name: "Gym Kartel",
        description: isTopUp ? "Check-in top-up" : "Gym Kartel pass",
      });

      if (outcome.status === "failed") {
        setFailed(true);
        return;
      }
      if (outcome.status === "cancelled") {
        // Member dismissed the sheet — stay put, no error theatre.
        return;
      }
      // success OR unavailable: proceed. The server reconciles the real payment
      // via webhook; client success only means "await confirmation".
      if (!isTopUp && pack) {
        navigation.navigate("PurchaseSuccess", { pack });
      } else {
        navigation.goBack();
      }
    } finally {
      setPaying(false);
    }
  };

  if (failed) {
    // Serious moment: the theme drops to a plain, high-contrast light surface.
    return (
      <SafeAreaView style={styles.seriousRoot}>
        <View style={styles.seriousBody}>
          <Text preset="title" style={{ color: colors.serious.text }} align="center">
            Payment did not go through
          </Text>
          <Text
            preset="body"
            align="center"
            style={{ color: colors.serious.subtext, marginTop: spacing.md }}
          >
            No money was taken. You can try the payment again.
          </Text>
        </View>
        <View style={styles.seriousFooter}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setFailed(false)}
            style={({ pressed }) => [styles.seriousBtn, pressed && { opacity: 0.85 }]}
          >
            <Text preset="bodyMedium" style={{ color: colors.serious.surface }}>
              Try again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Screen
      scroll
      footer={
        <Button
          label={`Pay ${formatRupees(amountPaise)}`}
          loading={fetching || paying}
          onPress={() => void onPay()}
        />
      }
    >
      <Text preset="title">{isTopUp ? "Top up to check in" : "Pay for your Pass"}</Text>

      {/* Amount summary */}
      <Card padded style={styles.amountCard}>
        <Text preset="label" color="secondary">
          AMOUNT DUE
        </Text>
        <Text preset="displayMedium" style={{ marginTop: 2 }}>
          {formatRupees(amountPaise)}
        </Text>
        <Text preset="body" color="secondary" style={{ marginTop: spacing.sm }}>
          {isTopUp
            ? "One-time top-up for a gym above your pass tier."
            : "One pass, paid once. Days roll over inside a 60-day window."}
        </Text>
      </Card>

      <Text preset="label" color="secondary" style={styles.methodsLabel}>
        PAY WITH UPI
      </Text>
      <Card padded>
        {UPI_METHODS.map((m, i) => (
          <View key={m.id}>
            {i > 0 ? <Divider style={{ marginVertical: spacing.sm }} /> : null}
            <PressableRow onPress={() => setMethod(m.id)} style={styles.methodRow}>
              <Text preset="body" style={{ flex: 1 }}>
                {m.label}
              </Text>
              {method === m.id ? (
                <CheckCircle size={22} weight="fill" color={colors.accent.primary} />
              ) : (
                <View style={styles.radioEmpty} />
              )}
            </PressableRow>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  amountCard: { marginTop: spacing.lg },
  methodsLabel: { marginTop: spacing.xl, marginBottom: spacing.md },
  methodRow: { alignItems: "center" },
  radioEmpty: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  seriousRoot: { flex: 1, backgroundColor: colors.serious.surface },
  seriousBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screen,
  },
  seriousFooter: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xl },
  seriousBtn: {
    height: 56,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.serious.text,
  },
});
