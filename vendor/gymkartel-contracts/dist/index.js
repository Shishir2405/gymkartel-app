import { z } from 'zod';

// src/domain/common.ts
var brandedId = (brand) => z.string().min(1).brand(brand);
var UserId = brandedId("UserId");
var PassId = brandedId("PassId");
var GymId = brandedId("GymId");
var CheckInId = brandedId("CheckInId");
var CoachId = brandedId("CoachId");
var BookingId = brandedId("BookingId");
var Tier = z.enum(["BASIC", "STANDARD", "PREMIUM"]);
var TIER_RANK = {
  BASIC: 0,
  STANDARD: 1,
  PREMIUM: 2
};
var IsoDateTime = z.string().datetime({ offset: true });
var Timestamps = z.object({
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime
});
var schemaVersion = (v) => z.literal(v).default(v);
var Zone = z.string().min(1).brand("Zone");
var IndianState = z.string().min(1).brand("IndianState");
var Paise = z.number().int().nonnegative().brand("Paise");
var GeoPoint = z.object({
  type: z.literal("Point").default("Point"),
  coordinates: z.tuple([z.number(), z.number()])
});
var PhoneNumber = z.string().regex(/^\+91[6-9]\d{9}$/, "must be a +91 Indian mobile number").brand("PhoneNumber");
var UserRole = z.enum(["MEMBER", "COACH"]);
var HealthProfile = z.object({
  primaryGoal: z.enum(["STRENGTH", "FAT_LOSS", "ENDURANCE", "GENERAL"]),
  experience: z.enum(["NEW", "RETURNING", "REGULAR"]),
  trainingDaysTarget: z.number().int().min(1).max(7),
  injuriesNote: z.string().max(280).optional()
});
var User = z.object({
  schemaVersion: schemaVersion(1),
  id: UserId,
  phone: PhoneNumber,
  role: UserRole.default("MEMBER"),
  name: z.string().min(1).max(80),
  avatarUrl: z.string().url().optional(),
  tier: Tier,
  zone: Zone,
  state: IndianState,
  health: HealthProfile.optional(),
  trustedContact: z.object({ name: z.string().min(1), phone: PhoneNumber }).optional(),
  phoneVerifiedAt: z.string().datetime({ offset: true }).optional()
}).merge(Timestamps);
var PassPack = z.enum(["SINGLE_DAY", "SEVEN_DAY", "FIFTEEN_DAY", "THIRTY_DAY"]);
var PASS_PACK_DAYS = {
  SINGLE_DAY: 1,
  SEVEN_DAY: 7,
  FIFTEEN_DAY: 15,
  THIRTY_DAY: 30
};
var Pass = z.object({
  schemaVersion: schemaVersion(1),
  id: PassId,
  userId: UserId,
  tier: Tier,
  pack: PassPack,
  daysTotal: z.number().int().positive(),
  daysUsed: z.number().int().nonnegative(),
  bonusDays: z.number().int().nonnegative().default(0),
  purchasedAt: z.string().datetime({ offset: true }),
  validUntil: z.string().datetime({ offset: true }),
  status: z.enum(["ACTIVE", "EXPIRED", "EXHAUSTED"]),
  orderId: z.string().min(1)
}).merge(Timestamps);
var Amenity = z.enum([
  "PARKING",
  "SHOWERS",
  "LOCKERS",
  "CARDIO",
  "FREE_WEIGHTS",
  "CROSSFIT",
  "SAUNA",
  "POOL",
  "PT_AVAILABLE"
]);
var Gym = z.object({
  schemaVersion: schemaVersion(1),
  id: GymId,
  name: z.string().min(1),
  tier: Tier,
  zone: Zone,
  state: IndianState,
  location: GeoPoint,
  address: z.string().min(1),
  amenities: z.array(Amenity).default([]),
  photoUrls: z.array(z.string().url()).default([]),
  googlePlaceId: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  checkInCode: z.string().min(1),
  liveBusyFraction: z.number().min(0).max(1).optional()
}).merge(Timestamps);
var CheckIn = z.object({
  schemaVersion: schemaVersion(1),
  id: CheckInId,
  userId: UserId,
  gymId: GymId,
  passId: PassId,
  gymTier: Tier,
  passTier: Tier,
  scannedAt: z.string().datetime({ offset: true }),
  syncedAt: z.string().datetime({ offset: true }).optional(),
  idempotencyKey: z.string().min(8),
  topUp: z.object({
    amount: Paise,
    orderId: z.string().min(1)
  }).optional(),
  countedTowardStreak: z.boolean().default(true)
}).merge(Timestamps);
var CheckInSyncInput = z.object({
  gymCheckInCode: z.string().min(1),
  scannedAt: z.string().datetime({ offset: true }),
  idempotencyKey: z.string().min(8),
  acceptedTopUp: z.boolean().default(false)
});
var CoachBadge = z.enum(["ELITE", "LEGEND"]);
var CertificationStatus = z.enum(["PENDING", "VERIFIED", "REJECTED"]);
var Certification = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  documentUrl: z.string().url(),
  status: CertificationStatus.default("PENDING")
});
var Coach = z.object({
  schemaVersion: schemaVersion(1),
  id: CoachId,
  userId: UserId,
  displayName: z.string().min(1),
  verified: z.boolean().default(false),
  badge: CoachBadge.optional(),
  bio: z.string().max(1e3),
  specialties: z.array(z.string().min(1)).default([]),
  pricePerSession: Paise,
  tierFloor: Tier,
  certifications: z.array(Certification).default([]),
  ratingAverage: z.number().min(0).max(5).optional(),
  sessionsCompleted: z.number().int().nonnegative().default(0),
  transformationPhotoUrls: z.array(z.string().url()).default([])
}).merge(Timestamps);
var COACH_TAKE_RATE = 0.8;
var BookingStatus = z.enum([
  "PENDING_PAYMENT",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED_BY_MEMBER",
  "CANCELLED_BY_COACH"
]);
var Booking = z.object({
  schemaVersion: schemaVersion(1),
  id: BookingId,
  memberId: UserId,
  coachId: CoachId,
  gymId: GymId,
  scheduledFor: z.string().datetime({ offset: true }),
  price: Paise,
  status: BookingStatus,
  orderId: z.string().min(1),
  insured: z.boolean().default(true),
  chatUnlockedAt: z.string().datetime({ offset: true }).optional()
}).merge(Timestamps);

