import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MemberStackParamList } from "./types";
import { stackScreenOptions } from "./navTheme";
import { MemberTabs } from "./MemberTabs";
import { useOutboxSync } from "../../features/checkin";

// Home
import { NotificationsScreen, TheCountScreen } from "../../features/home";
// Check-in
import { CheckInSuccessScreen, CardCustomiserScreen } from "../../features/checkin";
// Gyms
import {
  GymDetailScreen,
  GymFiltersScreen,
  PassLadderScreen,
  PaymentScreen,
  PurchaseSuccessScreen,
} from "../../features/gyms";
// Ledger
import {
  LogWorkoutScreen,
  ExerciseHistoryScreen,
  ProgressChartsScreen,
  ProgressPhotosScreen,
} from "../../features/ledger";
// Coaches
import {
  CoachBrowseScreen,
  CoachFiltersScreen,
  CoachProfileScreen,
  CoachReviewsScreen,
  PickSlotScreen,
  ReviewPayScreen,
  BookingConfirmedScreen,
} from "../../features/coaches";
// Chat
import { ChatInboxScreen, ChatThreadScreen, LocationShareScreen } from "../../features/chat";
// Club
import {
  StreakCalendarScreen,
  LeaderboardsScreen,
  TerritoryWarsScreen,
  CardGalleryScreen,
  RecruitScreen,
} from "../../features/club";
// Profile
import {
  ProfileScreen,
  PassPaymentsScreen,
  InvoicesScreen,
  SosContactsScreen,
  SupportScreen,
  SettingsScreen,
} from "../../features/profile";
// System
import { RankUpScreen } from "../../features/system";

const Stack = createNativeStackNavigator<MemberStackParamList>();

/**
 * The member root stack. The tabs are one route; every detail / modal screen is
 * pushed on top so cross-tab navigation (Home -> Gym detail) just works.
 * Features export screens; this is the ONLY place member routes are registered.
 */
export function MemberNavigator() {
  // Drive the offline check-in outbox from the top of the member tree.
  useOutboxSync();

  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Tabs" component={MemberTabs} options={{ headerShown: false }} />

      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Intel" }} />
      <Stack.Screen name="TheCount" component={TheCountScreen} options={{ title: "The Count" }} />

      <Stack.Screen
        name="CheckInSuccess"
        component={CheckInSuccessScreen}
        options={{ headerShown: false, animation: "fade", gestureEnabled: false }}
      />
      <Stack.Screen name="CardCustomiser" component={CardCustomiserScreen} options={{ title: "Customise" }} />

      <Stack.Screen name="GymDetail" component={GymDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="GymFilters"
        component={GymFiltersScreen}
        options={{ title: "Filters", presentation: "modal" }}
      />
      <Stack.Screen name="PassLadder" component={PassLadderScreen} options={{ title: "Passes" }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: "Payment" }} />
      <Stack.Screen
        name="PurchaseSuccess"
        component={PurchaseSuccessScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen name="LogWorkout" component={LogWorkoutScreen} options={{ title: "Log" }} />
      <Stack.Screen name="ExerciseHistory" component={ExerciseHistoryScreen} options={{ title: "History" }} />
      <Stack.Screen name="ProgressCharts" component={ProgressChartsScreen} options={{ title: "Progress" }} />
      <Stack.Screen name="ProgressPhotos" component={ProgressPhotosScreen} options={{ title: "Photos" }} />

      <Stack.Screen name="CoachBrowse" component={CoachBrowseScreen} options={{ title: "Coaches" }} />
      <Stack.Screen
        name="CoachFilters"
        component={CoachFiltersScreen}
        options={{ title: "Filters", presentation: "modal" }}
      />
      <Stack.Screen name="CoachProfile" component={CoachProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CoachReviews" component={CoachReviewsScreen} options={{ title: "Reviews" }} />
      <Stack.Screen name="PickSlot" component={PickSlotScreen} options={{ title: "Pick a slot" }} />
      <Stack.Screen name="ReviewPay" component={ReviewPayScreen} options={{ title: "Review" }} />
      <Stack.Screen
        name="BookingConfirmed"
        component={BookingConfirmedScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen name="ChatInbox" component={ChatInboxScreen} options={{ title: "Messages" }} />
      <Stack.Screen name="ChatThread" component={ChatThreadScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="LocationShare"
        component={LocationShareScreen}
        options={{ title: "Share location", presentation: "modal" }}
      />

      <Stack.Screen name="StreakCalendar" component={StreakCalendarScreen} options={{ title: "Streak" }} />
      <Stack.Screen name="Leaderboards" component={LeaderboardsScreen} options={{ title: "Leaderboards" }} />
      <Stack.Screen name="TerritoryWars" component={TerritoryWarsScreen} options={{ title: "Territory" }} />
      <Stack.Screen name="CardGallery" component={CardGalleryScreen} options={{ title: "Cards" }} />
      <Stack.Screen name="Recruit" component={RecruitScreen} options={{ title: "Recruit" }} />

      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
      <Stack.Screen name="PassPayments" component={PassPaymentsScreen} options={{ title: "Pass & payments" }} />
      <Stack.Screen name="Invoices" component={InvoicesScreen} options={{ title: "Invoices" }} />
      <Stack.Screen name="SosContacts" component={SosContactsScreen} options={{ title: "Safety" }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: "Support" }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />

      <Stack.Screen
        name="RankUp"
        component={RankUpScreen}
        options={{ headerShown: false, animation: "fade", gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
