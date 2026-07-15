import React, { useEffect } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { colors, radius } from "../tokens";

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

/**
 * Shimmer loader. The app uses skeletons, NEVER spinners, for content loading.
 * Quiet 1200ms opacity pulse — no flashy motion.
 */
export function Skeleton({ width = "100%", height = 16, radius: r = radius.sm, style }: SkeletonProps) {
  const progress = useSharedValue(0.4);
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(0.9, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Animated.View
      style={[
        { width: width as ViewStyle["width"], height, borderRadius: r, backgroundColor: colors.surface.raised },
        animatedStyle,
        style,
      ]}
    />
  );
}

/** Convenience full-card skeleton block. */
export function SkeletonCard({ height = 120 }: { height?: number }) {
  return (
    <View style={styles.card}>
      <Skeleton height={height} radius={radius.card} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
});
