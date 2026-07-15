import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { QrCode } from "phosphor-react-native";
import {
  Text,
  Button,
  IconButton,
  colors,
  spacing,
  radius,
} from "../../../ui";
import { X } from "phosphor-react-native";
import type { MemberTabScreenProps } from "../../../app/navigation/types";
import { useViewerQuery } from "../../../graphql/generated/graphql";
import { topUpCost, type Tier } from "@gymkartel/contracts";
import { parseCheckInQr } from "../offline/qr";
import { useGymByCode } from "../hooks/useGymByCode";
import { useCheckIn } from "../hooks/useCheckIn";
import { TopUpSheet } from "../components/TopUpSheet";
import { SosShield } from "../../system/components/SosShield";
import { haptics } from "../../../lib/haptics";

/**
 * The scanner — the app's center of gravity. Camera acquires in under a second
 * and a scan is processed OFFLINE: we never wait on the network to check you in.
 * The SOS shield sits top-right; the whole surface is a frame with one clear job.
 */
export function ScannerScreen({ navigation }: MemberTabScreenProps<"CheckIn">) {
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [viewer] = useViewerQuery();
  const { resolve } = useGymByCode();
  const { checkIn } = useCheckIn();

  const passTier = (viewer.data?.viewer?.activePass?.tier ?? null) as Tier | null;
  const handled = useRef(false);
  const [pendingTopUp, setPendingTopUp] = useState<{
    code: string;
    gymId: string;
    gymName: string;
    gymTier: Tier;
    amountPaise: number;
  } | null>(null);

  useEffect(() => {
    if (!hasPermission) void requestPermission();
  }, [hasPermission, requestPermission]);

  // Reset the one-shot guard whenever the screen regains focus.
  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      handled.current = false;
    });
    return unsub;
  }, [navigation]);

  const succeed = useCallback(
    (gymName: string) => {
      const day = (viewer.data?.viewer?.activePass?.daysUsed ?? 0) + 1;
      const streak = viewer.data?.viewer?.streak.current ?? 0;
      navigation.navigate("CheckInSuccess", {
        gymName,
        dayNumber: day,
        streak: streak + 1,
        rank: "Operator",
        date: new Date().toISOString(),
      });
    },
    [navigation, viewer.data],
  );

  const onDecoded = useCallback(
    (raw: string | null) => {
      if (handled.current) return;
      const parsed = parseCheckInQr(raw);
      if (!parsed.ok || !parsed.code) return;

      handled.current = true;
      const gym = resolve(parsed.code);
      const gymName = gym?.name ?? "This gym";
      const gymTier = (gym?.tier ?? passTier ?? "BASIC") as Tier;

      // No pass at all -> route to the ladder (the Ledger opens with a Pass).
      if (!passTier) {
        navigation.navigate("PassLadder");
        return;
      }

      const delta = topUpCost(passTier, gymTier);
      if (delta && delta > 0 && gym) {
        void haptics.warning();
        setPendingTopUp({
          code: parsed.code,
          gymId: gym.id,
          gymName,
          gymTier,
          amountPaise: delta,
        });
        return;
      }

      // Same/lower tier -> enqueue immediately, never blocking on network.
      checkIn({
        gymCheckInCode: parsed.code,
        gymId: gym?.id ?? parsed.code,
        gymName,
        acceptedTopUp: false,
      });
      succeed(gymName);
    },
    [resolve, passTier, navigation, checkIn, succeed],
  );

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      const value = codes[0]?.value ?? null;
      onDecoded(value);
    },
  });

  const confirmTopUp = useCallback(() => {
    if (!pendingTopUp) return;
    // A door not a wall: accept the top-up and check in immediately. Payment is
    // reconciled during sync; the member is not held at the door.
    checkIn({
      gymCheckInCode: pendingTopUp.code,
      gymId: pendingTopUp.gymId,
      gymName: pendingTopUp.gymName,
      acceptedTopUp: true,
    });
    const name = pendingTopUp.gymName;
    setPendingTopUp(null);
    succeed(name);
  }, [pendingTopUp, checkIn, succeed]);

  return (
    <View style={styles.root}>
      {hasPermission && device ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={!pendingTopUp}
          codeScanner={codeScanner}
        />
      ) : (
        <View style={styles.noCamera}>
          <QrCode size={48} color={colors.text.disabled} />
          <Text preset="body" color="secondary" align="center" style={styles.noCamText}>
            {hasPermission
              ? "Preparing the camera"
              : "Allow camera access to scan the door code."}
          </Text>
          {!hasPermission ? (
            <View style={styles.permBtn}>
              <Button label="Allow camera" onPress={() => void requestPermission()} fullWidth={false} />
            </View>
          ) : null}
        </View>
      )}

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topRow}>
          <IconButton
            icon={X}
            accessibilityLabel="Close scanner"
            onPress={() => navigation.navigate("Home")}
          />
          <SosShield />
        </View>

        <View style={styles.frameWrap} pointerEvents="none">
          <View style={styles.frame} />
          <Text preset="label" color="primary" style={styles.hint}>
            CHECK IN HERE
          </Text>
          <Text preset="body" color="secondary" align="center" style={styles.sub}>
            Point at the code on the door. This works offline.
          </Text>
        </View>
        <View />
      </SafeAreaView>

      {pendingTopUp ? (
        <TopUpSheet
          visible
          gymTier={pendingTopUp.gymTier}
          amountPaise={pendingTopUp.amountPaise}
          onConfirm={confirmTopUp}
          onClose={() => {
            setPendingTopUp(null);
            handled.current = false;
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  noCamera: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg.base,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  noCamText: { marginTop: spacing.lg, maxWidth: 280 },
  permBtn: { marginTop: spacing.xl },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
  },
  frameWrap: { alignItems: "center" },
  frame: {
    width: 240,
    height: 240,
    borderRadius: radius.sheet,
    borderWidth: 2,
    borderColor: colors.accent.primary,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  hint: { marginTop: spacing.xl },
  sub: { marginTop: spacing.sm, maxWidth: 260 },
});
