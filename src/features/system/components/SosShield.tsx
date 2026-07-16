import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ShieldWarning } from "phosphor-react-native";
import { colors } from "../../../ui";
import { useSos } from "./SosProvider";

export function SosShield() {
  const { open } = useSos();
  return (
    <Pressable
      onLongPress={open}
      delayLongPress={1000}
      accessibilityRole="button"
      accessibilityLabel="Hold for emergency options"
      hitSlop={12}
    >
      <View style={styles.shield}>
        <ShieldWarning size={22} color={colors.text.secondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shield: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
});
