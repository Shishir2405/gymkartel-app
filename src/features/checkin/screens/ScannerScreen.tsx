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
import {
  useViewerQuery,
  useCreateTopUpOrderMutation,
} from "../../../graphql/generated/graphql";
import { topUpCost, type Tier } from "@gymkartel/contracts";
import { parseCheckInQr } from "../offline/qr";
import { newIdempotencyKey } from "../offline/outbox";
import { useGymByCode } from "../hooks/useGymByCode";
import { useCheckIn } from "../hooks/useCheckIn";
import { TopUpSheet } from "../components/TopUpSheet";
import { SosShield } from "../../system/components/SosShield";
import { haptics } from "../../../lib/haptics";
import { openCheckout } from "../../../lib/payments";
import { toUiError } from "../../../lib/errors";
import { IS_DEMO } from "../../../config/appMode";

/**
 * The scanner entry point. In a DEMO build there is no camera and no permission
 * — a themed surface with a "Simulate scan" button runs the exact same offline
 * check-in success path. In production it's the live vision-camera scanner. The
 * split keeps each component's hooks unconditional (IS_DEMO is build-time fixed).
 */
export function ScannerScreen(props: MemberTabScreenProps<"CheckIn">) {
  return IS_DEMO ? <DemoScannerSurface {...props} /> : <LiveScannerScreen {...props} />;
}

/**
 * The scanner — the app's center of gravity. Camera acquires in under a second
 * and a scan is processed OFFLINE: we never wait on the network to check you in.
 * The SOS shield sits top-right; the whole surface is a frame with one clear job.
 */
function LiveScannerScreen({ navigation }: MemberTabScreenProps<"CheckIn">) {
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [viewer] = useViewerQuery();
  const { resolve } = useGymByCode();
  const { checkIn } = useCheckIn();
  const [, createTopUpOrder] = useCreateTopUpOrderMutation();

  const passTier = (viewer.data?.viewer?.activePass?.tier ?? null) as Tier | null;
  const handled = useRef(false);
  const [pendingTopUp, setPendingTopUp] = useState<{
    code: string;
    gymId: string;
    gymName: string;
    gymTier: Tier;
    amountPaise: number;
  } | null>(null);
  const [topUpPaying, setTopUpPaying] = useState(false);
  const [topUpFailed, setTopUpFailed] = useState(false);

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

  const confirmTopUp = useCallback(async () => {
    if (!pendingTopUp) return;
    setTopUpFailed(false);
    setTopUpPaying(true);
    // One idempotency key shared by BOTH the pre-scan top-up order and the
    // outbox check-in below. The server keys the Razorpay order on it, so paying
    // here and the later `syncCheckIn` collapse to a single order.
    const idempotencyKey = newIdempotencyKey();
    const enqueue = (acceptedTopUp: boolean) => {
      checkIn({
        gymCheckInCode: pendingTopUp.code,
        gymId: pendingTopUp.gymId,
        gymName: pendingTopUp.gymName,
        acceptedTopUp,
        idempotencyKey,
      });
    };
    try {
      // Create the Razorpay order for the top-up delta before confirming the scan.
      let orderId: string | null = null;
      try {
        const created = await createTopUpOrder({
          input: {
            gymId: pendingTopUp.gymId,
            gymCheckInCode: pendingTopUp.code,
            idempotencyKey,
          },
        });
        if (created.error && created.error.graphQLErrors.length > 0) {
          // The server can decide no top-up is actually due (e.g. the pass was
          // upgraded meanwhile): a door not a wall — walk in free, no charge.
          if (toUiError(created.error)?.code === "TOP_UP_NOT_REQUIRED") {
            const name = pendingTopUp.gymName;
            enqueue(false);
            setPendingTopUp(null);
            setTopUpFailed(false);
            succeed(name);
            return;
          }
          void haptics.error();
          setTopUpFailed(true);
          return;
        }
        orderId = created.data?.createTopUpOrder.orderId ?? null;
      } catch {
        // No server in this workspace — proceed with a null order; the wrapper's
        // unavailable path preserves the flow in non-native builds.
      }

      // Open the real UPI checkout for the top-up delta with the server order.
      const outcome = await openCheckout({
        orderId,
        amountPaise: pendingTopUp.amountPaise,
        name: "Gym Kartel",
        description: `Top-up · ${pendingTopUp.gymName}`,
      });
      if (outcome.status === "failed") {
        void haptics.error();
        setTopUpFailed(true);
        return;
      }
      if (outcome.status === "cancelled") {
        // Keep the door open — the member can retry or step away.
        return;
      }
      // success or unavailable → a door not a wall: check in immediately with the
      // SAME idempotency key as the order. The payment is reconciled during sync;
      // the member is not held at the door.
      const name = pendingTopUp.gymName;
      enqueue(true);
      setPendingTopUp(null);
      setTopUpFailed(false);
      succeed(name);
    } finally {
      setTopUpPaying(false);
    }
  }, [pendingTopUp, createTopUpOrder, checkIn, succeed]);

  return (
    <View style={styles.root} testID="scanner">
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
              <Button testID="scanner.allow-camera" label="Allow camera" onPress={() => void requestPermission()} fullWidth={false} />
            </View>
          ) : null}
        </View>
      )}

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topRow}>
          <IconButton
            icon={X}
            testID="scanner.close"
            accessibilityLabel="Close scanner"
            onPress={() => navigation.navigate("Home")}
          />
          <SosShield />
        </View>

        <View style={styles.frameWrap} pointerEvents="none">
          <View style={styles.frame} />
          <Text testID="scanner.hint" preset="label" color="primary" style={styles.hint}>
            CHECK IN HERE
          </Text>
          <Text testID="scanner.offline-hint" preset="body" color="secondary" align="center" style={styles.sub}>
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
          loading={topUpPaying}
          failed={topUpFailed}
          onConfirm={() => void confirmTopUp()}
          onClose={() => {
            setPendingTopUp(null);
            setTopUpFailed(false);
            handled.current = false;
          }}
        />
      ) : null}
    </View>
  );
}

