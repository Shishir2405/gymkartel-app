/**
 * Demo fixtures — the "mock data everywhere" layer.
 *
 * Every GraphQL operation the app runs (see `src/graphql/operations/*.graphql`)
 * has an entry in `demoFixtures` below, keyed by the operation's NAME. In demo
 * mode `demoExchange` resolves each operation against this map and returns
 * `{ data }` with NO network. The data is realistic + on-brand so a client can
 * click through every screen offline.
 *
 * Shape correctness is enforced by the compiler: each resolver returns a value
 * annotated (via `satisfies`) with the matching generated `*Query`/`*Mutation`
 * type, so a missing or wrong field fails `tsc` rather than surfacing as a blank
 * screen at runtime. Nested entities (gyms/coaches) come from typed superset
 * records so one gym or coach can satisfy several different field selections.
 *
 * Prices come from `@gymkartel/contracts` (the single source of truth) — never
 * hand-typed rupees.
 */
import {
  Tier,
  PassPack,
  PassStatus,
  UserRole,
  BookingStatus,
  NotificationKind,
  WorkoutKind,
  LeaderboardSegment,
  CertificationStatus,
  IncidentStatus,
  SosKind,
  type ViewerQuery,
  type VersionGateQuery,
  type GymsQuery,
  type GymQuery,
  type PassLadderQuery,
  type CoachesQuery,
  type CoachQuery,
  type BookingsQuery,
  type CheckInHistoryQuery,
  type ChatInboxQuery,
  type ChatThreadQuery,
  type LedgerTodayQuery,
  type LedgerHistoryQuery,
  type LeaderboardQuery,
  type RankCardQuery,
  type StreakCalendarQuery,
  type NotificationsQuery,
  type TrustedContactQuery,
  type IncidentsQuery,
  type FeatureFlagsQuery,
  type CoachDashboardQuery,
  type CoachCalendarQuery,
  type CoachClientsQuery,
  type CoachClientQuery,
  type CoachEarningsQuery,
  type CoachProfileQuery,
  type RequestOtpMutation,
  type VerifyOtpMutation,
  type RefreshSessionMutation,
  type SyncCheckInMutation,
  type CreatePassOrderMutation,
  type CreateTopUpOrderMutation,
  type CreateBookingOrderMutation,
  type LogWorkoutMutation,
  type SendMessageMutation,
  type ShareLocationMutation,
  type MarkNotificationReadMutation,
  type RegisterPushTokenMutation,
  type TriggerSosMutation,
  type SetTrustedContactMutation,
  type WorkoutChipPartsFragment,
  type LedgerEntryRowFragment,
  type ChatMessageRowFragment,
  type CoachClientRowFragment,
  type CoachSessionRowFragment,
} from "@/graphql/generated/graphql";
import {
  PASS_LADDER,
  passPrice,
  passPerDayPrice,
  type PassPack as ContractPassPack,
} from "@gymkartel/contracts";
import { parseWorkout } from "@/features/ledger/parser/workoutParser";
import { maskPii } from "@/features/chat/lib/mask";

// --- time helpers (computed once at module load; stable for the session) ----
const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const iso = (ms: number): string => new Date(ms).toISOString();

type Vars = Record<string, unknown>;
const str = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

// The signed-in demo member.
const VIEWER_ID = "user_ravi";
const VIEWER_NAME = "Ravi Menon";

// ---------------------------------------------------------------------------
// Superset entity records — one object can satisfy every field selection the
// app makes of that type (graphcache normalises them by id). Defined as named
// consts (never array-index access) so they read as non-undefined everywhere.
// ---------------------------------------------------------------------------

interface DemoGym {
  __typename: "Gym";
  id: string;
  name: string;
  tier: Tier;
  zone: string;
  address: string;
  distanceMeters: number | null;
  amenities: string[];
  photoUrls: string[];
  rating: number | null;
  liveBusyFraction: number | null;
  location: { __typename: "GeoPoint"; lat: number; lng: number } | null;
}

const gymPhoto = (id: string): string[] => [
  `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=60&ixid=${id}`,
];

const GYM_IRON: DemoGym = {
  __typename: "Gym",
  id: "gym_iron_republic",
  name: "Iron Republic",
  tier: Tier.Premium,
  zone: "Indiranagar",
  address: "100 Feet Rd, Indiranagar, Bengaluru",
  distanceMeters: 480,
  amenities: ["FREE_WEIGHTS", "SAUNA", "SHOWERS", "PARKING", "PT_AVAILABLE"],
  photoUrls: gymPhoto("iron"),
  rating: 4.8,
  liveBusyFraction: 0.42,
  location: { __typename: "GeoPoint", lat: 12.9719, lng: 77.6412 },
};

