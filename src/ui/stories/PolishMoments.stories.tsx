import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import type { Meta, StoryObj } from "../../../.storybook/types";
import { colors, spacing } from "../tokens";
import { SealStamp } from "../motion/SealStamp";
import { RankUpTakeover } from "../motion/RankUpTakeover";
import { Button } from "../components/Button";
import { Text } from "../components/Text";

/**
 * The two — and only two — moments the app spends motion polish on:
 *  1. The check-in seal stamp (450ms + one heavy haptic).
 *  2. The rank-up cinematic takeover.
 * Everything else stays quiet.
 */
function SealStampStory() {
  const [key, setKey] = useState(0);
  return (
    <View style={styles.center}>
      <View style={styles.stage}>
        <SealStamp key={key} label="Iron House, Indiranagar" />
      </View>
      <Button label="Replay stamp" variant="secondary" fullWidth={false} onPress={() => setKey((k) => k + 1)} />
      <Text preset="label" color="secondary" style={{ marginTop: spacing.md }}>
        450MS · ONE HEAVY HAPTIC
      </Text>
    </View>
  );
}

function RankUpStory() {
  const [visible, setVisible] = useState(true);
  return (
    <View style={styles.center}>
      {visible ? (
        <RankUpTakeover fromRank="Scout" toRank="Operator" onDone={() => setVisible(false)} />
      ) : (
        <Button label="Show rank-up" variant="secondary" fullWidth={false} onPress={() => setVisible(true)} />
      )}
    </View>
  );
}

const meta: Meta = {
  title: "Design System/Polish Moments",
  component: SealStampStory,
};
export default meta;

export const CheckInSealStamp: StoryObj = {
  name: "Check-in seal stamp",
  render: () => <SealStampStory />,
};

export const RankUp: StoryObj = {
  name: "Rank-up takeover",
  render: () => <RankUpStory />,
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg.base },
  stage: { height: 240, alignItems: "center", justifyContent: "center", marginBottom: spacing.xl },
});
