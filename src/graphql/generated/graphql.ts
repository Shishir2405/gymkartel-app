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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * Gym Kartel GraphQL contract — the single wire boundary between backend and app.
   * This file is the source of truth: the backend generates typed resolvers from it,
   * the app runs GraphQL Code Generator against it for typed hooks. Breaking changes
   * are gated by graphql-inspector in CI and a @gymkartel/contracts major bump.
   */
  DateTime: { input: string; output: string; }
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
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pricePerSessionPaise: Scalars['Int']['output'];
  ratingAverage: Maybe<Scalars['Float']['output']>;
  sessionsCompleted: Scalars['Int']['output'];
  specialties: Array<Scalars['String']['output']>;
  transformationPhotoUrls: Array<Scalars['String']['output']>;
  verified: Scalars['Boolean']['output'];
};

export type CreatePassOrderInput = {
  pack: PassPack;
};

export type Gym = {
  __typename?: 'Gym';
  address: Scalars['String']['output'];
  amenities: Array<Scalars['String']['output']>;
  distanceMeters: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  liveBusyFraction: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  photoUrls: Array<Scalars['String']['output']>;
  rating: Maybe<Scalars['Float']['output']>;
  tier: Tier;
  zone: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPassOrder: RazorpayOrder;
  refreshSession: AuthTokens;
  requestOtp: Scalars['Boolean']['output'];
  /** Sync one (possibly offline-queued) check-in. Idempotent on idempotencyKey. */
  syncCheckIn: SyncCheckInResult;
  verifyOtp: AuthTokens;
};


export type MutationCreatePassOrderArgs = {
  input: CreatePassOrderInput;
};


export type MutationRefreshSessionArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRequestOtpArgs = {
  input: RequestOtpInput;
};


export type MutationSyncCheckInArgs = {
  input: SyncCheckInInput;
};


export type MutationVerifyOtpArgs = {
  input: VerifyOtpInput;
};

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
  checkInHistory: Array<CheckIn>;
  coach: Maybe<Coach>;
  coaches: Array<Coach>;
  gym: Maybe<Gym>;
  /** Nearby gyms in the viewer's tier; peekOtherTiers surfaces the rest. */
  gyms: Array<Gym>;
  /** Pass ladder for the viewer's tier only — never all tiers at once (Flow 2). */
  passLadder: Array<PassLadderRow>;
  versionGate: VersionGate;
  viewer: Maybe<Viewer>;
};


export type QueryCheckInHistoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCoachArgs = {
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

export type RazorpayOrder = {
  __typename?: 'RazorpayOrder';
  amountPaise: Scalars['Int']['output'];
  currency: Scalars['String']['output'];
  orderId: Scalars['String']['output'];
};

export type RequestOtpInput = {
  phone: Scalars['String']['input'];
};

export type Streak = {
  __typename?: 'Streak';
  bonusDaysEarned: Scalars['Int']['output'];
  current: Scalars['Int']['output'];
  /** Days remaining in the current 7-day window before the streak is at risk. */
  windowDaysLeft: Scalars['Int']['output'];
};

export type SyncCheckInInput = {
  acceptedTopUp?: InputMaybe<Scalars['Boolean']['input']>;
  gymCheckInCode: Scalars['String']['input'];
  idempotencyKey: Scalars['String']['input'];
  scannedAt: Scalars['DateTime']['input'];
};

/** Result of a scan: either checked in, or a top-up is required first (Flow 4). */
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

export type BookingRowFragment = { __typename?: 'Booking', id: string, scheduledFor: string, pricePaise: number, status: BookingStatus, insured: boolean, chatUnlocked: boolean, coach: { __typename?: 'Coach', id: string, displayName: string, verified: boolean, badge: string | null }, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } };

export type BookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type BookingsQuery = { __typename?: 'Query', bookings: Array<{ __typename?: 'Booking', id: string, scheduledFor: string, pricePaise: number, status: BookingStatus, insured: boolean, chatUnlocked: boolean, coach: { __typename?: 'Coach', id: string, displayName: string, verified: boolean, badge: string | null }, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } }> };

export type CheckInRowFragment = { __typename?: 'CheckIn', id: string, gymTier: Tier, passTier: Tier, scannedAt: string, dayNumber: number, topUpAmountPaise: number | null, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } };

export type CheckInHistoryQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CheckInHistoryQuery = { __typename?: 'Query', checkInHistory: Array<{ __typename?: 'CheckIn', id: string, gymTier: Tier, passTier: Tier, scannedAt: string, dayNumber: number, topUpAmountPaise: number | null, gym: { __typename?: 'Gym', id: string, name: string, tier: Tier } }> };

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

export type GymCardFragment = { __typename?: 'Gym', id: string, name: string, tier: Tier, zone: string, address: string, distanceMeters: number | null, amenities: Array<string>, photoUrls: Array<string>, rating: number | null, liveBusyFraction: number | null };

export type GymsQueryVariables = Exact<{
  zone?: InputMaybe<Scalars['String']['input']>;
  peekOtherTiers?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GymsQuery = { __typename?: 'Query', gyms: Array<{ __typename?: 'Gym', id: string, name: string, tier: Tier, zone: string, address: string, distanceMeters: number | null, amenities: Array<string>, photoUrls: Array<string>, rating: number | null, liveBusyFraction: number | null }> };

export type GymQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GymQuery = { __typename?: 'Query', gym: { __typename?: 'Gym', id: string, name: string, tier: Tier, zone: string, address: string, distanceMeters: number | null, amenities: Array<string>, photoUrls: Array<string>, rating: number | null, liveBusyFraction: number | null } | null };

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

export type PassLadderQueryVariables = Exact<{ [key: string]: never; }>;


export type PassLadderQuery = { __typename?: 'Query', passLadder: Array<{ __typename?: 'PassLadderRow', pack: PassPack, days: number, pricePaise: number, perDayPaise: number, badge: string | null, rankMultiplier: number | null, emphasized: boolean }> };

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