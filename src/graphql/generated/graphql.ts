import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type AppNotification = {
  __typename?: 'AppNotification';
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  kind: NotificationKind;
  read: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type AuthTokens = {
  __typename?: 'AuthTokens';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Booking = {
  __typename?: 'Booking';
  chatUnlocked: Scalars['Boolean']['output'];
  coach: Coach;
  gym: Gym;
  id: Scalars['ID']['output'];
  insured: Scalars['Boolean']['output'];
  pricePaise: Scalars['Int']['output'];
  scheduledFor: Scalars['DateTime']['output'];
  status: BookingStatus;
};

export enum BookingStatus {
  CancelledByCoach = 'CANCELLED_BY_COACH',
  CancelledByMember = 'CANCELLED_BY_MEMBER',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  PendingPayment = 'PENDING_PAYMENT'
}

export enum CertificationStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Verified = 'VERIFIED'
}

export type ChatMessage = {
  __typename?: 'ChatMessage';
  bookingId: Scalars['ID']['output'];
  from: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  masked: Scalars['Boolean']['output'];
  sentAt: Scalars['DateTime']['output'];
  text: Scalars['String']['output'];
};

export type ChatThread = {
  __typename?: 'ChatThread';
  bookingId: Scalars['ID']['output'];
  chatUnlocked: Scalars['Boolean']['output'];
  coach: Coach;
  gym: Gym;
  lastMessage: Maybe<ChatMessage>;
};

export type CheckIn = {
  __typename?: 'CheckIn';
  dayNumber: Scalars['Int']['output'];
  gym: Gym;
  gymTier: Tier;
  id: Scalars['ID']['output'];
  passTier: Tier;
  scannedAt: Scalars['DateTime']['output'];
  topUpAmountPaise: Maybe<Scalars['Int']['output']>;
};

export type Coach = {
  __typename?: 'Coach';
  badge: Maybe<Scalars['String']['output']>;
  bio: Scalars['String']['output'];
  certifications: Array<CoachCertification>;
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pricePerSessionPaise: Scalars['Int']['output'];
  ratingAverage: Maybe<Scalars['Float']['output']>;
  sessionsCompleted: Scalars['Int']['output'];
  specialties: Array<Scalars['String']['output']>;
  tierFloor: Maybe<Tier>;
  transformationPhotoUrls: Array<Scalars['String']['output']>;
  verified: Scalars['Boolean']['output'];
};

export type CoachCertification = {
  __typename?: 'CoachCertification';
  issuer: Scalars['String']['output'];
  status: CertificationStatus;
  title: Scalars['String']['output'];
};

export type CoachClient = {
  __typename?: 'CoachClient';
  avatarUrl: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sessions: Scalars['Int']['output'];
};

export type CoachDashboard = {
  __typename?: 'CoachDashboard';
  earningsPaise: Scalars['Int']['output'];
  pendingRequests: Array<Booking>;
  ratingAverage: Maybe<Scalars['Float']['output']>;
  sessionsCompleted: Scalars['Int']['output'];
  todaysSessions: Array<Booking>;
};

export type CoachEarnings = {
  __typename?: 'CoachEarnings';
  estimatedTdsPaise: Scalars['Int']['output'];
  grossPaise: Scalars['Int']['output'];
  payoutSchedule: Scalars['String']['output'];
  takeHomePaise: Scalars['Int']['output'];
};

export type CreateBookingOrderInput = {
  coachId: Scalars['ID']['input'];
  gymId: Scalars['ID']['input'];
  scheduledFor: Scalars['DateTime']['input'];
};

export type CreatePassOrderInput = {
  pack: PassPack;
};

export type CreateTopUpOrderInput = {
  gymCheckInCode?: InputMaybe<Scalars['String']['input']>;
  gymId?: InputMaybe<Scalars['ID']['input']>;
  idempotencyKey: Scalars['String']['input'];
};

export type FeatureFlag = {
  __typename?: 'FeatureFlag';
  enabled: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
};

export type GeoPoint = {
  __typename?: 'GeoPoint';
  lat: Scalars['Float']['output'];
  lng: Scalars['Float']['output'];
};

export type GeoPointInput = {
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
};

export type Gym = {
  __typename?: 'Gym';
  address: Scalars['String']['output'];
  amenities: Array<Scalars['String']['output']>;
  distanceMeters: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  liveBusyFraction: Maybe<Scalars['Float']['output']>;
  location: Maybe<GeoPoint>;
  name: Scalars['String']['output'];
  photoUrls: Array<Scalars['String']['output']>;
  rating: Maybe<Scalars['Float']['output']>;
  tier: Tier;
  zone: Scalars['String']['output'];
};

export type Incident = {
  __typename?: 'Incident';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  kind: SosKind;
  location: Maybe<GeoPoint>;
  note: Scalars['String']['output'];
  status: IncidentStatus;
};

export enum IncidentStatus {
  Escalated = 'ESCALATED',
  Open = 'OPEN',
  Resolved = 'RESOLVED'
}

export type Leaderboard = {
  __typename?: 'Leaderboard';
  page: Array<LeaderboardEntry>;
  scopeKey: Scalars['String']['output'];
  season: Scalars['String']['output'];
  segment: LeaderboardSegment;
  self: Maybe<LeaderboardEntry>;
};

export type LeaderboardEntry = {
  __typename?: 'LeaderboardEntry';
  displayName: Scalars['String']['output'];
  isSelf: Scalars['Boolean']['output'];
  position: Scalars['Int']['output'];
  streak: Scalars['Int']['output'];
  totalCheckIns: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
};

export enum LeaderboardSegment {
  India = 'INDIA',
  State = 'STATE',
  Zone = 'ZONE'
}

export type LedgerEntry = {
  __typename?: 'LedgerEntry';
  chip: WorkoutChip;
  id: Scalars['ID']['output'];
  isPR: Scalars['Boolean']['output'];
  loggedAt: Scalars['DateTime']['output'];
  loggedByCoach: Scalars['Boolean']['output'];
};

export type LocationShare = {
  __typename?: 'LocationShare';
  expiresAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBookingOrder: RazorpayOrder;
  createPassOrder: RazorpayOrder;
  createTopUpOrder: RazorpayOrder;
  logWorkout: Array<LedgerEntry>;
  markNotificationRead: Scalars['Boolean']['output'];
  refreshSession: AuthTokens;
  registerPushToken: Scalars['Boolean']['output'];
  requestOtp: Scalars['Boolean']['output'];
  sendMessage: ChatMessage;
  setTrustedContact: Scalars['Boolean']['output'];
  shareLocation: LocationShare;
  syncCheckIn: SyncCheckInResult;
  triggerSos: Incident;
  verifyOtp: AuthTokens;
};

export type MutationCreateBookingOrderArgs = {
  input: CreateBookingOrderInput;
};

export type MutationCreatePassOrderArgs = {
  input: CreatePassOrderInput;
};

export type MutationCreateTopUpOrderArgs = {
  input: CreateTopUpOrderInput;
};

export type MutationLogWorkoutArgs = {
  text: Scalars['String']['input'];
};

export type MutationMarkNotificationReadArgs = {
  id: Scalars['ID']['input'];
};

export type MutationRefreshSessionArgs = {
  refreshToken: Scalars['String']['input'];
};

export type MutationRegisterPushTokenArgs = {
  token: Scalars['String']['input'];
};

export type MutationRequestOtpArgs = {
  input: RequestOtpInput;
};

export type MutationSendMessageArgs = {
  bookingId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};

export type MutationSetTrustedContactArgs = {
  input: SetTrustedContactInput;
};

export type MutationShareLocationArgs = {
  bookingId: Scalars['ID']['input'];
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
};

export type MutationSyncCheckInArgs = {
  input: SyncCheckInInput;
};

export type MutationTriggerSosArgs = {
  input: TriggerSosInput;
};

export type MutationVerifyOtpArgs = {
  input: VerifyOtpInput;
};

export enum NotificationKind {
  Booking = 'BOOKING',
  General = 'GENERAL',
  Pass = 'PASS',
  Safety = 'SAFETY',
  Streak = 'STREAK'
}

export type Pass = {
  __typename?: 'Pass';
  bonusDays: Scalars['Int']['output'];
  daysLeft: Scalars['Int']['output'];
  daysTotal: Scalars['Int']['output'];
  daysUsed: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  pack: PassPack;
  status: PassStatus;
  tier: Tier;
  validUntil: Scalars['DateTime']['output'];
};

export type PassLadderRow = {
  __typename?: 'PassLadderRow';
  badge: Maybe<Scalars['String']['output']>;
  days: Scalars['Int']['output'];
  emphasized: Scalars['Boolean']['output'];
  pack: PassPack;
  perDayPaise: Scalars['Int']['output'];
  pricePaise: Scalars['Int']['output'];
  rankMultiplier: Maybe<Scalars['Int']['output']>;
};

export enum PassPack {
  FifteenDay = 'FIFTEEN_DAY',
  SevenDay = 'SEVEN_DAY',
  SingleDay = 'SINGLE_DAY',
  ThirtyDay = 'THIRTY_DAY'
}

export enum PassStatus {
  Active = 'ACTIVE',
  Exhausted = 'EXHAUSTED',
  Expired = 'EXPIRED'
}

export type Query = {
  __typename?: 'Query';
  bookings: Array<Booking>;
  chatInbox: Array<ChatThread>;
  chatThread: Array<ChatMessage>;
  checkInHistory: Array<CheckIn>;
  coach: Maybe<Coach>;
  coachCalendar: Array<Booking>;
  coachClient: Maybe<CoachClient>;
  coachClients: Array<CoachClient>;
  coachDashboard: CoachDashboard;
  coachEarnings: CoachEarnings;
  coachProfile: Coach;
  coaches: Array<Coach>;
  featureFlags: Array<FeatureFlag>;
  gym: Maybe<Gym>;
  gyms: Array<Gym>;
  incidents: Array<Incident>;
  leaderboard: Leaderboard;
  ledgerHistory: Array<LedgerEntry>;
  ledgerToday: Array<LedgerEntry>;
  notifications: Array<AppNotification>;
  passLadder: Array<PassLadderRow>;
  rankCard: RankCard;
  streakCalendar: StreakCalendar;
  trustedContact: Maybe<TrustedContact>;
  versionGate: VersionGate;
  viewer: Maybe<Viewer>;
};

export type QueryChatThreadArgs = {
  bookingId: Scalars['ID']['input'];
};

export type QueryCheckInHistoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryCoachArgs = {
  id: Scalars['ID']['input'];
};

export type QueryCoachClientArgs = {
  id: Scalars['ID']['input'];
};

export type QueryCoachesArgs = {
  femaleOnly?: InputMaybe<Scalars['Boolean']['input']>;
  maxPricePaise?: InputMaybe<Scalars['Int']['input']>;
  specialty?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGymArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGymsArgs = {
  peekOtherTiers?: InputMaybe<Scalars['Boolean']['input']>;
  zone?: InputMaybe<Scalars['String']['input']>;
};

export type QueryLeaderboardArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  scopeKey?: InputMaybe<Scalars['String']['input']>;
  segment: LeaderboardSegment;
};

export type QueryLedgerHistoryArgs = {
  exercise?: InputMaybe<Scalars['String']['input']>;
};

export type RankCard = {
  __typename?: 'RankCard';
  current: Scalars['String']['output'];
  label: Scalars['String']['output'];
  next: Maybe<Scalars['String']['output']>;
  streakWeeks: Scalars['Int']['output'];
  thresholds: Array<RankThreshold>;
  weeksToNext: Maybe<Scalars['Int']['output']>;
};

export type RankThreshold = {
  __typename?: 'RankThreshold';
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  minWeeks: Scalars['Int']['output'];
};

export type RazorpayOrder = {
  __typename?: 'RazorpayOrder';
  amountPaise: Scalars['Int']['output'];
  currency: Scalars['String']['output'];
  orderId: Scalars['String']['output'];
};

export type RequestOtpInput = {
  phone: Scalars['String']['input'];
};

export type SetTrustedContactInput = {
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export enum SosKind {
  AlertTrustedContact = 'ALERT_TRUSTED_CONTACT',
  CallEmergency = 'CALL_EMERGENCY',
  ReportIncident = 'REPORT_INCIDENT'
}

export type Streak = {
  __typename?: 'Streak';
  bonusDaysEarned: Scalars['Int']['output'];
  current: Scalars['Int']['output'];
  windowDaysLeft: Scalars['Int']['output'];
};

export type StreakCalendar = {
  __typename?: 'StreakCalendar';
  alive: Scalars['Boolean']['output'];
  bonusDaysEarned: Scalars['Int']['output'];
  days: Array<Scalars['DateTime']['output']>;
  daysThisWindow: Scalars['Int']['output'];
  weeks: Scalars['Int']['output'];
  windowDaysLeft: Scalars['Int']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageReceived: ChatMessage;
};

export type SubscriptionMessageReceivedArgs = {
  bookingId: Scalars['ID']['input'];
};

export type SyncCheckInInput = {
  acceptedTopUp?: InputMaybe<Scalars['Boolean']['input']>;
  gymCheckInCode: Scalars['String']['input'];
  idempotencyKey: Scalars['String']['input'];
  scannedAt: Scalars['DateTime']['input'];
};

export type SyncCheckInResult = {
  __typename?: 'SyncCheckInResult';
  checkIn: Maybe<CheckIn>;
  topUpRequired: Maybe<TopUpRequired>;
};

export enum Tier {
  Basic = 'BASIC',
  Premium = 'PREMIUM',
  Standard = 'STANDARD'
}

export type TopUpRequired = {
  __typename?: 'TopUpRequired';
  amountPaise: Scalars['Int']['output'];
  gymTier: Tier;
  razorpayOrderId: Scalars['String']['output'];
};

export type TriggerSosInput = {
  kind: SosKind;
  location?: InputMaybe<GeoPointInput>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type TrustedContact = {
  __typename?: 'TrustedContact';
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export enum UserRole {
  Coach = 'COACH',
  Member = 'MEMBER'
}

export type VerifyOtpInput = {
  code: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type VersionGate = {
  __typename?: 'VersionGate';
  latestVersion: Scalars['String']['output'];
  minSupportedVersion: Scalars['String']['output'];
};

export type Viewer = {
  __typename?: 'Viewer';
  activePass: Maybe<Pass>;
  avatarUrl: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
  streak: Streak;
  tier: Tier;
  zone: Scalars['String']['output'];
};

export type WorkoutChip = {
  __typename?: 'WorkoutChip';
  distanceKm: Maybe<Scalars['Float']['output']>;
  durationMin: Maybe<Scalars['Float']['output']>;
  exercise: Maybe<Scalars['String']['output']>;
  kind: WorkoutKind;
  note: Maybe<Scalars['String']['output']>;
  raw: Scalars['String']['output'];
  reps: Maybe<Scalars['Int']['output']>;
  sets: Maybe<Scalars['Int']['output']>;
  uncertain: Scalars['Boolean']['output'];
  weightKg: Maybe<Scalars['Float']['output']>;
};

export enum WorkoutKind {
  Cardio = 'CARDIO',
  Strength = 'STRENGTH',
  Unknown = 'UNKNOWN'
}

export type BookingRowFragment = { __typename?: 'Booking', id: string, scheduledFor: string, pricePaise: number, status: BookingStatus, insured: boolean, chatUnlocked: boolean, coach: { __typename?: 'Coach', id: string, displayName: string, verified: boolean, badge: string | null }, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } };

export type BookingsQueryVariables = Exact<{ [key: string]: never; }>;

export type BookingsQuery = { __typename?: 'Query', bookings: Array<{ __typename?: 'Booking', id: string, scheduledFor: string, pricePaise: number, status: BookingStatus, insured: boolean, chatUnlocked: boolean, coach: { __typename?: 'Coach', id: string, displayName: string, verified: boolean, badge: string | null }, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } }> };

export type ChatMessageRowFragment = { __typename?: 'ChatMessage', id: string, bookingId: string, from: string, text: string, masked: boolean, sentAt: string };

export type ChatThreadRowFragment = { __typename?: 'ChatThread', bookingId: string, chatUnlocked: boolean, coach: { __typename?: 'Coach', id: string, displayName: string, verified: boolean, badge: string | null }, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier }, lastMessage: { __typename?: 'ChatMessage', id: string, bookingId: string, from: string, text: string, masked: boolean, sentAt: string } | null };

export type ChatInboxQueryVariables = Exact<{ [key: string]: never; }>;

export type ChatInboxQuery = { __typename?: 'Query', chatInbox: Array<{ __typename?: 'ChatThread', bookingId: string, chatUnlocked: boolean, coach: { __typename?: 'Coach', id: string, displayName: string, verified: boolean, badge: string | null }, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier }, lastMessage: { __typename?: 'ChatMessage', id: string, bookingId: string, from: string, text: string, masked: boolean, sentAt: string } | null }> };

export type ChatThreadQueryVariables = Exact<{
  bookingId: Scalars['ID']['input'];
}>;

export type ChatThreadQuery = { __typename?: 'Query', chatThread: Array<{ __typename?: 'ChatMessage', id: string, bookingId: string, from: string, text: string, masked: boolean, sentAt: string }> };

export type SendMessageMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
}>;