const GYM_KARTEL: DemoGym = {
  __typename: "Gym",
  id: "gym_kartel_strength",
  name: "Kartel Strength Club",
  tier: Tier.Premium,
  zone: "Indiranagar",
  address: "12th Main, HAL 2nd Stage, Bengaluru",
  distanceMeters: 1200,
  amenities: ["FREE_WEIGHTS", "CROSSFIT", "LOCKERS", "SHOWERS"],
  photoUrls: gymPhoto("kartel"),
  rating: 4.6,
  liveBusyFraction: 0.71,
  location: { __typename: "GeoPoint", lat: 12.9611, lng: 77.6387 },
};

const GYM_PULSE: DemoGym = {
  __typename: "Gym",
  id: "gym_pulse_house",
  name: "Pulse House",
  tier: Tier.Standard,
  zone: "Koramangala",
  address: "80 Feet Rd, Koramangala 4th Block, Bengaluru",
  distanceMeters: 2600,
  amenities: ["CARDIO", "LOCKERS", "SHOWERS", "PARKING"],
  photoUrls: gymPhoto("pulse"),
  rating: 4.4,
  liveBusyFraction: 0.28,
  location: { __typename: "GeoPoint", lat: 12.9352, lng: 77.6245 },
};

const GYM_YARD: DemoGym = {
  __typename: "Gym",
  id: "gym_the_yard",
  name: "The Yard",
  tier: Tier.Basic,
  zone: "Indiranagar",
  address: "CMH Rd, Indiranagar, Bengaluru",
  distanceMeters: 900,
  amenities: ["FREE_WEIGHTS", "CARDIO"],
  photoUrls: gymPhoto("yard"),
  rating: 4.2,
  liveBusyFraction: 0.55,
  location: { __typename: "GeoPoint", lat: 12.978, lng: 77.6408 },
};

export const DEMO_GYMS: DemoGym[] = [GYM_IRON, GYM_KARTEL, GYM_PULSE, GYM_YARD];

interface DemoCoach {
  __typename: "Coach";
  id: string;
  displayName: string;
  verified: boolean;
  badge: string | null;
  specialties: string[];
  pricePerSessionPaise: number;
  ratingAverage: number | null;
  sessionsCompleted: number;
  bio: string;
  transformationPhotoUrls: string[];
  tierFloor: Tier | null;
  certifications: {
    __typename: "CoachCertification";
    title: string;
    issuer: string;
    status: CertificationStatus;
  }[];
}

const transformPhotos = (id: string): string[] => [
  `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=60&ixid=${id}a`,
  `https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=60&ixid=${id}b`,
];

const COACH_ARJUN: DemoCoach = {
  __typename: "Coach",
  id: "coach_arjun",
  displayName: "Arjun Rao",
  verified: true,
  badge: "LEGEND",
  specialties: ["Strength", "Powerlifting", "Hypertrophy"],
  pricePerSessionPaise: 150000,
  ratingAverage: 4.9,
  sessionsCompleted: 412,
  bio: "Ex-national powerlifter. I coach clean technique and progressive overload. No shortcuts, no fluff — just the work that moves the bar.",
  transformationPhotoUrls: transformPhotos("arjun"),
  tierFloor: Tier.Standard,
  certifications: [
    {
      __typename: "CoachCertification",
      title: "Certified Strength & Conditioning Specialist",
      issuer: "NSCA",
      status: CertificationStatus.Verified,
    },
    {
      __typename: "CoachCertification",
      title: "Level 2 Powerlifting Coach",
      issuer: "IPF",
      status: CertificationStatus.Verified,
    },
  ],
};

const COACH_NEHA: DemoCoach = {
  __typename: "Coach",
  id: "coach_neha",
  displayName: "Neha Kapoor",
  verified: true,
  badge: "ELITE",
  specialties: ["Fat Loss", "Conditioning", "Mobility"],
  pricePerSessionPaise: 110000,
  ratingAverage: 4.8,
  sessionsCompleted: 268,
  bio: "Fat-loss and conditioning specialist. Sustainable plans built around your week — we train hard and we train smart.",
  transformationPhotoUrls: transformPhotos("neha"),
  tierFloor: Tier.Basic,
  certifications: [
    {
      __typename: "CoachCertification",
      title: "Certified Personal Trainer",
      issuer: "ACE",
      status: CertificationStatus.Verified,
    },
  ],
};

