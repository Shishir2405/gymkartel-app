import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { House, CalendarBlank, Users, Wallet, ChatCircle } from "phosphor-react-native";
import { colors, fontFamily } from "../../ui";
import type { CoachStackParamList, CoachTabParamList } from "./types";
import { stackScreenOptions } from "./navTheme";
import {
  CoachDashboardScreen,
  CoachCalendarScreen,
  CoachClientsScreen,
  CoachEarningsScreen,
  CoachChatScreen,
  CoachClientDetailScreen,
  CoachProfileEditorScreen,
  CoachChatThreadScreen,
  CoachIncidentReportScreen,
} from "../../features/coachside";

const Tab = createBottomTabNavigator<CoachTabParamList>();
const Stack = createNativeStackNavigator<CoachStackParamList>();

/** Coach bottom tabs — same design language, coach-specific surface. */
function CoachTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.bg.base,
          borderTopColor: colors.stroke.hairline,
        },
        tabBarLabelStyle: { fontFamily: fontFamily.sansSemiBold, fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="CoachDashboard"
        component={CoachDashboardScreen}
        options={{
          title: "Today",
          tabBarIcon: ({ color, focused }) => (
            <House size={22} color={color} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
      <Tab.Screen
        name="CoachCalendar"
        component={CoachCalendarScreen}
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, focused }) => (
            <CalendarBlank size={22} color={color} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
      <Tab.Screen
        name="CoachClients"
        component={CoachClientsScreen}
        options={{
          title: "Clients",
          tabBarIcon: ({ color, focused }) => (
            <Users size={22} color={color} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
      <Tab.Screen
        name="CoachEarnings"
        component={CoachEarningsScreen}
        options={{
          title: "Earnings",
          tabBarIcon: ({ color, focused }) => (
            <Wallet size={22} color={color} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
      <Tab.Screen
        name="CoachChat"
        component={CoachChatScreen}
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <ChatCircle size={22} color={color} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/** Coach root stack: tabs + pushed detail screens. */
export function CoachNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="CoachTabs" component={CoachTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CoachClientDetail" component={CoachClientDetailScreen} options={{ title: "Client" }} />
      <Stack.Screen name="CoachProfileEditor" component={CoachProfileEditorScreen} options={{ title: "Edit profile" }} />
      <Stack.Screen name="CoachChatThread" component={CoachChatThreadScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="CoachIncidentReport"
        component={CoachIncidentReportScreen}
        options={{ title: "Report incident", presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
