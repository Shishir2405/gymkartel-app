import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { colors, radius, spacing } from "../tokens";
import { Text } from "./Text";

interface ToastState {
  id: number;
  message: string;
}

interface ToastApi {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastApi>({ show: () => {} });

/**
 * Minimal quiet toast ("Logged", "Saved"). No emojis, no exclamation marks.
 * Auto-dismisses. Only one at a time.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? (
        <Animated.View
          key={toast.id}
          entering={FadeInUp.duration(220)}
          exiting={FadeOutUp.duration(220)}
          style={styles.wrap}
          pointerEvents="none"
        >
          <View style={styles.toast}>
            <Text preset="bodyMedium">{toast.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});