export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'ChatMessage', id: string, bookingId: string, from: string, text: string, masked: boolean, sentAt: string } };

export type ShareLocationMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
}>;

export type ShareLocationMutation = { __typename?: 'Mutation', shareLocation: { __typename?: 'LocationShare', expiresAt: string } };

export type MessageReceivedSubscriptionVariables = Exact<{
  bookingId: Scalars['ID']['input'];
}>;

export type MessageReceivedSubscription = { __typename?: 'Subscription', messageReceived: { __typename?: 'ChatMessage', id: string, bookingId: string, from: string, text: string, masked: boolean, sentAt: string } };

export type CheckInRowFragment = { __typename?: 'CheckIn', id: string, gymTier: Tier, passTier: Tier, scannedAt: string, dayNumber: number, topUpAmountPaise: number | null, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } };

export type CheckInHistoryQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type CheckInHistoryQuery = { __typename?: 'Query', checkInHistory: Array<{ __typename?: 'CheckIn', id: string, gymTier: Tier, passTier: Tier, scannedAt: string, dayNumber: number, topUpAmountPaise: number | null, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } }> };

export type CoachSessionRowFragment = { __typename?: 'Booking', id: string, scheduledFor: string, pricePaise: number, status: BookingStatus, insured: boolean, chatUnlocked: boolean, coach: { __typename?: 'Coach', id: string, displayName: string }, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } };

