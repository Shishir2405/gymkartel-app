import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";

/**
 * Central navigation contract. Features export screen components; this file (and
 * the navigators) are the only place routes are registered — screens never
 * register themselves.
 */

/** Onboarding / auth stack. */
export type AuthStackParamList = {
  Splash: undefined;
  PhoneOtp: undefined;
  NamePhoto: undefined;
  HealthQuiz: undefined;
  PickTier: undefined;
  CityZone: undefined;
};

/** The five member tabs. Check-in is the raised center tab. */
export type MemberTabParamList = {
  Home: undefined;
  Gyms: undefined;
  CheckIn: undefined;
  Track: undefined;
  Club: undefined;
};

/** Member root stack: the tabs plus every pushed detail / modal screen. */
export type MemberStackParamList = {
  Tabs: undefined;

  // Home
  Notifications: undefined;
  TheCount: undefined;

  // Gyms
  GymDetail: { gymId: string };
  GymFilters: undefined;
  PassLadder: undefined;
  Payment: { pack: string } | { topUpForCheckIn: true; amountPaise: number };
  PurchaseSuccess: { pack: string };

  // Check-in
  CheckInSuccess: {
    gymName: string;
    dayNumber: number;
    streak: number;
    rank: string;
    date: string;
  };
  CardCustomiser: {
    gymName: string;
    dayNumber: number;
    streak: number;
    rank: string;
    date: string;
  };

  // Ledger / Track
  ExerciseHistory: undefined;
  ProgressCharts: undefined;
  ProgressPhotos: undefined;
  LogWorkout: undefined;

  // Coaches
  CoachBrowse: undefined;
  CoachFilters: undefined;
  CoachProfile: { coachId: string };
  CoachReviews: { coachId: string };
  PickSlot: { coachId: string };
  ReviewPay: { coachId: string; slotIso: string; gymId: string };
  BookingConfirmed: { bookingId: string };

  // Chat
  ChatInbox: undefined;
  ChatThread: { bookingId: string; peerName: string };
  LocationShare: { bookingId: string };

  // Club
  StreakCalendar: undefined;
  Leaderboards: undefined;
  TerritoryWars: undefined;
  CardGallery: undefined;
  Recruit: undefined;

  // Profile
  Profile: undefined;
  PassPayments: undefined;
  Invoices: undefined;
  SosContacts: undefined;
  Support: undefined;
  Settings: undefined;

  // System
  RankUp: { fromRank: string; toRank: string; isTopRank?: boolean };
};

/** Coach side (role-switched). */
export type CoachStackParamList = {
  CoachTabs: undefined;
  CoachClientDetail: { clientId: string };
  CoachProfileEditor: undefined;
  CoachIncidentReport: { bookingId: string };
  CoachChatThread: { bookingId: string; peerName: string };
};

export type CoachTabParamList = {
  CoachDashboard: undefined;
  CoachCalendar: undefined;
  CoachClients: undefined;
  CoachEarnings: undefined;
  CoachChat: undefined;
};

// ---- Typed screen prop helpers ---------------------------------------------

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MemberScreenProps<T extends keyof MemberStackParamList> =
  NativeStackScreenProps<MemberStackParamList, T>;

export type MemberTabScreenProps<T extends keyof MemberTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MemberTabParamList, T>,
    NativeStackScreenProps<MemberStackParamList>
  >;

export type CoachScreenProps<T extends keyof CoachStackParamList> =
  NativeStackScreenProps<CoachStackParamList, T>;

export type CoachTabScreenProps<T extends keyof CoachTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<CoachTabParamList, T>,
    NativeStackScreenProps<CoachStackParamList>
  >;
