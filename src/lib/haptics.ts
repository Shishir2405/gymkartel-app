import * as Haptics from "expo-haptics";

/**
 * Thin wrapper so haptic intent reads clearly at call sites and stays easy to
 * disable globally. Light on button press; heavy is reserved for the two polish
 * moments (check-in seal stamp, rank-up).
 */
export const haptics = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