export type CoachClientRowFragment = { __typename?: 'CoachClient', id: string, name: string, avatarUrl: string | null, sessions: number };

export type CoachProfilePartsFragment = { __typename?: 'Coach', id: string, displayName: string, verified: boolean, badge: string | null, bio: string, specialties: Array<string>, pricePerSessionPaise: number, ratingAverage: number | null, sessionsCompleted: number, tierFloor: Tier | null, certifications: Array<{ __typename?: 'CoachCertification', title: string, issuer: string, status: CertificationStatus }> };

export type CoachDashboardQueryVariables = Exact<{ [key: string]: never; }>;

export type CoachDashboardQuery = { __typename?: 'Query', coachDashboard: { __typename?: 'CoachDashboard', ratingAverage: number | null, sessionsCompleted: number, earningsPaise: number, todaysSessions: Array<{ __typename?: 'Booking', id: string, scheduledFor: string, pricePaise: number, status: BookingStatus, insured: boolean, chatUnlocked: boolean, coach: { __typename?: 'Coach', id: string, displayName: string }, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } }>, pendingRequests: Array<{ __typename?: 'Booking', id: string, scheduledFor: string, pricePaise: number, status: BookingStatus, insured: boolean, chatUnlocked: boolean, coach: { __typename?: 'Coach', id: string, displayName: string }, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } }> } };

export type CoachCalendarQueryVariables = Exact<{ [key: string]: never; }>;

export type CoachCalendarQuery = { __typename?: 'Query', coachCalendar: Array<{ __typename?: 'Booking', id: string, scheduledFor: string, pricePaise: number, status: BookingStatus, insured: boolean, chatUnlocked: boolean, coach: { __typename?: 'Coach', id: string, displayName: string }, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } }> };

export type CoachClientsQueryVariables = Exact<{ [key: string]: never; }>;

export type CoachClientsQuery = { __typename?: 'Query', coachClients: Array<{ __typename?: 'CoachClient', id: string, name: string, avatarUrl: string | null, sessions: number }> };

export type CoachClientQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type CoachClientQuery = { __typename?: 'Query', coachClient: { __typename?: 'CoachClient', id: string, name: string, avatarUrl: string | null, sessions: number } | null };

