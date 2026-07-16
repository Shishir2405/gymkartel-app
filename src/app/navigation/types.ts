import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";

export type AuthStackParamList = {
  Splash: undefined;
  PhoneOtp: undefined;
  NamePhoto: undefined;
  HealthQuiz: undefined;
  PickTier: undefined;
  CityZone: undefined;
};

export type MemberTabParamList = {
  Home: undefined;
  Gyms: undefined;
  CheckIn: undefined;
  Track: undefined;
  Club: undefined;
};

export type MemberStackParamList = {
  Tabs: undefined;

  Notifications: undefined;
  TheCount: undefined;

  GymDetail: { gymId: string };
  GymFilters: undefined;
  PassLadder: undefined;
  Payment: { pack: string } | { topUpForCheckIn: true; amountPaise: number };
  PurchaseSuccess: { pack: string };

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

  ExerciseHistory: undefined;
  ProgressCharts: undefined;
  ProgressPhotos: undefined;
  LogWorkout: undefined;

  CoachBrowse: undefined;
  CoachFilters: undefined;
  CoachProfile: { coachId: string };
  CoachReviews: { coachId: string };
  PickSlot: { coachId: string };
  ReviewPay: { coachId: string; slotIso: string; gymId: string };
  BookingConfirmed: { bookingId: string };

  ChatInbox: undefined;
  ChatThread: { bookingId: string; peerName: string };
  LocationShare: { bookingId: string };

  StreakCalendar: undefined;
  Leaderboards: undefined;
  TerritoryWars: undefined;
  CardGallery: undefined;
  Recruit: undefined;

  Profile: undefined;
  PassPayments: undefined;
  Invoices: undefined;
  SosContacts: undefined;
  Support: undefined;
  Settings: undefined;

  RankUp: { fromRank: string; toRank: string; isTopRank?: boolean };
};

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
