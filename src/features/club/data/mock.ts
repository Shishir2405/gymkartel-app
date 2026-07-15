/**
 * Local mock data for the CLUB feature. Rank / leaderboard / territory / card
 * data has no server query yet, so everything here is typed cleanly and treated
 * as the single source of truth for the club screens. When a real API lands,
 * swap these constants for generated hooks — the screen types will not change.
 */

// ---- Rank ladder -----------------------------------------------------------

export interface Rank {
  /** Display name, e.g. "SCOUT". */
  readonly name: string;
  /** Cumulative check-ins required to hold this rank. */
  readonly checkInsRequired: number;
}

/** The full rank ladder, ascending. First entry is the entry rank. */
export const RANK_LADDER: readonly Rank[] = [
  { name: "SCOUT", checkInsRequired: 0 },
  { name: "OPERATOR", checkInsRequired: 30 },
  { name: "ENFORCER", checkInsRequired: 75 },
  { name: "CAPTAIN", checkInsRequired: 150 },
  { name: "BOSS", checkInsRequired: 300 },
  { name: "KINGPIN", checkInsRequired: 600 },
];

/** The viewer's lifetime check-in count (mock). Drives current rank + progress. */
export const MOCK_CHECK_INS = 18;

export interface RankProgress {
  readonly current: Rank;
  /** Null when already at the top of the ladder. */
  readonly next: Rank | null;
  /** Progress toward the next rank, 0..1. Full (1) at the top rank. */
  readonly fraction: number;
  /** Check-ins remaining to reach the next rank. Zero at the top rank. */
  readonly remaining: number;
}

/** Compute the current rank and progress toward the next from a check-in count. */
export function rankProgress(checkIns: number): RankProgress {
  const entry = RANK_LADDER[0];
  // RANK_LADDER is a non-empty constant; guard for the type checker only.
  if (!entry) {
    return {
      current: { name: "SCOUT", checkInsRequired: 0 },
      next: null,
      fraction: 1,
      remaining: 0,
    };
  }

  let current: Rank = entry;
  let next: Rank | null = null;
  for (let i = 0; i < RANK_LADDER.length; i++) {
    const row = RANK_LADDER[i];
    if (!row) continue;
    if (checkIns >= row.checkInsRequired) {
      current = row;
      next = RANK_LADDER[i + 1] ?? null;
    }
  }

  if (!next) {
    return { current, next: null, fraction: 1, remaining: 0 };
  }

  const span = next.checkInsRequired - current.checkInsRequired;
  const done = checkIns - current.checkInsRequired;
  const fraction = span > 0 ? Math.max(0, Math.min(1, done / span)) : 1;
  const remaining = Math.max(0, next.checkInsRequired - checkIns);
  return { current, next, fraction, remaining };
}

// ---- Streak calendar -------------------------------------------------------

/** The month rendered by the streak calendar (mock). July 2026. */
export const CALENDAR_YEAR = 2026;
/** Zero-based month index. 6 = July. */
export const CALENDAR_MONTH = 6;
/** The day-of-month treated as "today" for the mock calendar. */
export const CALENDAR_TODAY = 15;
/** The current active streak length, in days (mock). */
export const MOCK_STREAK_DAYS = 6;
/** Days of the month with a recorded check-in (mock). */
export const CHECK_IN_DAYS: readonly number[] = [
  2, 3, 5, 6, 8, 9, 10, 12, 13, 15,
];

// ---- Leaderboards ----------------------------------------------------------

export type LeaderboardScope = "ZONE" | "STATE" | "INDIA";

export interface LeaderboardEntry {
  readonly id: string;
  readonly rank: number;
  readonly name: string;
  readonly zone: string;
  readonly checkIns: number;
  /** True for the viewer's own row (pinned at the bottom). */
  readonly isViewer?: boolean;
}

/** The viewer's id, used to pin their own row across scopes. */
export const VIEWER_ID = "you";

const ZONE_BOARD: readonly LeaderboardEntry[] = [
  { id: "z1", rank: 1, name: "Arjun Nair", zone: "Bandra", checkIns: 61 },
  { id: "z2", rank: 2, name: "Sana Kapoor", zone: "Bandra", checkIns: 58 },
  { id: "z3", rank: 3, name: "Vikram Rao", zone: "Bandra", checkIns: 54 },
  { id: "z4", rank: 4, name: "Neha Iyer", zone: "Bandra", checkIns: 49 },
  { id: "z5", rank: 5, name: "Karan Mehta", zone: "Bandra", checkIns: 41 },
  { id: "z6", rank: 6, name: "Divya Shah", zone: "Bandra", checkIns: 33 },
  {
    id: VIEWER_ID,
    rank: 9,
    name: "You",
    zone: "Bandra",
    checkIns: 18,
    isViewer: true,
  },
];