export type CoachEarningsQueryVariables = Exact<{ [key: string]: never; }>;

export type CoachEarningsQuery = { __typename?: 'Query', coachEarnings: { __typename?: 'CoachEarnings', grossPaise: number, takeHomePaise: number, payoutSchedule: string, estimatedTdsPaise: number } };

export type CoachProfileQueryVariables = Exact<{ [key: string]: never; }>;

export type CoachProfileQuery = { __typename?: 'Query', coachProfile: { __typename?: 'Coach', id: string, displayName: string, verified: boolean, badge: string | null, bio: string, specialties: Array<string>, pricePerSessionPaise: number, ratingAverage: number | null, sessionsCompleted: number, tierFloor: Tier | null, certifications: Array<{ __typename?: 'CoachCertification', title: string, issuer: string, status: CertificationStatus }> } };

export type CoachCardFragment = { __typename?: 'Coach', id: string, displayName: string, verified: boolean, badge: string | null, specialties: Array<string>, pricePerSessionPaise: number, ratingAverage: number | null, sessionsCompleted: number };

export type CoachFullFragment = { __typename?: 'Coach', bio: string, transformationPhotoUrls: Array<string>, id: string, displayName: string, verified: boolean, badge: string | null, specialties: Array<string>, pricePerSessionPaise: number, ratingAverage: number | null, sessionsCompleted: number };

export type CoachesQueryVariables = Exact<{
  specialty?: InputMaybe<Scalars['String']['input']>;
  femaleOnly?: InputMaybe<Scalars['Boolean']['input']>;
  maxPricePaise?: InputMaybe<Scalars['Int']['input']>;
}>;

export type CoachesQuery = { __typename?: 'Query', coaches: Array<{ __typename?: 'Coach', id: string, displayName: string, verified: boolean, badge: string | null, specialties: Array<string>, pricePerSessionPaise: number, ratingAverage: number | null, sessionsCompleted: number }> };

export type CoachQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type CoachQuery = { __typename?: 'Query', coach: { __typename?: 'Coach', bio: string, transformationPhotoUrls: Array<string>, id: string, displayName: string, verified: boolean, badge: string | null, specialties: Array<string>, pricePerSessionPaise: number, ratingAverage: number | null, sessionsCompleted: number } | null };

export type FeatureFlagsQueryVariables = Exact<{ [key: string]: never; }>;

export type FeatureFlagsQuery = { __typename?: 'Query', featureFlags: Array<{ __typename?: 'FeatureFlag', key: string, enabled: boolean }> };

export type GymCardFragment = { __typename?: 'Gym', id: string, name: string, tier: Tier, zone: string, address: string, distanceMeters: number | null, amenities: Array<string>, photoUrls: Array<string>, rating: number | null, liveBusyFraction: number | null, location: { __typename?: 'GeoPoint', lat: number, lng: number } | null };

export type GymsQueryVariables = Exact<{
  zone?: InputMaybe<Scalars['String']['input']>;
  peekOtherTiers?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type GymsQuery = { __typename?: 'Query', gyms: Array<{ __typename?: 'Gym', id: string, name: string, tier: Tier, zone: string, address: string, distanceMeters: number | null, amenities: Array<string>, photoUrls: Array<string>, rating: number | null, liveBusyFraction: number | null, location: { __typename?: 'GeoPoint', lat: number, lng: number } | null }> };

export type GymQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GymQuery = { __typename?: 'Query', gym: { __typename?: 'Gym', id: string, name: string, tier: Tier, zone: string, address: string, distanceMeters: number | null, amenities: Array<string>, photoUrls: Array<string>, rating: number | null, liveBusyFraction: number | null, location: { __typename?: 'GeoPoint', lat: number, lng: number } | null } | null };

export type LeaderboardEntryRowFragment = { __typename?: 'LeaderboardEntry', userId: string, displayName: string, streak: number, totalCheckIns: number, position: number, isSelf: boolean };

export type LeaderboardQueryVariables = Exact<{
  segment: LeaderboardSegment;
  scopeKey?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type LeaderboardQuery = { __typename?: 'Query', leaderboard: { __typename?: 'Leaderboard', segment: LeaderboardSegment, scopeKey: string, season: string, page: Array<{ __typename?: 'LeaderboardEntry', userId: string, displayName: string, streak: number, totalCheckIns: number, position: number, isSelf: boolean }>, self: { __typename?: 'LeaderboardEntry', userId: string, displayName: string, streak: number, totalCheckIns: number, position: number, isSelf: boolean } | null } };

export type WorkoutChipPartsFragment = { __typename?: 'WorkoutChip', kind: WorkoutKind, exercise: string | null, sets: number | null, reps: number | null, weightKg: number | null, distanceKm: number | null, durationMin: number | null, uncertain: boolean, note: string | null, raw: string };

export type LedgerEntryRowFragment = { __typename?: 'LedgerEntry', id: string, isPR: boolean, loggedByCoach: boolean, loggedAt: string, chip: { __typename?: 'WorkoutChip', kind: WorkoutKind, exercise: string | null, sets: number | null, reps: number | null, weightKg: number | null, distanceKm: number | null, durationMin: number | null, uncertain: boolean, note: string | null, raw: string } };

export type LedgerTodayQueryVariables = Exact<{ [key: string]: never; }>;

export type LedgerTodayQuery = { __typename?: 'Query', ledgerToday: Array<{ __typename?: 'LedgerEntry', id: string, isPR: boolean, loggedByCoach: boolean, loggedAt: string, chip: { __typename?: 'WorkoutChip', kind: WorkoutKind, exercise: string | null, sets: number | null, reps: number | null, weightKg: number | null, distanceKm: number | null, durationMin: number | null, uncertain: boolean, note: string | null, raw: string } }> };

export type LedgerHistoryQueryVariables = Exact<{
  exercise?: InputMaybe<Scalars['String']['input']>;
}>;

export type LedgerHistoryQuery = { __typename?: 'Query', ledgerHistory: Array<{ __typename?: 'LedgerEntry', id: string, isPR: boolean, loggedByCoach: boolean, loggedAt: string, chip: { __typename?: 'WorkoutChip', kind: WorkoutKind, exercise: string | null, sets: number | null, reps: number | null, weightKg: number | null, distanceKm: number | null, durationMin: number | null, uncertain: boolean, note: string | null, raw: string } }> };

export type LogWorkoutMutationVariables = Exact<{
  text: Scalars['String']['input'];
}>;

export type LogWorkoutMutation = { __typename?: 'Mutation', logWorkout: Array<{ __typename?: 'LedgerEntry', id: string, isPR: boolean, loggedByCoach: boolean, loggedAt: string, chip: { __typename?: 'WorkoutChip', kind: WorkoutKind, exercise: string | null, sets: number | null, reps: number | null, weightKg: number | null, distanceKm: number | null, durationMin: number | null, uncertain: boolean, note: string | null, raw: string } }> };

export type RequestOtpMutationVariables = Exact<{
  input: RequestOtpInput;
}>;

export type RequestOtpMutation = { __typename?: 'Mutation', requestOtp: boolean };

export type VerifyOtpMutationVariables = Exact<{
  input: VerifyOtpInput;
}>;

export type VerifyOtpMutation = { __typename?: 'Mutation', verifyOtp: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string } };

export type RefreshSessionMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;

export type RefreshSessionMutation = { __typename?: 'Mutation', refreshSession: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string } };