/**
 * The demo scanner surface. No camera, no permission, no vision-camera mount —
 * a "Simulate scan" button drives the identical offline success path (enqueue +
 * navigate to the seal-stamp success screen).
 */
function DemoScannerSurface({ navigation }: MemberTabScreenProps<"CheckIn">) {
  const [viewer] = useViewerQuery();
  const { checkIn } = useCheckIn();
  const [busy, setBusy] = useState(false);

  const onSimulate = useCallback(() => {
    if (busy) return;
    setBusy(true);
    void haptics.success();
    const gymName = "Iron Republic";
    // Same-tier scan (PREMIUM pass at a PREMIUM gym) → no top-up; enqueue writes
    // locally and the outbox syncs against the SyncCheckIn fixture in the
    // background. The success screen stamps the 450ms seal + share card.
    checkIn({
      gymCheckInCode: "gym_iron_republic",
      gymId: "gym_iron_republic",
      gymName,
      acceptedTopUp: false,
    });
    const day = (viewer.data?.viewer?.activePass?.daysUsed ?? 0) + 1;
    const streak = (viewer.data?.viewer?.streak.current ?? 0) + 1;
    navigation.navigate("CheckInSuccess", {
      gymName,
      dayNumber: day,
      streak,
      rank: "Operator",
      date: new Date().toISOString(),
    });
  }, [busy, checkIn, viewer.data, navigation]);

  return (
    <View style={styles.demoRoot} testID="scanner">
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topRow}>
          <IconButton
            icon={X}
            testID="scanner.close"
            accessibilityLabel="Close scanner"
            onPress={() => navigation.navigate("Home")}
          />
          <SosShield />
        </View>

        <View style={styles.frameWrap}>
          <View style={styles.demoFrame}>
            <QrCode size={64} color={colors.text.secondary} weight="thin" />
          </View>
          <Text testID="scanner.hint" preset="label" color="primary" style={styles.hint}>
            DEMO CHECK IN
          </Text>
          <Text preset="body" color="secondary" align="center" style={styles.sub}>
            No camera needed in the demo. Tap below to simulate scanning the door
            code and check in.
          </Text>
        </View>

        <View style={styles.demoFooter}>
          <Button
            testID="scanner.simulate"
            label="Simulate scan"
            onPress={onSimulate}
            loading={busy}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  demoRoot: { flex: 1, backgroundColor: colors.bg.base },
  demoFrame: {
    width: 240,
    height: 240,
    borderRadius: radius.sheet,
    borderWidth: 2,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
    alignItems: "center",
    justifyContent: "center",
  },
  demoFooter: { paddingBottom: spacing.lg },
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
