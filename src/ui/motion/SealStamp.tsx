import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors, radius } from "../tokens";
import { Text } from "../components/Text";
import { haptics } from "../../lib/haptics";
import { motion } from "../tokens";

export interface SealStampProps {
  /** Gym name stamped into the seal. */
  label: string;
  /** Fires once the stamp lands (for chaining share-card reveal). */
  onStamped?: () => void;
  size?: number;
}

/**
 * THE signature animation. The check-in seal STAMPS in over 450ms — it starts
 * oversized and rotated, slams down to rest scale, and fires one HEAVY haptic on
 * impact. This is one of only two moments the app spends polish on. Reanimated 3.
 */
export function SealStamp({ label, onStamped, size = 180 }: SealStampProps) {
  const scale = useSharedValue(2.4);
  const rotate = useSharedValue(-18);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 120 });
    rotate.value = withTiming(-8, { duration: motion.sealStamp, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(
      withTiming(0.94, {
        duration: motion.sealStamp,
        easing: Easing.bezier(0.2, 1.2, 0.3, 1),
      }),
      withTiming(1, { duration: 120 }, (finished) => {
        if (finished) {
          runOnJS(fireImpact)();
          if (onStamped) runOnJS(onStamped)();
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.seal, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <View style={styles.inner}>
        <Text preset="label" color="onAccent" align="center">
          CHECKED IN
        </Text>
        <Text preset="title" color="onAccent" align="center" style={styles.gym} numberOfLines={2}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}

function fireImpact() {
  void haptics.heavy();
}

const styles = StyleSheet.create({
  seal: {
    borderWidth: 3,
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    borderWidth: 1.5,
    borderColor: "rgba(245,240,235,0.5)",
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "80%",
  },
  gym: { marginTop: 6 },
});