export type SyncCheckInMutationVariables = Exact<{
  input: SyncCheckInInput;
}>;

export type SyncCheckInMutation = { __typename?: 'Mutation', syncCheckIn: { __typename?: 'SyncCheckInResult', checkIn: { __typename?: 'CheckIn', id: string, gymTier: Tier, passTier: Tier, scannedAt: string, dayNumber: number, topUpAmountPaise: number | null, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } } | null, topUpRequired: { __typename?: 'TopUpRequired', gymTier: Tier, amountPaise: number, razorpayOrderId: string } | null } };

export type CreatePassOrderMutationVariables = Exact<{
  input: CreatePassOrderInput;
}>;

export type CreatePassOrderMutation = { __typename?: 'Mutation', createPassOrder: { __typename?: 'RazorpayOrder', orderId: string, amountPaise: number, currency: string } };

export type CreateTopUpOrderMutationVariables = Exact<{
  input: CreateTopUpOrderInput;
}>;

export type CreateTopUpOrderMutation = { __typename?: 'Mutation', createTopUpOrder: { __typename?: 'RazorpayOrder', orderId: string, amountPaise: number, currency: string } };

export type CreateBookingOrderMutationVariables = Exact<{
  input: CreateBookingOrderInput;
}>;

export type CreateBookingOrderMutation = { __typename?: 'Mutation', createBookingOrder: { __typename?: 'RazorpayOrder', orderId: string, amountPaise: number, currency: string } };

export type NotificationRowFragment = { __typename?: 'AppNotification', id: string, kind: NotificationKind, title: string, body: string, read: boolean, createdAt: string };

export type NotificationsQueryVariables = Exact<{ [key: string]: never; }>;

export type NotificationsQuery = { __typename?: 'Query', notifications: Array<{ __typename?: 'AppNotification', id: string, kind: NotificationKind, title: string, body: string, read: boolean, createdAt: string }> };

export type MarkNotificationReadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type MarkNotificationReadMutation = { __typename?: 'Mutation', markNotificationRead: boolean };

export type RegisterPushTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;

export type RegisterPushTokenMutation = { __typename?: 'Mutation', registerPushToken: boolean };

export type PassLadderQueryVariables = Exact<{ [key: string]: never; }>;

export type PassLadderQuery = { __typename?: 'Query', passLadder: Array<{ __typename?: 'PassLadderRow', pack: PassPack, days: number, pricePaise: number, perDayPaise: number, badge: string | null, rankMultiplier: number | null, emphasized: boolean }> };

export type IncidentRowFragment = { __typename?: 'Incident', id: string, kind: SosKind, note: string, status: IncidentStatus, createdAt: string, location: { __typename?: 'GeoPoint', lat: number, lng: number } | null };

export type IncidentsQueryVariables = Exact<{ [key: string]: never; }>;

export type IncidentsQuery = { __typename?: 'Query', incidents: Array<{ __typename?: 'Incident', id: string, kind: SosKind, note: string, status: IncidentStatus, createdAt: string, location: { __typename?: 'GeoPoint', lat: number, lng: number } | null }> };

export type TrustedContactQueryVariables = Exact<{ [key: string]: never; }>;

export type TrustedContactQuery = { __typename?: 'Query', trustedContact: { __typename?: 'TrustedContact', name: string, phone: string } | null };

export type TriggerSosMutationVariables = Exact<{
  input: TriggerSosInput;
}>;

export type TriggerSosMutation = { __typename?: 'Mutation', triggerSos: { __typename?: 'Incident', id: string, kind: SosKind, note: string, status: IncidentStatus, createdAt: string, location: { __typename?: 'GeoPoint', lat: number, lng: number } | null } };

export type SetTrustedContactMutationVariables = Exact<{
  input: SetTrustedContactInput;
}>;

export type SetTrustedContactMutation = { __typename?: 'Mutation', setTrustedContact: boolean };

export type RankCardQueryVariables = Exact<{ [key: string]: never; }>;

export type RankCardQuery = { __typename?: 'Query', rankCard: { __typename?: 'RankCard', current: string, label: string, next: string | null, weeksToNext: number | null, streakWeeks: number, thresholds: Array<{ __typename?: 'RankThreshold', key: string, label: string, minWeeks: number }> } };

export type StreakCalendarQueryVariables = Exact<{ [key: string]: never; }>;

export type StreakCalendarQuery = { __typename?: 'Query', streakCalendar: { __typename?: 'StreakCalendar', weeks: number, alive: boolean, daysThisWindow: number, windowDaysLeft: number, bonusDaysEarned: number, days: Array<string> } };

export type ViewerQueryVariables = Exact<{ [key: string]: never; }>;

export type ViewerQuery = { __typename?: 'Query', viewer: { __typename?: 'Viewer', id: string, name: string, avatarUrl: string | null, tier: Tier, zone: string, role: UserRole, streak: { __typename?: 'Streak', current: number, windowDaysLeft: number, bonusDaysEarned: number }, activePass: { __typename?: 'Pass', id: string, tier: Tier, pack: PassPack, daysTotal: number, daysUsed: number, bonusDays: number, daysLeft: number, validUntil: string, status: PassStatus } | null } | null };

export type VersionGateQueryVariables = Exact<{ [key: string]: never; }>;

export type VersionGateQuery = { __typename?: 'Query', versionGate: { __typename?: 'VersionGate', latestVersion: string, minSupportedVersion: string } };

export const BookingRowFragmentDoc = gql`
    fragment BookingRow on Booking {
  id
  scheduledFor
  pricePaise
  status
  insured
  chatUnlocked
  coach {
    id
    displayName
    verified
    badge
  }
  gym {
    id
    name
    tier
  }
}
    `;
export const ChatMessageRowFragmentDoc = gql`
    fragment ChatMessageRow on ChatMessage {
  id
  bookingId
  from
  text
  masked
  sentAt
}
    `;
export const ChatThreadRowFragmentDoc = gql`
    fragment ChatThreadRow on ChatThread {
  bookingId
  chatUnlocked
  coach {
    id
    displayName
    verified
    badge
  }
  gym {
    id
    name
    tier
  }
  lastMessage {
    ...ChatMessageRow
  }
}
    ${ChatMessageRowFragmentDoc}`;
export const CheckInRowFragmentDoc = gql`
    fragment CheckInRow on CheckIn {
  id
  gymTier
  passTier
  scannedAt
  dayNumber
  topUpAmountPaise
  gym {
    id
    name
    tier
  }
}
    `;