const COACH_SANA: DemoCoach = {
  __typename: "Coach",
  id: "coach_sana",
  displayName: "Sana Sheikh",
  verified: true,
  badge: null,
  specialties: ["Women's Strength", "Prenatal", "Mobility"],
  pricePerSessionPaise: 95000,
  ratingAverage: 4.7,
  sessionsCompleted: 143,
  bio: "Women-only coaching. Strength, form and confidence in a space that's yours. Beginners very welcome.",
  transformationPhotoUrls: transformPhotos("sana"),
  tierFloor: Tier.Basic,
  certifications: [
    {
      __typename: "CoachCertification",
      title: "Pre/Post-Natal Exercise Specialist",
      issuer: "NASM",
      status: CertificationStatus.Pending,
    },
  ],
};

export const DEMO_COACHES: DemoCoach[] = [COACH_ARJUN, COACH_NEHA, COACH_SANA];

// Bookings the demo member holds (confirmed upcoming + a completed one).
interface DemoBooking {
  id: string;
  coach: DemoCoach;
  gym: DemoGym;
  scheduledFor: string;
  pricePaise: number;
  status: BookingStatus;
  insured: boolean;
  chatUnlocked: boolean;
}

const DEMO_BOOKINGS: DemoBooking[] = [
  {
    id: "booking_1",
    coach: COACH_ARJUN,
    gym: GYM_IRON,
    scheduledFor: iso(NOW + 2 * DAY + 3 * HOUR),
    pricePaise: COACH_ARJUN.pricePerSessionPaise,
    status: BookingStatus.Confirmed,
    insured: true,
    chatUnlocked: true,
  },
  {
    id: "booking_2",
    coach: COACH_NEHA,
    gym: GYM_KARTEL,
    scheduledFor: iso(NOW - 5 * DAY),
    pricePaise: COACH_NEHA.pricePerSessionPaise,
    status: BookingStatus.Completed,
    insured: true,
    chatUnlocked: true,
  },
];

// A short, on-brand chat thread with the PII mask already applied in-fixture.
const MSG_1: ChatMessageRowFragment = {
  __typename: "ChatMessage",
  id: "msg_1",
  bookingId: "booking_1",
  from: "coach_arjun",
  text: "Great session today. Warm up with the empty bar next time before we load.",
  masked: false,
  sentAt: iso(NOW - 3 * HOUR),
};
const MSG_2: ChatMessageRowFragment = {
  __typename: "ChatMessage",
  id: "msg_2",
  bookingId: "booking_1",
  from: VIEWER_ID,
  text: "Will do. What should I eat before the 7am slot?",
  masked: false,
  sentAt: iso(NOW - 2 * HOUR - 40 * MIN),
};
const MSG_3: ChatMessageRowFragment = {
  __typename: "ChatMessage",
  id: "msg_3",
  bookingId: "booking_1",
  from: "coach_arjun",
  // Off-platform contact details are masked in-fixture (masked: true).
  text: "A banana and coffee is fine. Reach me on ••• if you're running late.",
  masked: true,
  sentAt: iso(NOW - 2 * HOUR),
};
const DEMO_MESSAGES: ChatMessageRowFragment[] = [MSG_1, MSG_2, MSG_3];

const CLIENT_1: CoachClientRowFragment = {
  __typename: "CoachClient",
  id: "client_1",
  name: "Rahul Dev",
  avatarUrl: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=60",
  sessions: 14,
};
const CLIENT_2: CoachClientRowFragment = {
  __typename: "CoachClient",
  id: "client_2",
  name: "Ishita Bose",
  avatarUrl: null,
  sessions: 6,
};
const CLIENT_3: CoachClientRowFragment = {
  __typename: "CoachClient",
  id: "client_3",
  name: "Sameer Khan",
  avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=60",
  sessions: 22,
};
const DEMO_CLIENTS: CoachClientRowFragment[] = [CLIENT_1, CLIENT_2, CLIENT_3];

// ---------------------------------------------------------------------------
// Small builders reused across resolvers.
// ---------------------------------------------------------------------------

