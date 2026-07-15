import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { colors, spacing } from "../tokens";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { haptics } from "../../lib/haptics";

export interface RankUpTakeoverProps {
  fromRank: string;
  toRank: string;
  onDone: () => void;
  /** Gold treatment only when reaching the very top rank. */
  isTopRank?: boolean;
}

/**
 * The rank-up cinematic takeover — full-screen, screenshot-built, the second
 * (and last) place the app spends polish. A quiet fade, the new rank scales up
 * with one heavy haptic, then a single primary action.
 */
export function RankUpTakeover({ fromRank, toRank, onDone, isTopRank = false }: RankUpTakeoverProps) {
  const scale = useSharedValue(0.6);
  const glow = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      260,
      withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }, (f) => {
        if (f) runOnJS(fire)();
      }),
    );
    glow.value = withDelay(260, withTiming(1, { duration: 700 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rankStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: glow.value,
  }));

  const accent = isTopRank ? colors.accent.gold : colors.accent.primary;

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.wrap}>
      <View style={styles.center}>
        <Text preset="label" color="secondary">
          RANK UP
        </Text>
        <Text preset="body" color="secondary" style={styles.from}>
          {fromRank}
        </Text>
        <Animated.View style={rankStyle}>
          <Text preset="displayLarge" style={{ color: accent }} align="center">
            {toRank.toUpperCase()}
          </Text>
        </Animated.View>
        <Text preset="body" color="secondary" align="center" style={styles.caption}>
          The record stands. Keep the count.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button label="Continue" onPress={onDone} />
      </View>
    </Animated.View>
  );
}

function fire() {
  void haptics.heavy();
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg.base,
    paddingHorizontal: spacing.screen,
    justifyContent: "space-between",
    paddingTop: 140,
    paddingBottom: 48,
  },
  center: { alignItems: "center", gap: spacing.md },
  from: { textDecorationLine: "line-through" },
  caption: { marginTop: spacing.lg, maxWidth: 280 },
  footer: {},
});