// src/pricing.ts
var paise = (rupees) => rupees * 100;
var TIER_DAY_RATE = {
  BASIC: paise(99),
  STANDARD: paise(149),
  PREMIUM: paise(199)
};
var PACK_DISCOUNT = {
  SINGLE_DAY: 1,
  SEVEN_DAY: 0.97,
  FIFTEEN_DAY: 0.85,
  THIRTY_DAY: 0.75
};
var passPrice = (tier, pack) => {
  const perDay = TIER_DAY_RATE[tier] * PACK_DISCOUNT[pack];
  return Math.round(perDay) * PASS_PACK_DAYS[pack];
};
var passPerDayPrice = (tier, pack) => Math.round(passPrice(tier, pack) / PASS_PACK_DAYS[pack]);
var PASS_LADDER = [
  { pack: "SINGLE_DAY", days: 1 },
  { pack: "SEVEN_DAY", days: 7 },
  { pack: "FIFTEEN_DAY", days: 15, badge: "MOST_CHOSEN", emphasized: true },
  { pack: "THIRTY_DAY", days: 30, badge: "BEST_RATE", rankMultiplier: 2 }
];
var topUpCost = (passTier, gymTier) => {
  const delta = TIER_RANK[gymTier] - TIER_RANK[passTier];
  if (delta <= 0) return null;
  const key = `${passTier}->${gymTier}`;
  const matrix = {
    "BASIC->STANDARD": paise(59),
    "STANDARD->PREMIUM": paise(59),
    "BASIC->PREMIUM": paise(99)
  };
  return matrix[key] ?? null;
};

export { Amenity, Booking, BookingId, BookingStatus, COACH_TAKE_RATE, Certification, CertificationStatus, CheckIn, CheckInId, CheckInSyncInput, Coach, CoachBadge, CoachId, GeoPoint, Gym, GymId, HealthProfile, IndianState, IsoDateTime, PASS_LADDER, PASS_PACK_DAYS, Paise, Pass, PassId, PassPack, PhoneNumber, TIER_DAY_RATE, TIER_RANK, Tier, Timestamps, User, UserId, UserRole, Zone, brandedId, passPerDayPrice, passPrice, schemaVersion, topUpCost };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map