const PACK_ENUM: Record<ContractPassPack, PassPack> = {
  SINGLE_DAY: PassPack.SingleDay,
  SEVEN_DAY: PassPack.SevenDay,
  FIFTEEN_DAY: PassPack.FifteenDay,
  THIRTY_DAY: PassPack.ThirtyDay,
};

function chipFromText(raw: string): WorkoutChipPartsFragment {
  const parsed = parseWorkout(raw);
  const isStrength = parsed.exercise != null || parsed.weightKg != null;
  const uncertain = parsed.chips.some((c) => c.uncertain);
  return {
    __typename: "WorkoutChip",
    kind: isStrength
      ? WorkoutKind.Strength
      : parsed.chips.length > 0
        ? WorkoutKind.Cardio
        : WorkoutKind.Unknown,
    exercise: parsed.exercise,
    sets: parsed.sets,
    reps: parsed.reps,
    weightKg: parsed.weightKg,
    distanceKm: null,
    durationMin: null,
    uncertain,
    note: null,
    raw,
  };
}

function coachSession(
  id: string,
  gym: DemoGym,
  whenMs: number,
  status: BookingStatus,
): CoachSessionRowFragment {
  return {
    __typename: "Booking",
    id,
    scheduledFor: iso(whenMs),
    pricePaise: COACH_ARJUN.pricePerSessionPaise,
    status,
    insured: true,
    chatUnlocked: status === BookingStatus.Confirmed,
    coach: COACH_ARJUN,
    gym,
  };
}

function razorpayOrder(amountPaise: number): {
  __typename: "RazorpayOrder";
  orderId: string;
  amountPaise: number;
  currency: string;
} {
  return {
    __typename: "RazorpayOrder",
    orderId: `order_demo_${Date.now()}`,
    amountPaise,
    currency: "INR",
  };
}

// A few pre-parsed ledger entries. One PR, one amber "uncertain" chip.
const LEDGER_PR: LedgerEntryRowFragment = {
  __typename: "LedgerEntry",
  id: "ledger_1",
  isPR: true,
  loggedByCoach: false,
  loggedAt: iso(NOW - 90 * MIN),
  chip: {
    __typename: "WorkoutChip",
    kind: WorkoutKind.Strength,
    exercise: "Bench press",
    sets: 5,
    reps: 5,
    weightKg: 82.5,
    distanceKm: null,
    durationMin: null,
    uncertain: false,
    note: "New 5RM",
    raw: "bench 5x5 82.5kg",
  },
};
const LEDGER_SQUAT: LedgerEntryRowFragment = {
  __typename: "LedgerEntry",
  id: "ledger_2",
  isPR: false,
  loggedByCoach: true,
  loggedAt: iso(NOW - 80 * MIN),
  chip: {
    __typename: "WorkoutChip",
    kind: WorkoutKind.Strength,
    exercise: "Back squat",
    sets: 4,
    reps: 8,
    weightKg: 100,
    distanceKm: null,
    durationMin: null,
    uncertain: false,
    note: null,
    raw: "squat 4x8 100kg",
  },
};
const LEDGER_UNCERTAIN: LedgerEntryRowFragment = {
  __typename: "LedgerEntry",
  id: "ledger_3",
  isPR: false,
  loggedByCoach: false,
  loggedAt: iso(NOW - 70 * MIN),
  // Deliberately ambiguous -> amber "?" chip.
  chip: chipFromText("some rows heavy-ish"),
};
const LEDGER_DEADLIFT: LedgerEntryRowFragment = {
  __typename: "LedgerEntry",
  id: "ledger_h1",
  isPR: true,
  loggedByCoach: false,
  loggedAt: iso(NOW - 6 * DAY),
  chip: {
    __typename: "WorkoutChip",
    kind: WorkoutKind.Strength,
    exercise: "Deadlift",
    sets: 3,
    reps: 3,
    weightKg: 150,
    distanceKm: null,
    durationMin: null,
    uncertain: false,
    note: "Belt on",
    raw: "deadlift 3x3 150kg",
  },
};
const LEDGER_RUN: LedgerEntryRowFragment = {
  __typename: "LedgerEntry",
  id: "ledger_h2",
  isPR: false,
  loggedByCoach: false,
  loggedAt: iso(NOW - 9 * DAY),
  chip: {
    __typename: "WorkoutChip",
    kind: WorkoutKind.Cardio,
    exercise: "Run",
    sets: null,
    reps: null,
    weightKg: null,
    distanceKm: 5,
    durationMin: 26,
    uncertain: false,
    note: null,
    raw: "run 5km 26min",
  },
};