export const CoachSessionRowFragmentDoc = gql`
    fragment CoachSessionRow on Booking {
  id
  scheduledFor
  pricePaise
  status
  insured
  chatUnlocked
  coach {
    id
    displayName
  }
  gym {
    id
    name
    tier
  }
}
    `;
export const CoachClientRowFragmentDoc = gql`
    fragment CoachClientRow on CoachClient {
  id
  name
  avatarUrl
  sessions
}
    `;
export const CoachProfilePartsFragmentDoc = gql`
    fragment CoachProfileParts on Coach {
  id
  displayName
  verified
  badge
  bio
  specialties
  pricePerSessionPaise
  ratingAverage
  sessionsCompleted
  tierFloor
  certifications {
    title
    issuer
    status
  }
}
    `;
export const CoachCardFragmentDoc = gql`
    fragment CoachCard on Coach {
  id
  displayName
  verified
  badge
  specialties
  pricePerSessionPaise
  ratingAverage
  sessionsCompleted
}
    `;
export const CoachFullFragmentDoc = gql`
    fragment CoachFull on Coach {
  ...CoachCard
  bio
  transformationPhotoUrls
}
    ${CoachCardFragmentDoc}`;
export const GymCardFragmentDoc = gql`
    fragment GymCard on Gym {
  id
  name
  tier
  zone
  address
  distanceMeters
  amenities
  photoUrls
  rating
  liveBusyFraction
  location {
    lat
    lng
  }
}
    `;
export const LeaderboardEntryRowFragmentDoc = gql`
    fragment LeaderboardEntryRow on LeaderboardEntry {
  userId
  displayName
  streak
  totalCheckIns
  position
  isSelf
}
    `;
export const WorkoutChipPartsFragmentDoc = gql`
    fragment WorkoutChipParts on WorkoutChip {
  kind
  exercise
  sets
  reps
  weightKg
  distanceKm
  durationMin
  uncertain
  note
  raw
}
    `;
export const LedgerEntryRowFragmentDoc = gql`
    fragment LedgerEntryRow on LedgerEntry {
  id
  isPR
  loggedByCoach
  loggedAt
  chip {
    ...WorkoutChipParts
  }
}
    ${WorkoutChipPartsFragmentDoc}`;
export const NotificationRowFragmentDoc = gql`
    fragment NotificationRow on AppNotification {
  id
  kind
  title
  body
  read
  createdAt
}
    `;
export const IncidentRowFragmentDoc = gql`
    fragment IncidentRow on Incident {
  id
  kind
  note
  status
  createdAt
  location {
    lat
    lng
  }
}
    `;
export const BookingsDocument = gql`
    query Bookings {
  bookings {
    ...BookingRow
  }
}
    ${BookingRowFragmentDoc}`;

export function useBookingsQuery(options?: Omit<Urql.UseQueryArgs<BookingsQueryVariables>, 'query'>) {
  return Urql.useQuery<BookingsQuery, BookingsQueryVariables>({ query: BookingsDocument, ...options });
};
export const ChatInboxDocument = gql`
    query ChatInbox {
  chatInbox {
    ...ChatThreadRow
  }
}
    ${ChatThreadRowFragmentDoc}`;

export function useChatInboxQuery(options?: Omit<Urql.UseQueryArgs<ChatInboxQueryVariables>, 'query'>) {
  return Urql.useQuery<ChatInboxQuery, ChatInboxQueryVariables>({ query: ChatInboxDocument, ...options });
};
export const ChatThreadDocument = gql`
    query ChatThread($bookingId: ID!) {
  chatThread(bookingId: $bookingId) {
    ...ChatMessageRow
  }
}
    ${ChatMessageRowFragmentDoc}`;

export function useChatThreadQuery(options: Omit<Urql.UseQueryArgs<ChatThreadQueryVariables>, 'query'>) {
  return Urql.useQuery<ChatThreadQuery, ChatThreadQueryVariables>({ query: ChatThreadDocument, ...options });
};
export const SendMessageDocument = gql`
    mutation SendMessage($bookingId: ID!, $text: String!) {
  sendMessage(bookingId: $bookingId, text: $text) {
    ...ChatMessageRow
  }
}
    ${ChatMessageRowFragmentDoc}`;

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument);
};
export const ShareLocationDocument = gql`
    mutation ShareLocation($bookingId: ID!, $lat: Float!, $lng: Float!) {
  shareLocation(bookingId: $bookingId, lat: $lat, lng: $lng) {
    expiresAt
  }
}
    `;

export function useShareLocationMutation() {
  return Urql.useMutation<ShareLocationMutation, ShareLocationMutationVariables>(ShareLocationDocument);
};
export const MessageReceivedDocument = gql`
    subscription MessageReceived($bookingId: ID!) {
  messageReceived(bookingId: $bookingId) {
    ...ChatMessageRow
  }
}
    ${ChatMessageRowFragmentDoc}`;

export function useMessageReceivedSubscription<TData = MessageReceivedSubscription>(options: Omit<Urql.UseSubscriptionArgs<MessageReceivedSubscriptionVariables>, 'query'>, handler?: Urql.SubscriptionHandler<MessageReceivedSubscription, TData>) {
  return Urql.useSubscription<MessageReceivedSubscription, TData, MessageReceivedSubscriptionVariables>({ query: MessageReceivedDocument, ...options }, handler);
};
export const CheckInHistoryDocument = gql`
    query CheckInHistory($limit: Int) {
  checkInHistory(limit: $limit) {
    ...CheckInRow
  }
}
    ${CheckInRowFragmentDoc}`;

export function useCheckInHistoryQuery(options?: Omit<Urql.UseQueryArgs<CheckInHistoryQueryVariables>, 'query'>) {
  return Urql.useQuery<CheckInHistoryQuery, CheckInHistoryQueryVariables>({ query: CheckInHistoryDocument, ...options });
};
export const CoachDashboardDocument = gql`
    query CoachDashboard {
  coachDashboard {
    ratingAverage
    sessionsCompleted
    earningsPaise
    todaysSessions {
      ...CoachSessionRow
    }
    pendingRequests {
      ...CoachSessionRow
    }
  }
}
    ${CoachSessionRowFragmentDoc}`;

export function useCoachDashboardQuery(options?: Omit<Urql.UseQueryArgs<CoachDashboardQueryVariables>, 'query'>) {
  return Urql.useQuery<CoachDashboardQuery, CoachDashboardQueryVariables>({ query: CoachDashboardDocument, ...options });
};
export const CoachCalendarDocument = gql`
    query CoachCalendar {
  coachCalendar {
    ...CoachSessionRow
  }
}
    ${CoachSessionRowFragmentDoc}`;

export function useCoachCalendarQuery(options?: Omit<Urql.UseQueryArgs<CoachCalendarQueryVariables>, 'query'>) {
  return Urql.useQuery<CoachCalendarQuery, CoachCalendarQueryVariables>({ query: CoachCalendarDocument, ...options });
};
export const CoachClientsDocument = gql`
    query CoachClients {
  coachClients {
    ...CoachClientRow
  }
}
    ${CoachClientRowFragmentDoc}`;

