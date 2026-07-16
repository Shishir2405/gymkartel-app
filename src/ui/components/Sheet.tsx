import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { colors, radius, spacing } from "../tokens";
import { Text } from "./Text";

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  serious?: boolean;
}

export function Sheet({ visible, onClose, title, children, serious = false }: SheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.anchor} pointerEvents="box-none">
        <Animated.View
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(220)}
          style={[styles.sheet, serious && styles.seriousSheet]}
        >
          <SafeAreaView edges={["bottom"]}>
            <View style={styles.grabber} />
            {title ? (
              <Text
                preset="title"
                style={[styles.title, serious && { color: colors.serious.text }]}
              >
                {title}
              </Text>
            ) : null}
            {children}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  anchor: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.surface.raised,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: 1,
    borderColor: colors.stroke.hairline,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
  },
  seriousSheet: {
    backgroundColor: colors.serious.surface,
    borderColor: colors.serious.stroke,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.stroke.hairline,
    marginBottom: spacing.md,
  },
  title: { marginBottom: spacing.md },
});