const STATE_BOARD: readonly LeaderboardEntry[] = [
  { id: "s1", rank: 1, name: "Rohit Desai", zone: "Pune West", checkIns: 88 },
  { id: "s2", rank: 2, name: "Arjun Nair", zone: "Bandra", checkIns: 61 },
  { id: "s3", rank: 3, name: "Meera Joshi", zone: "Andheri", checkIns: 60 },
  { id: "s4", rank: 4, name: "Sana Kapoor", zone: "Bandra", checkIns: 58 },
  { id: "s5", rank: 5, name: "Aditya Kulkarni", zone: "Thane", checkIns: 52 },
  { id: "s6", rank: 6, name: "Priya Menon", zone: "Nashik", checkIns: 47 },
  {
    id: VIEWER_ID,
    rank: 214,
    name: "You",
    zone: "Bandra",
    checkIns: 18,
    isViewer: true,
  },
];

const INDIA_BOARD: readonly LeaderboardEntry[] = [
  { id: "i1", rank: 1, name: "Sameer Khan", zone: "Delhi South", checkIns: 122 },
  { id: "i2", rank: 2, name: "Rohit Desai", zone: "Pune West", checkIns: 88 },
  { id: "i3", rank: 3, name: "Lakshmi Rao", zone: "Chennai", checkIns: 84 },
  { id: "i4", rank: 4, name: "Imran Sheikh", zone: "Hyderabad", checkIns: 79 },
  { id: "i5", rank: 5, name: "Ananya Bose", zone: "Kolkata", checkIns: 71 },
  { id: "i6", rank: 6, name: "Kabir Singh", zone: "Bengaluru", checkIns: 68 },
  {
    id: VIEWER_ID,
    rank: 4820,
    name: "You",
    zone: "Bandra",
    checkIns: 18,
    isViewer: true,
  },
];

export function leaderboardFor(scope: LeaderboardScope): readonly LeaderboardEntry[] {
  switch (scope) {
    case "ZONE":
      return ZONE_BOARD;
    case "STATE":
      return STATE_BOARD;
    case "INDIA":
      return INDIA_BOARD;
  }
}

/** Days left in the current leaderboard season (mock). */
export const SEASON_DAYS_LEFT = 12;

// ---- Territory wars --------------------------------------------------------

export interface Territory {
  readonly id: string;
  readonly zone: string;
  /** Aggregate check-ins the zone has logged this cycle. */
  readonly checkIns: number;
  /** True for the viewer's home zone. */
  readonly isYours?: boolean;
}

/** Zones competing this cycle, richest first (mock). */
export const TERRITORIES: readonly Territory[] = [
  { id: "t1", zone: "Andheri", checkIns: 4210 },
  { id: "t2", zone: "Bandra", checkIns: 3980, isYours: true },
  { id: "t3", zone: "Powai", checkIns: 3510 },
  { id: "t4", zone: "Thane", checkIns: 2940 },
  { id: "t5", zone: "Dadar", checkIns: 2205 },
];

// ---- Card gallery ----------------------------------------------------------

export interface CollectibleCard {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly earned: boolean;
  /** Requirement copy shown for locked cards. */
  readonly requirement: string;
}

export const CARDS: readonly CollectibleCard[] = [
  {
    id: "c1",
    title: "First Entry",
    detail: "Logged your first check-in.",
    earned: true,
    requirement: "Check in once.",
  },
  {
    id: "c2",
    title: "Held Week",
    detail: "Held a streak for one full week.",
    earned: true,
    requirement: "Hold a streak for seven days.",
  },
  {
    id: "c3",
    title: "Dawn Patrol",
    detail: "Checked in before 7 am, five times.",
    earned: true,
    requirement: "Check in before 7 am, five times.",
  },
  {
    id: "c4",
    title: "Zone Regular",
    detail: "Twenty check-ins at one gym.",
    earned: false,
    requirement: "Log twenty check-ins at a single gym.",
  },
  {
    id: "c5",
    title: "Recruiter",
    detail: "Bring in your first member.",
    earned: false,
    requirement: "Invite a member who buys a pass.",
  },
  {
    id: "c6",
    title: "Operator",
    detail: "Reach the OPERATOR rank.",
    earned: false,
    requirement: "Reach thirty lifetime check-ins.",
  },
];

// ---- Recruit ---------------------------------------------------------------

/** The viewer's referral code (mock). */
export const REFERRAL_CODE = "RAVI-4471";