export function useCoachClientsQuery(options?: Omit<Urql.UseQueryArgs<CoachClientsQueryVariables>, 'query'>) {
  return Urql.useQuery<CoachClientsQuery, CoachClientsQueryVariables>({ query: CoachClientsDocument, ...options });
};
export const CoachClientDocument = gql`
    query CoachClient($id: ID!) {
  coachClient(id: $id) {
    ...CoachClientRow
  }
}
    ${CoachClientRowFragmentDoc}`;

export function useCoachClientQuery(options: Omit<Urql.UseQueryArgs<CoachClientQueryVariables>, 'query'>) {
  return Urql.useQuery<CoachClientQuery, CoachClientQueryVariables>({ query: CoachClientDocument, ...options });
};
export const CoachEarningsDocument = gql`
    query CoachEarnings {
  coachEarnings {
    grossPaise
    takeHomePaise
    payoutSchedule
    estimatedTdsPaise
  }
}
    `;

export function useCoachEarningsQuery(options?: Omit<Urql.UseQueryArgs<CoachEarningsQueryVariables>, 'query'>) {
  return Urql.useQuery<CoachEarningsQuery, CoachEarningsQueryVariables>({ query: CoachEarningsDocument, ...options });
};
export const CoachProfileDocument = gql`
    query CoachProfile {
  coachProfile {
    ...CoachProfileParts
  }
}
    ${CoachProfilePartsFragmentDoc}`;

export function useCoachProfileQuery(options?: Omit<Urql.UseQueryArgs<CoachProfileQueryVariables>, 'query'>) {
  return Urql.useQuery<CoachProfileQuery, CoachProfileQueryVariables>({ query: CoachProfileDocument, ...options });
};
export const CoachesDocument = gql`
    query Coaches($specialty: String, $femaleOnly: Boolean, $maxPricePaise: Int) {
  coaches(
    specialty: $specialty
    femaleOnly: $femaleOnly
    maxPricePaise: $maxPricePaise
  ) {
    ...CoachCard
  }
}
    ${CoachCardFragmentDoc}`;

export function useCoachesQuery(options?: Omit<Urql.UseQueryArgs<CoachesQueryVariables>, 'query'>) {
  return Urql.useQuery<CoachesQuery, CoachesQueryVariables>({ query: CoachesDocument, ...options });
};
export const CoachDocument = gql`
    query Coach($id: ID!) {
  coach(id: $id) {
    ...CoachFull
  }
}
    ${CoachFullFragmentDoc}`;

export function useCoachQuery(options: Omit<Urql.UseQueryArgs<CoachQueryVariables>, 'query'>) {
  return Urql.useQuery<CoachQuery, CoachQueryVariables>({ query: CoachDocument, ...options });
};
export const FeatureFlagsDocument = gql`
    query FeatureFlags {
  featureFlags {
    key
    enabled
  }
}
    `;

export function useFeatureFlagsQuery(options?: Omit<Urql.UseQueryArgs<FeatureFlagsQueryVariables>, 'query'>) {
  return Urql.useQuery<FeatureFlagsQuery, FeatureFlagsQueryVariables>({ query: FeatureFlagsDocument, ...options });
};
export const GymsDocument = gql`
    query Gyms($zone: String, $peekOtherTiers: Boolean) {
  gyms(zone: $zone, peekOtherTiers: $peekOtherTiers) {
    ...GymCard
  }
}
    ${GymCardFragmentDoc}`;

export function useGymsQuery(options?: Omit<Urql.UseQueryArgs<GymsQueryVariables>, 'query'>) {
  return Urql.useQuery<GymsQuery, GymsQueryVariables>({ query: GymsDocument, ...options });
};
export const GymDocument = gql`
    query Gym($id: ID!) {
  gym(id: $id) {
    ...GymCard
  }
}
    ${GymCardFragmentDoc}`;

export function useGymQuery(options: Omit<Urql.UseQueryArgs<GymQueryVariables>, 'query'>) {
  return Urql.useQuery<GymQuery, GymQueryVariables>({ query: GymDocument, ...options });
};
export const LeaderboardDocument = gql`
    query Leaderboard($segment: LeaderboardSegment!, $scopeKey: String, $limit: Int) {
  leaderboard(segment: $segment, scopeKey: $scopeKey, limit: $limit) {
    segment
    scopeKey
    season
    page {
      ...LeaderboardEntryRow
    }
    self {
      ...LeaderboardEntryRow
    }
  }
}
    ${LeaderboardEntryRowFragmentDoc}`;

export function useLeaderboardQuery(options: Omit<Urql.UseQueryArgs<LeaderboardQueryVariables>, 'query'>) {
  return Urql.useQuery<LeaderboardQuery, LeaderboardQueryVariables>({ query: LeaderboardDocument, ...options });
};
export const LedgerTodayDocument = gql`
    query LedgerToday {
  ledgerToday {
    ...LedgerEntryRow
  }
}
    ${LedgerEntryRowFragmentDoc}`;

export function useLedgerTodayQuery(options?: Omit<Urql.UseQueryArgs<LedgerTodayQueryVariables>, 'query'>) {
  return Urql.useQuery<LedgerTodayQuery, LedgerTodayQueryVariables>({ query: LedgerTodayDocument, ...options });
};
export const LedgerHistoryDocument = gql`
    query LedgerHistory($exercise: String) {
  ledgerHistory(exercise: $exercise) {
    ...LedgerEntryRow
  }
}
    ${LedgerEntryRowFragmentDoc}`;

export function useLedgerHistoryQuery(options?: Omit<Urql.UseQueryArgs<LedgerHistoryQueryVariables>, 'query'>) {
  return Urql.useQuery<LedgerHistoryQuery, LedgerHistoryQueryVariables>({ query: LedgerHistoryDocument, ...options });
};
export const LogWorkoutDocument = gql`
    mutation LogWorkout($text: String!) {
  logWorkout(text: $text) {
    ...LedgerEntryRow
  }
}
    ${LedgerEntryRowFragmentDoc}`;

export function useLogWorkoutMutation() {
  return Urql.useMutation<LogWorkoutMutation, LogWorkoutMutationVariables>(LogWorkoutDocument);
};
export const RequestOtpDocument = gql`
    mutation RequestOtp($input: RequestOtpInput!) {
  requestOtp(input: $input)
}
    `;

export function useRequestOtpMutation() {
  return Urql.useMutation<RequestOtpMutation, RequestOtpMutationVariables>(RequestOtpDocument);
};
export const VerifyOtpDocument = gql`
    mutation VerifyOtp($input: VerifyOtpInput!) {
  verifyOtp(input: $input) {
    accessToken
    refreshToken
  }
}
    `;

export function useVerifyOtpMutation() {
  return Urql.useMutation<VerifyOtpMutation, VerifyOtpMutationVariables>(VerifyOtpDocument);
};
export const RefreshSessionDocument = gql`
    mutation RefreshSession($refreshToken: String!) {
  refreshSession(refreshToken: $refreshToken) {
    accessToken
    refreshToken
  }
}
    `;

