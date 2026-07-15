import React, { useRef, useState } from "react";
import { Share, StyleSheet, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import {
  Screen,
  Text,
  Button,
  SealStamp,
  colors,
  spacing,
} from "../../../ui";
import { ShareCard } from "../components/ShareCard";
import type { MemberScreenProps } from "../../../app/navigation/types";

/**
 * THE moment. Polish is spent here (one of only two places). The seal STAMPS in
 * over 450ms with one heavy haptic, then the record — gym, DAY count, streak,
 * rank, date — settles beneath it. The share card exports at 1080x1920 for
 * stories. Primary action (Share) is the single orange button; Customise / Done
 * are ghosts.
 */
export function CheckInSuccessScreen({ navigation, route }: MemberScreenProps<"CheckInSuccess">) {
  const { gymName, dayNumber, streak, rank, date } = route.params;
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<View>(null);

  const onShare = async () => {
    try {
      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 1,
        width: 1080,
        height: 1920,
      });
      await Share.share({ url: uri, message: `Day ${dayNumber} at ${gymName}. The record stands.` });
    } catch {
      // Sharing cancelled or unavailable — stay on screen, no error theatre.
    }
  };

  return (
    <Screen
      testID="check-in-success"
      footer={
        <View>
          <Button testID="check-in-success.share" label="Share" onPress={onShare} />
          <View style={styles.ghostRow}>
            <Button
              testID="check-in-success.customise"
              label="Customise"
              variant="ghost"
              fullWidth={false}
              onPress={() =>
                navigation.navigate("CardCustomiser", { gymName, dayNumber, streak, rank, date })
              }
            />
            <Button
              testID="check-in-success.done"
              label="Done"
              variant="ghost"
              fullWidth={false}
              onPress={() => navigation.navigate("Tabs")}
            />
          </View>
        </View>
      }
    >
      <View style={styles.sealArea}>
        <SealStamp label={gymName} onStamped={() => setRevealed(true)} />
      </View>

      <View
        testID="check-in-success.record"
        style={[styles.record, revealed ? styles.recordVisible : styles.recordHidden]}
      >
        <Text preset="displayLarge" align="center">
          DAY {dayNumber}
        </Text>
        <Text preset="body" color="secondary" align="center" style={styles.line}>
          {gymName}
        </Text>
        <View style={styles.stats}>
          <Stat label="STREAK" value={`${streak}`} />
          <Stat label="RANK" value={rank} />
        </View>
      </View>

      {/* Off-screen render target for the 1080x1920 export. */}
      <View style={styles.offscreen} pointerEvents="none">
        <View collapsable={false} ref={cardRef}>
          <ShareCard
            template="classic"
            gymName={gymName}
            dayNumber={dayNumber}
            streak={streak}
            rank={rank}
            date={date}
          />
        </View>
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text preset="displayMedium">{value}</Text>
      <Text preset="label" color="secondary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sealArea: { alignItems: "center", marginTop: spacing.xxl, marginBottom: spacing.xl },
  ghostRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
    marginTop: spacing.xs,
  },
  record: { alignItems: "center" },
  recordVisible: { opacity: 1 },
  recordHidden: { opacity: 0 },
  line: { marginTop: spacing.xs },
  stats: { flexDirection: "row", gap: spacing.xxxl, marginTop: spacing.xl },
  stat: { alignItems: "center" },
  offscreen: { position: "absolute", left: -2000, top: 0 },
});
