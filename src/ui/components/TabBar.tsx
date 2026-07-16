import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { House, MapPin, QrCode, ChartLineUp, Trophy } from "phosphor-react-native";
import { colors, radius, sizing, spacing } from "../tokens";
import { Text } from "./Text";
import type { PhosphorIcon } from "./Icon";
import { haptics } from "../../lib/haptics";

const TAB_ICON: Record<string, PhosphorIcon> = {
  Home: House,
  Gyms: MapPin,
  CheckIn: QrCode,
  Track: ChartLineUp,
  Club: Trophy,
};

const TAB_LABEL: Record<string, string> = {
  Home: "Home",
  Gyms: "Gyms",
  CheckIn: "Check in",
  Track: "Track",
  Club: "Club",
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const isCheckIn = route.name === "CheckIn";
          const Glyph = TAB_ICON[route.name] ?? House;

          const onPress = () => {
            void haptics.light();
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCheckIn) {
            return (
              <Pressable
                key={route.key}
                testID={`tab.${route.name}`}
                onPress={onPress}
                style={styles.centerSlot}
                accessibilityRole="button"
                accessibilityLabel="Check in"
              >
                <View style={styles.centerButton}>
                  <Glyph
                    size={30}
                    weight="fill"
                    color={colors.text.primary}
                  />
                </View>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              testID={`tab.${route.name}`}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={TAB_LABEL[route.name]}
            >
              <Glyph
                size={24}
                weight={focused ? "fill" : "regular"}
                color={focused ? colors.accent.primary : colors.text.secondary}
              />
              <Text
                preset="label"
                style={{
                  fontSize: 10,
                  marginTop: 3,
                  letterSpacing: 0.2,
                  color: focused ? colors.accent.primary : colors.text.secondary,
                }}
              >
                {TAB_LABEL[route.name]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bg.base,
    borderTopWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  bar: {
    height: sizing.tabBarHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: spacing.sm,
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },
  centerSlot: { flex: 1, alignItems: "center", justifyContent: "center" },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent.primary,
    borderWidth: 4,
    borderColor: colors.bg.base,
    ...Platform.select({
      ios: {
        shadowColor: colors.accent.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 14,
        shadowOpacity: 0.5,
      },
      android: { elevation: 8 },
    }),
  },
});