export function useRefreshSessionMutation() {
  return Urql.useMutation<RefreshSessionMutation, RefreshSessionMutationVariables>(RefreshSessionDocument);
};
export const SyncCheckInDocument = gql`
    mutation SyncCheckIn($input: SyncCheckInInput!) {
  syncCheckIn(input: $input) {
    checkIn {
      ...CheckInRow
    }
    topUpRequired {
      gymTier
      amountPaise
      razorpayOrderId
    }
  }
}
    ${CheckInRowFragmentDoc}`;

export function useSyncCheckInMutation() {
  return Urql.useMutation<SyncCheckInMutation, SyncCheckInMutationVariables>(SyncCheckInDocument);
};
export const CreatePassOrderDocument = gql`
    mutation CreatePassOrder($input: CreatePassOrderInput!) {
  createPassOrder(input: $input) {
    orderId
    amountPaise
    currency
  }
}
    `;

export function useCreatePassOrderMutation() {
  return Urql.useMutation<CreatePassOrderMutation, CreatePassOrderMutationVariables>(CreatePassOrderDocument);
};
export const CreateTopUpOrderDocument = gql`
    mutation CreateTopUpOrder($input: CreateTopUpOrderInput!) {
  createTopUpOrder(input: $input) {
    orderId
    amountPaise
    currency
  }
}
    `;

export function useCreateTopUpOrderMutation() {
  return Urql.useMutation<CreateTopUpOrderMutation, CreateTopUpOrderMutationVariables>(CreateTopUpOrderDocument);
};
export const CreateBookingOrderDocument = gql`
    mutation CreateBookingOrder($input: CreateBookingOrderInput!) {
  createBookingOrder(input: $input) {
    orderId
    amountPaise
    currency
  }
}
    `;

export function useCreateBookingOrderMutation() {
  return Urql.useMutation<CreateBookingOrderMutation, CreateBookingOrderMutationVariables>(CreateBookingOrderDocument);
};
export const NotificationsDocument = gql`
    query Notifications {
  notifications {
    ...NotificationRow
  }
}
    ${NotificationRowFragmentDoc}`;

export function useNotificationsQuery(options?: Omit<Urql.UseQueryArgs<NotificationsQueryVariables>, 'query'>) {
  return Urql.useQuery<NotificationsQuery, NotificationsQueryVariables>({ query: NotificationsDocument, ...options });
};
export const MarkNotificationReadDocument = gql`
    mutation MarkNotificationRead($id: ID!) {
  markNotificationRead(id: $id)
}
    `;

export function useMarkNotificationReadMutation() {
  return Urql.useMutation<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>(MarkNotificationReadDocument);
};
export const RegisterPushTokenDocument = gql`
    mutation RegisterPushToken($token: String!) {
  registerPushToken(token: $token)
}
    `;

export function useRegisterPushTokenMutation() {
  return Urql.useMutation<RegisterPushTokenMutation, RegisterPushTokenMutationVariables>(RegisterPushTokenDocument);
};
export const PassLadderDocument = gql`
    query PassLadder {
  passLadder {
    pack
    days
    pricePaise
    perDayPaise
    badge
    rankMultiplier
    emphasized
  }
}
    `;

export function usePassLadderQuery(options?: Omit<Urql.UseQueryArgs<PassLadderQueryVariables>, 'query'>) {
  return Urql.useQuery<PassLadderQuery, PassLadderQueryVariables>({ query: PassLadderDocument, ...options });
};
export const IncidentsDocument = gql`
    query Incidents {
  incidents {
    ...IncidentRow
  }
}
    ${IncidentRowFragmentDoc}`;

export function useIncidentsQuery(options?: Omit<Urql.UseQueryArgs<IncidentsQueryVariables>, 'query'>) {
  return Urql.useQuery<IncidentsQuery, IncidentsQueryVariables>({ query: IncidentsDocument, ...options });
};
export const TrustedContactDocument = gql`
    query TrustedContact {
  trustedContact {
    name
    phone
  }
}
    `;

export function useTrustedContactQuery(options?: Omit<Urql.UseQueryArgs<TrustedContactQueryVariables>, 'query'>) {
  return Urql.useQuery<TrustedContactQuery, TrustedContactQueryVariables>({ query: TrustedContactDocument, ...options });
};
export const TriggerSosDocument = gql`
    mutation TriggerSos($input: TriggerSosInput!) {
  triggerSos(input: $input) {
    ...IncidentRow
  }
}
    ${IncidentRowFragmentDoc}`;

export function useTriggerSosMutation() {
  return Urql.useMutation<TriggerSosMutation, TriggerSosMutationVariables>(TriggerSosDocument);
};
export const SetTrustedContactDocument = gql`
    mutation SetTrustedContact($input: SetTrustedContactInput!) {
  setTrustedContact(input: $input)
}
    `;

export function useSetTrustedContactMutation() {
  return Urql.useMutation<SetTrustedContactMutation, SetTrustedContactMutationVariables>(SetTrustedContactDocument);
};
export const RankCardDocument = gql`
    query RankCard {
  rankCard {
    current
    label
    next
    weeksToNext
    streakWeeks
    thresholds {
      key
      label
      minWeeks
    }
  }
}
    `;

export function useRankCardQuery(options?: Omit<Urql.UseQueryArgs<RankCardQueryVariables>, 'query'>) {
  return Urql.useQuery<RankCardQuery, RankCardQueryVariables>({ query: RankCardDocument, ...options });
};
export const StreakCalendarDocument = gql`
    query StreakCalendar {
  streakCalendar {
    weeks
    alive
    daysThisWindow
    windowDaysLeft
    bonusDaysEarned
    days
  }
}
    `;

export function useStreakCalendarQuery(options?: Omit<Urql.UseQueryArgs<StreakCalendarQueryVariables>, 'query'>) {
  return Urql.useQuery<StreakCalendarQuery, StreakCalendarQueryVariables>({ query: StreakCalendarDocument, ...options });
};
export const ViewerDocument = gql`
    query Viewer {
  viewer {
    id
    name
    avatarUrl
    tier
    zone
    role
    streak {
      current
      windowDaysLeft
      bonusDaysEarned
    }
    activePass {
      id
      tier
      pack
      daysTotal
      daysUsed
      bonusDays
      daysLeft
      validUntil
      status
    }
  }
}
    `;

export function useViewerQuery(options?: Omit<Urql.UseQueryArgs<ViewerQueryVariables>, 'query'>) {
  return Urql.useQuery<ViewerQuery, ViewerQueryVariables>({ query: ViewerDocument, ...options });
};
export const VersionGateDocument = gql`
    query VersionGate {
  versionGate {
    latestVersion
    minSupportedVersion
  }
}
    `;

export function useVersionGateQuery(options?: Omit<Urql.UseQueryArgs<VersionGateQueryVariables>, 'query'>) {
  return Urql.useQuery<VersionGateQuery, VersionGateQueryVariables>({ query: VersionGateDocument, ...options });
};