const LEDGER_TODAY: LedgerEntryRowFragment[] = [LEDGER_PR, LEDGER_SQUAT, LEDGER_UNCERTAIN];
const LEDGER_HISTORY: LedgerEntryRowFragment[] = [
  LEDGER_PR,
  LEDGER_SQUAT,
  LEDGER_UNCERTAIN,
  LEDGER_DEADLIFT,
  LEDGER_RUN,
];

function leaderboardPage(selfPosition: number): LeaderboardQuery["leaderboard"]["page"] {
  const names = [
    "Vikram S.",
    "Ananya R.",
    "Rohit K.",
    "Meera N.",
    "Karan P.",
    "Divya M.",
    "Aditya J.",
    "Sneha T.",
    "Farhan A.",
    "Priya V.",
  ];
  return names.map((name, i) => {
    const position = i + 1;
    const isSelf = position === selfPosition;
    return {
      __typename: "LeaderboardEntry" as const,
      userId: isSelf ? VIEWER_ID : `lb_user_${position}`,
      displayName: isSelf ? "You" : name,
      streak: 30 - i * 2,
      totalCheckIns: 120 - i * 8,
      position,
      isSelf,
    };
  });
}

// ---------------------------------------------------------------------------
// The fixture map — one resolver per operation NAME.
// ---------------------------------------------------------------------------

export type DemoResolver = (variables: Vars) => Record<string, unknown>;

