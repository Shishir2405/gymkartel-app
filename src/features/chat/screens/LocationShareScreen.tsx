import React from "react";
import { StyleSheet, View } from "react-native";
import { MapPin, Broadcast, Timer, LockSimple } from "phosphor-react-native";
import {
  Text,
  Card,
  Button,
  Divider,
  useToast,
  colors,
  radius,
  spacing,
} from "@/ui";
import { Screen } from "@/ui";
import type { MemberScreenProps } from "@/app/navigation/types";
import { useBookingsQuery, useShareLocationMutation } from "@/graphql/generated/graphql";
import { toUiError } from "@/lib/errors";
import { haptics } from "@/lib/haptics";

export function LocationShareScreen({ navigation, route }: MemberScreenProps<"LocationShare">) {
  const { bookingId } = route.params;
  const { show } = useToast();
  const [{ data }] = useBookingsQuery();
  const [{ fetching }, shareLocation] = useShareLocationMutation();

  const booking = data?.bookings.find((b) => b.id === bookingId);
  const enabled = booking == null ? true : booking.chatUnlocked;

  const onShare = async () => {
    if (!enabled || fetching) return;
    void haptics.medium();
    const result = await shareLocation({ bookingId, lat: 0, lng: 0 });
    const uiError = toUiError(result.error);
    show(uiError ? uiError.message : "Sharing live location");
    if (!uiError) navigation.goBack();
  };

  return (
    <Screen
      footer={
        <Button
          label="Share live location"
          onPress={() => void onShare()}
          disabled={!enabled || fetching}
        />
      }
    >
      <Text preset="title" style={styles.title}>
        Share location
      </Text>

      <View style={!enabled ? styles.disabled : undefined}>
        <View style={styles.hero}>
          <View style={styles.mapPlaceholder}>
            <MapPin size={40} color={colors.text.secondary} />
          </View>
        </View>

        <Card padded>
          <Row
            icon={<Broadcast size={18} color={colors.text.secondary} />}
            title="Live for the session only"
            body="The coach sees your location in real time while you are training together."
          />
          <Divider style={styles.divider} />
          <Row
            icon={<Timer size={18} color={colors.text.secondary} />}
            title="Auto-expires at session end"
            body="Sharing stops on its own when the session ends. You can also stop it any time."
          />
        </Card>

        <Text preset="body" color="secondary" style={styles.note}>
          Only this coach can see it, and only for this booking.
        </Text>
      </View>

      {!enabled ? (
        <View style={styles.lockedNote}>
          <LockSimple size={16} color={colors.text.secondary} />
          <Text preset="body" color="secondary" style={styles.lockedText}>
            Location sharing opens once your booking is active.
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}

function Row({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.row}>
      {icon}
      <View style={styles.rowText}>
        <Text preset="bodyMedium">{title}</Text>
        <Text preset="body" color="secondary">
          {body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.lg },
  disabled: { opacity: 0.4 },
  hero: { alignItems: "center", marginBottom: spacing.xl },
  mapPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: radius.card,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  divider: { marginVertical: spacing.md },
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  rowText: { flex: 1, gap: 2 },
  note: { marginTop: spacing.lg },
  lockedNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  lockedText: { flex: 1 },
});
