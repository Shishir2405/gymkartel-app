import { DarkTheme, type Theme } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { colors, fontFamily } from "../../ui";

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg.base,
    card: colors.bg.base,
    text: colors.text.primary,
    border: colors.stroke.hairline,
    primary: colors.accent.primary,
    notification: colors.accent.primary,
  },
};

export const stackScreenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: colors.bg.base },
  headerTintColor: colors.text.primary,
  headerTitleStyle: { fontFamily: fontFamily.sansSemiBold, fontSize: 17 },
  headerShadowVisible: false,
  headerBackButtonDisplayMode: "minimal",
  contentStyle: { backgroundColor: colors.bg.base },
  animation: "slide_from_right",
  animationDuration: 300,
};