export const demoFixtures: Record<string, DemoResolver> = {
  // ----- Session / gating -----
  Viewer: () =>
    ({
      viewer: {
        __typename: "Viewer",
        id: VIEWER_ID,
        name: VIEWER_NAME,
        avatarUrl:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=60",
        tier: Tier.Premium,
        zone: "Indiranagar",
        role: UserRole.Member,
        streak: {
          __typename: "Streak",
          current: 12,
          windowDaysLeft: 4,
          bonusDaysEarned: 3,
        },
        activePass: {
          __typename: "Pass",
          id: "pass_active",
          tier: Tier.Premium,
          pack: PassPack.ThirtyDay,
          daysTotal: 30,
          daysUsed: 8,
          bonusDays: 3,
          daysLeft: 25,
          validUntil: iso(NOW + 22 * DAY),
          status: PassStatus.Active,
        },
      },
    }) satisfies ViewerQuery,

  VersionGate: () =>
    ({
      versionGate: {
        __typename: "VersionGate",
        // latest == current (0.1.0) so no update gate blocks the demo.
        latestVersion: "0.1.0",
        minSupportedVersion: "0.1.0",
      },
    }) satisfies VersionGateQuery,

  // ----- Gyms -----
  Gyms: () => ({ gyms: DEMO_GYMS }) satisfies GymsQuery,
  Gym: (v) => {
    const id = str(v.id);
    return { gym: DEMO_GYMS.find((g) => g.id === id) ?? GYM_IRON } satisfies GymQuery;
  },

  PassLadder: () =>
    ({
      passLadder: PASS_LADDER.map((row) => ({
        __typename: "PassLadderRow" as const,
        pack: PACK_ENUM[row.pack],
        days: row.days,
        pricePaise: passPrice("PREMIUM", row.pack),
        perDayPaise: passPerDayPrice("PREMIUM", row.pack),
        badge: row.badge ?? null,
        rankMultiplier: row.rankMultiplier ?? null,
        emphasized: row.emphasized ?? false,
      })),
    }) satisfies PassLadderQuery,

  // ----- Coaches -----
  Coaches: (v) => {
    const specialty = str(v.specialty)?.toLowerCase();
    const femaleOnly = v.femaleOnly === true;
    const maxPricePaise = typeof v.maxPricePaise === "number" ? v.maxPricePaise : null;
    let coaches = DEMO_COACHES;
    if (specialty) {
      coaches = coaches.filter((c) =>
        c.specialties.some((s) => s.toLowerCase().includes(specialty)),
      );
    }
    if (femaleOnly) {
      coaches = coaches.filter((c) => c.id === "coach_neha" || c.id === "coach_sana");
    }
    if (maxPricePaise != null) {
      coaches = coaches.filter((c) => c.pricePerSessionPaise <= maxPricePaise);
    }
    return { coaches } satisfies CoachesQuery;
  },
  Coach: (v) => {
    const id = str(v.id);
    return { coach: DEMO_COACHES.find((c) => c.id === id) ?? COACH_ARJUN } satisfies CoachQuery;
  },

  // ----- Bookings & check-ins -----
  Bookings: () =>
    ({
      bookings: DEMO_BOOKINGS.map((b) => ({
        __typename: "Booking" as const,
        id: b.id,
        scheduledFor: b.scheduledFor,
        pricePaise: b.pricePaise,
        status: b.status,
        insured: b.insured,
        chatUnlocked: b.chatUnlocked,
        coach: b.coach,
        gym: b.gym,
      })),
    }) satisfies BookingsQuery,

  CheckInHistory: () =>
    ({
      checkInHistory: [
        {
          __typename: "CheckIn" as const,
          id: "checkin_1",
          gymTier: Tier.Premium,
          passTier: Tier.Premium,
          scannedAt: iso(NOW - 20 * HOUR),
          dayNumber: 8,
          topUpAmountPaise: null,
          gym: GYM_IRON,
        },
        {
          __typename: "CheckIn" as const,
          id: "checkin_2",
          gymTier: Tier.Standard,
          passTier: Tier.Premium,
          scannedAt: iso(NOW - 2 * DAY - 3 * HOUR),
          dayNumber: 7,
          topUpAmountPaise: null,
          gym: GYM_PULSE,
        },
        {
          __typename: "CheckIn" as const,
          id: "checkin_3",
          gymTier: Tier.Premium,
          passTier: Tier.Standard,
          scannedAt: iso(NOW - 4 * DAY),
          dayNumber: 6,
          topUpAmountPaise: 5900,
          gym: GYM_KARTEL,
        },
      ],
    }) satisfies CheckInHistoryQuery,

  // ----- Chat -----
  ChatInbox: () =>
    ({
      chatInbox: DEMO_BOOKINGS.map((b) => ({
        __typename: "ChatThread" as const,
        bookingId: b.id,
        chatUnlocked: b.chatUnlocked,
        coach: b.coach,
        gym: b.gym,
        lastMessage:
          DEMO_MESSAGES.filter((m) => m.bookingId === b.id).at(-1) ?? null,
      })),
    }) satisfies ChatInboxQuery,

  ChatThread: (v) => {
    const bookingId = str(v.bookingId) ?? "booking_1";
    return {
      chatThread: DEMO_MESSAGES.filter((m) => m.bookingId === bookingId),
    } satisfies ChatThreadQuery;
  },

  // ----- Ledger -----
  LedgerToday: () => ({ ledgerToday: LEDGER_TODAY }) satisfies LedgerTodayQuery,
  LedgerHistory: (v) => {
    const exercise = str(v.exercise)?.toLowerCase();
    const rows = exercise
      ? LEDGER_HISTORY.filter((e) =>
          (e.chip.exercise ?? "").toLowerCase().includes(exercise),
        )
      : LEDGER_HISTORY;
    return { ledgerHistory: rows } satisfies LedgerHistoryQuery;
  },

  // ----- Leaderboards / ranks / streak -----
  Leaderboard: (v) => {
    const segment =
      v.segment === LeaderboardSegment.State
        ? LeaderboardSegment.State
        : v.segment === LeaderboardSegment.India
          ? LeaderboardSegment.India
          : LeaderboardSegment.Zone;
    // The viewer sits mid-table for ZONE (a sticky self-row inside the page) and
    // off-page for STATE/INDIA (self surfaced separately).
    const selfInPage = segment === LeaderboardSegment.Zone;
    const scopeKey =
      segment === LeaderboardSegment.Zone
        ? "Indiranagar"
        : segment === LeaderboardSegment.State
          ? "Karnataka"
          : "IN";
    return {
      leaderboard: {
        __typename: "Leaderboard" as const,
        segment,
        scopeKey,
        season: new Date(NOW).toISOString().slice(0, 7),
        page: leaderboardPage(selfInPage ? 6 : -1),
        self: selfInPage
          ? null
          : {
              __typename: "LeaderboardEntry" as const,
              userId: VIEWER_ID,
              displayName: "You",
              streak: 12,
              totalCheckIns: 64,
              position: segment === LeaderboardSegment.State ? 214 : 4820,
              isSelf: true,
            },
      },
    } satisfies LeaderboardQuery;
  },

  RankCard: () =>
    ({
      rankCard: {
        __typename: "RankCard",
        current: "SOLDIER",
        label: "Soldier",
        next: "OPERATOR",
        weeksToNext: 3,
        streakWeeks: 9,
        thresholds: [
          { __typename: "RankThreshold", key: "RECRUIT", label: "Recruit", minWeeks: 0 },
          { __typename: "RankThreshold", key: "SOLDIER", label: "Soldier", minWeeks: 8 },
          { __typename: "RankThreshold", key: "OPERATOR", label: "Operator", minWeeks: 12 },
          { __typename: "RankThreshold", key: "ENFORCER", label: "Enforcer", minWeeks: 20 },
          { __typename: "RankThreshold", key: "KINGPIN", label: "Kingpin", minWeeks: 32 },
        ],
      },
    }) satisfies RankCardQuery,

  StreakCalendar: () => {
    // Distinct check-in instants over the last ~3 weeks for the heatmap.
    const days = [1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 15, 16, 18, 19].map((d) =>
      iso(NOW - d * DAY),
    );
    return {
      streakCalendar: {
        __typename: "StreakCalendar" as const,
        weeks: 9,
        alive: true,
        daysThisWindow: 3,
        windowDaysLeft: 4,
        bonusDaysEarned: 3,
        days,
      },
    } satisfies StreakCalendarQuery;
  },

  // ----- Notifications -----
  Notifications: () =>
    ({
      notifications: [
        {
          __typename: "AppNotification" as const,
          id: "notif_1",
          kind: NotificationKind.Streak,
          title: "4 days to keep your streak",
          body: "Check in before Sunday to bank another bonus day.",
          read: false,
          createdAt: iso(NOW - 4 * HOUR),
        },
        {
          __typename: "AppNotification" as const,
          id: "notif_2",
          kind: NotificationKind.Booking,
          title: "Session confirmed with Arjun Rao",
          body: "Wed 7:00 AM at Iron Republic. Insured and ready.",
          read: false,
          createdAt: iso(NOW - 1 * DAY),
        },
        {
          __typename: "AppNotification" as const,
          id: "notif_3",
          kind: NotificationKind.Pass,
          title: "You're on a 12-day streak",
          body: "That's 3 bonus days added to your pass. Keep going.",
          read: true,
          createdAt: iso(NOW - 3 * DAY),
        },
      ],
    }) satisfies NotificationsQuery,

  // ----- Safety -----
  TrustedContact: () =>
    ({
      trustedContact: {
        __typename: "TrustedContact",
        name: "Meera Menon",
        phone: "+91 98••• •••21",
      },
    }) satisfies TrustedContactQuery,

  Incidents: () => ({ incidents: [] }) satisfies IncidentsQuery,

  // ----- Feature flags -----
  FeatureFlags: () =>
    ({
      featureFlags: [
        { __typename: "FeatureFlag" as const, key: "coach_marketplace", enabled: true },
        { __typename: "FeatureFlag" as const, key: "territory_wars", enabled: true },
        { __typename: "FeatureFlag" as const, key: "progress_photos", enabled: true },
        { __typename: "FeatureFlag" as const, key: "referrals", enabled: true },
      ],
    }) satisfies FeatureFlagsQuery,

  // ----- Coach portal -----
  CoachDashboard: () =>
    ({
      coachDashboard: {
        __typename: "CoachDashboard",
        ratingAverage: 4.9,
        sessionsCompleted: 412,
        earningsPaise: 3840000,
        todaysSessions: [coachSession("cs_1", GYM_IRON, NOW + 2 * HOUR, BookingStatus.Confirmed)],
        pendingRequests: [
          coachSession("cs_2", GYM_KARTEL, NOW + 1 * DAY + 4 * HOUR, BookingStatus.PendingPayment),
        ],
      },
    }) satisfies CoachDashboardQuery,

  CoachCalendar: () =>
    ({
      coachCalendar: [
        coachSession("cc_1", GYM_IRON, NOW + 2 * HOUR, BookingStatus.Confirmed),
        coachSession("cc_2", GYM_IRON, NOW + 1 * DAY + 3 * HOUR, BookingStatus.Confirmed),
        coachSession("cc_3", GYM_KARTEL, NOW - 2 * DAY, BookingStatus.Completed),
      ],
    }) satisfies CoachCalendarQuery,

  CoachClients: () => ({ coachClients: DEMO_CLIENTS }) satisfies CoachClientsQuery,

  CoachClient: (v) => {
    const id = str(v.id);
    return {
      coachClient: DEMO_CLIENTS.find((c) => c.id === id) ?? CLIENT_1,
    } satisfies CoachClientQuery;
  },

  CoachEarnings: () =>
    ({
      coachEarnings: {
        __typename: "CoachEarnings",
        grossPaise: 4800000,
        takeHomePaise: 3840000,
        payoutSchedule: "Weekly, every Monday (T+2)",
        estimatedTdsPaise: 384000,
      },
    }) satisfies CoachEarningsQuery,

  CoachProfile: () => ({ coachProfile: COACH_ARJUN }) satisfies CoachProfileQuery,

  // ----- Mutations -----
  RequestOtp: () => ({ requestOtp: true }) satisfies RequestOtpMutation,

  VerifyOtp: () =>
    ({
      verifyOtp: {
        __typename: "AuthTokens",
        accessToken: "demo.access.token",
        refreshToken: "demo.refresh.token",
      },
    }) satisfies VerifyOtpMutation,

  RefreshSession: () =>
    ({
      refreshSession: {
        __typename: "AuthTokens",
        accessToken: "demo.access.token",
        refreshToken: "demo.refresh.token",
      },
    }) satisfies RefreshSessionMutation,

  SyncCheckIn: (v) => {
    const input = (v.input ?? {}) as { gymCheckInCode?: string; scannedAt?: string };
    const gym = DEMO_GYMS.find((g) => g.id === input.gymCheckInCode) ?? GYM_IRON;
    return {
      syncCheckIn: {
        __typename: "SyncCheckInResult" as const,
        checkIn: {
          __typename: "CheckIn" as const,
          id: `checkin_${Date.now()}`,
          gymTier: gym.tier,
          passTier: Tier.Premium,
          scannedAt: input.scannedAt ?? iso(NOW),
          dayNumber: 9,
          topUpAmountPaise: null,
          gym,
        },
        topUpRequired: null,
      },
    } satisfies SyncCheckInMutation;
  },

  CreatePassOrder: () =>
    ({ createPassOrder: razorpayOrder(passPrice("PREMIUM", "THIRTY_DAY")) }) satisfies CreatePassOrderMutation,

  CreateTopUpOrder: () =>
    ({ createTopUpOrder: razorpayOrder(5900) }) satisfies CreateTopUpOrderMutation,

  CreateBookingOrder: () =>
    ({ createBookingOrder: razorpayOrder(COACH_ARJUN.pricePerSessionPaise) }) satisfies CreateBookingOrderMutation,

  LogWorkout: (v) => {
    const text = str(v.text) ?? "";
    return {
      logWorkout: [
        {
          __typename: "LedgerEntry" as const,
          id: `ledger_${Date.now()}`,
          isPR: false,
          loggedByCoach: false,
          loggedAt: iso(Date.now()),
          chip: chipFromText(text),
        },
      ],
    } satisfies LogWorkoutMutation;
  },

  SendMessage: (v) => {
    const bookingId = str(v.bookingId) ?? "booking_1";
    const raw = str(v.text) ?? "";
    const masked = maskPii(raw);
    return {
      sendMessage: {
        __typename: "ChatMessage" as const,
        id: `msg_${Date.now()}`,
        bookingId,
        from: VIEWER_ID,
        text: masked,
        masked: masked !== raw,
        sentAt: iso(Date.now()),
      },
    } satisfies SendMessageMutation;
  },

  ShareLocation: () =>
    ({
      shareLocation: { __typename: "LocationShare", expiresAt: iso(NOW + 60 * MIN) },
    }) satisfies ShareLocationMutation,

  MarkNotificationRead: () =>
    ({ markNotificationRead: true }) satisfies MarkNotificationReadMutation,

  RegisterPushToken: () =>
    ({ registerPushToken: true }) satisfies RegisterPushTokenMutation,

  TriggerSos: (v) => {
    const input = (v.input ?? {}) as { kind?: SosKind; note?: string };
    return {
      triggerSos: {
        __typename: "Incident" as const,
        id: `incident_${Date.now()}`,
        kind: input.kind ?? SosKind.AlertTrustedContact,
        note: input.note ?? "Demo SOS — no alert was actually sent.",
        status: IncidentStatus.Open,
        createdAt: iso(Date.now()),
        location: null,
      },
    } satisfies TriggerSosMutation;
  },

  SetTrustedContact: () =>
    ({ setTrustedContact: true }) satisfies SetTrustedContactMutation,
};
