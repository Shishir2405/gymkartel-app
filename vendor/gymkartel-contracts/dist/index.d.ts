import { z } from 'zod';

declare const brandedId: <B extends string>(brand: B) => z.ZodBranded<z.ZodString, B>;
declare const UserId: z.ZodBranded<z.ZodString, "UserId">;
type UserId = z.infer<typeof UserId>;
declare const PassId: z.ZodBranded<z.ZodString, "PassId">;
type PassId = z.infer<typeof PassId>;
declare const GymId: z.ZodBranded<z.ZodString, "GymId">;
type GymId = z.infer<typeof GymId>;
declare const CheckInId: z.ZodBranded<z.ZodString, "CheckInId">;
type CheckInId = z.infer<typeof CheckInId>;
declare const CoachId: z.ZodBranded<z.ZodString, "CoachId">;
type CoachId = z.infer<typeof CoachId>;
declare const BookingId: z.ZodBranded<z.ZodString, "BookingId">;
type BookingId = z.infer<typeof BookingId>;
declare const Tier: z.ZodEnum<["BASIC", "STANDARD", "PREMIUM"]>;
type Tier = z.infer<typeof Tier>;
declare const TIER_RANK: Record<Tier, number>;
declare const IsoDateTime: z.ZodString;
type IsoDateTime = z.infer<typeof IsoDateTime>;
declare const Timestamps: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    updatedAt: string;
}, {
    createdAt: string;
    updatedAt: string;
}>;
declare const schemaVersion: (v: number) => z.ZodDefault<z.ZodLiteral<number>>;
declare const Zone: z.ZodBranded<z.ZodString, "Zone">;
type Zone = z.infer<typeof Zone>;
declare const IndianState: z.ZodBranded<z.ZodString, "IndianState">;
type IndianState = z.infer<typeof IndianState>;
declare const Paise: z.ZodBranded<z.ZodNumber, "Paise">;
type Paise = z.infer<typeof Paise>;
declare const GeoPoint: z.ZodObject<{
    type: z.ZodDefault<z.ZodLiteral<"Point">>;
    coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, "strip", z.ZodTypeAny, {
    type: "Point";
    coordinates: [number, number];
}, {
    coordinates: [number, number];
    type?: "Point" | undefined;
}>;
type GeoPoint = z.infer<typeof GeoPoint>;

declare const PhoneNumber: z.ZodBranded<z.ZodString, "PhoneNumber">;
type PhoneNumber = z.infer<typeof PhoneNumber>;
declare const UserRole: z.ZodEnum<["MEMBER", "COACH"]>;
type UserRole = z.infer<typeof UserRole>;
declare const HealthProfile: z.ZodObject<{
    primaryGoal: z.ZodEnum<["STRENGTH", "FAT_LOSS", "ENDURANCE", "GENERAL"]>;
    experience: z.ZodEnum<["NEW", "RETURNING", "REGULAR"]>;
    trainingDaysTarget: z.ZodNumber;
    injuriesNote: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    primaryGoal: "STRENGTH" | "FAT_LOSS" | "ENDURANCE" | "GENERAL";
    experience: "NEW" | "RETURNING" | "REGULAR";
    trainingDaysTarget: number;
    injuriesNote?: string | undefined;
}, {
    primaryGoal: "STRENGTH" | "FAT_LOSS" | "ENDURANCE" | "GENERAL";
    experience: "NEW" | "RETURNING" | "REGULAR";
    trainingDaysTarget: number;
    injuriesNote?: string | undefined;
}>;
type HealthProfile = z.infer<typeof HealthProfile>;
declare const User: z.ZodObject<{
    schemaVersion: z.ZodDefault<z.ZodLiteral<number>>;
    id: z.ZodBranded<z.ZodString, "UserId">;
    phone: z.ZodBranded<z.ZodString, "PhoneNumber">;
    role: z.ZodDefault<z.ZodEnum<["MEMBER", "COACH"]>>;
    name: z.ZodString;
    avatarUrl: z.ZodOptional<z.ZodString>;
    tier: z.ZodEnum<["BASIC", "STANDARD", "PREMIUM"]>;
    zone: z.ZodBranded<z.ZodString, "Zone">;
    state: z.ZodBranded<z.ZodString, "IndianState">;
    health: z.ZodOptional<z.ZodObject<{
        primaryGoal: z.ZodEnum<["STRENGTH", "FAT_LOSS", "ENDURANCE", "GENERAL"]>;
        experience: z.ZodEnum<["NEW", "RETURNING", "REGULAR"]>;
        trainingDaysTarget: z.ZodNumber;
        injuriesNote: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        primaryGoal: "STRENGTH" | "FAT_LOSS" | "ENDURANCE" | "GENERAL";
        experience: "NEW" | "RETURNING" | "REGULAR";
        trainingDaysTarget: number;
        injuriesNote?: string | undefined;
    }, {
        primaryGoal: "STRENGTH" | "FAT_LOSS" | "ENDURANCE" | "GENERAL";
        experience: "NEW" | "RETURNING" | "REGULAR";
        trainingDaysTarget: number;
        injuriesNote?: string | undefined;
    }>>;
    trustedContact: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodBranded<z.ZodString, "PhoneNumber">;
    }, "strip", z.ZodTypeAny, {
        phone: string & z.BRAND<"PhoneNumber">;
        name: string;
    }, {
        phone: string;
        name: string;
    }>>;
    phoneVerifiedAt: z.ZodOptional<z.ZodString>;
} & {
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    updatedAt: string;
    schemaVersion: number;
    id: string & z.BRAND<"UserId">;
    phone: string & z.BRAND<"PhoneNumber">;
    role: "MEMBER" | "COACH";
    name: string;
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    zone: string & z.BRAND<"Zone">;
    state: string & z.BRAND<"IndianState">;
    avatarUrl?: string | undefined;
    health?: {
        primaryGoal: "STRENGTH" | "FAT_LOSS" | "ENDURANCE" | "GENERAL";
        experience: "NEW" | "RETURNING" | "REGULAR";
        trainingDaysTarget: number;
        injuriesNote?: string | undefined;
    } | undefined;
    trustedContact?: {
        phone: string & z.BRAND<"PhoneNumber">;
        name: string;
    } | undefined;
    phoneVerifiedAt?: string | undefined;
}, {
    createdAt: string;
    updatedAt: string;
    id: string;
    phone: string;
    name: string;
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    zone: string;
    state: string;
    schemaVersion?: number | undefined;
    role?: "MEMBER" | "COACH" | undefined;
    avatarUrl?: string | undefined;
    health?: {
        primaryGoal: "STRENGTH" | "FAT_LOSS" | "ENDURANCE" | "GENERAL";
        experience: "NEW" | "RETURNING" | "REGULAR";
        trainingDaysTarget: number;
        injuriesNote?: string | undefined;
    } | undefined;
    trustedContact?: {
        phone: string;
        name: string;
    } | undefined;
    phoneVerifiedAt?: string | undefined;
}>;
type User = z.infer<typeof User>;

declare const PassPack: z.ZodEnum<["SINGLE_DAY", "SEVEN_DAY", "FIFTEEN_DAY", "THIRTY_DAY"]>;
type PassPack = z.infer<typeof PassPack>;
declare const PASS_PACK_DAYS: Record<PassPack, number>;
declare const Pass: z.ZodObject<{
    schemaVersion: z.ZodDefault<z.ZodLiteral<number>>;
    id: z.ZodBranded<z.ZodString, "PassId">;
    userId: z.ZodBranded<z.ZodString, "UserId">;
    tier: z.ZodEnum<["BASIC", "STANDARD", "PREMIUM"]>;
    pack: z.ZodEnum<["SINGLE_DAY", "SEVEN_DAY", "FIFTEEN_DAY", "THIRTY_DAY"]>;
    daysTotal: z.ZodNumber;
    daysUsed: z.ZodNumber;
    bonusDays: z.ZodDefault<z.ZodNumber>;
    purchasedAt: z.ZodString;
    validUntil: z.ZodString;
    status: z.ZodEnum<["ACTIVE", "EXPIRED", "EXHAUSTED"]>;
    orderId: z.ZodString;
} & {
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "ACTIVE" | "EXPIRED" | "EXHAUSTED";
    createdAt: string;
    updatedAt: string;
    schemaVersion: number;
    id: string & z.BRAND<"PassId">;
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    userId: string & z.BRAND<"UserId">;
    pack: "SINGLE_DAY" | "SEVEN_DAY" | "FIFTEEN_DAY" | "THIRTY_DAY";
    daysTotal: number;
    daysUsed: number;
    bonusDays: number;
    purchasedAt: string;
    validUntil: string;
    orderId: string;
}, {
    status: "ACTIVE" | "EXPIRED" | "EXHAUSTED";
    createdAt: string;
    updatedAt: string;
    id: string;
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    userId: string;
    pack: "SINGLE_DAY" | "SEVEN_DAY" | "FIFTEEN_DAY" | "THIRTY_DAY";
    daysTotal: number;
    daysUsed: number;
    purchasedAt: string;
    validUntil: string;
    orderId: string;
    schemaVersion?: number | undefined;
    bonusDays?: number | undefined;
}>;
type Pass = z.infer<typeof Pass>;

declare const Amenity: z.ZodEnum<["PARKING", "SHOWERS", "LOCKERS", "CARDIO", "FREE_WEIGHTS", "CROSSFIT", "SAUNA", "POOL", "PT_AVAILABLE"]>;
type Amenity = z.infer<typeof Amenity>;
declare const Gym: z.ZodObject<{
    schemaVersion: z.ZodDefault<z.ZodLiteral<number>>;
    id: z.ZodBranded<z.ZodString, "GymId">;
    name: z.ZodString;
    tier: z.ZodEnum<["BASIC", "STANDARD", "PREMIUM"]>;
    zone: z.ZodBranded<z.ZodString, "Zone">;
    state: z.ZodBranded<z.ZodString, "IndianState">;
    location: z.ZodObject<{
        type: z.ZodDefault<z.ZodLiteral<"Point">>;
        coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    }, "strip", z.ZodTypeAny, {
        type: "Point";
        coordinates: [number, number];
    }, {
        coordinates: [number, number];
        type?: "Point" | undefined;
    }>;
    address: z.ZodString;
    amenities: z.ZodDefault<z.ZodArray<z.ZodEnum<["PARKING", "SHOWERS", "LOCKERS", "CARDIO", "FREE_WEIGHTS", "CROSSFIT", "SAUNA", "POOL", "PT_AVAILABLE"]>, "many">>;
    photoUrls: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    googlePlaceId: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
    checkInCode: z.ZodString;
    liveBusyFraction: z.ZodOptional<z.ZodNumber>;
} & {
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    updatedAt: string;
    schemaVersion: number;
    id: string & z.BRAND<"GymId">;
    name: string;
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    zone: string & z.BRAND<"Zone">;
    state: string & z.BRAND<"IndianState">;
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    address: string;
    amenities: ("PARKING" | "SHOWERS" | "LOCKERS" | "CARDIO" | "FREE_WEIGHTS" | "CROSSFIT" | "SAUNA" | "POOL" | "PT_AVAILABLE")[];
    photoUrls: string[];
    checkInCode: string;
    googlePlaceId?: string | undefined;
    rating?: number | undefined;
    liveBusyFraction?: number | undefined;
}, {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    zone: string;
    state: string;
    location: {
        coordinates: [number, number];
        type?: "Point" | undefined;
    };
    address: string;
    checkInCode: string;
    schemaVersion?: number | undefined;
    amenities?: ("PARKING" | "SHOWERS" | "LOCKERS" | "CARDIO" | "FREE_WEIGHTS" | "CROSSFIT" | "SAUNA" | "POOL" | "PT_AVAILABLE")[] | undefined;
    photoUrls?: string[] | undefined;
    googlePlaceId?: string | undefined;
    rating?: number | undefined;
    liveBusyFraction?: number | undefined;
}>;
type Gym = z.infer<typeof Gym>;

declare const CheckIn: z.ZodObject<{
    schemaVersion: z.ZodDefault<z.ZodLiteral<number>>;
    id: z.ZodBranded<z.ZodString, "CheckInId">;
    userId: z.ZodBranded<z.ZodString, "UserId">;
    gymId: z.ZodBranded<z.ZodString, "GymId">;
    passId: z.ZodBranded<z.ZodString, "PassId">;
    gymTier: z.ZodEnum<["BASIC", "STANDARD", "PREMIUM"]>;
    passTier: z.ZodEnum<["BASIC", "STANDARD", "PREMIUM"]>;
    scannedAt: z.ZodString;
    syncedAt: z.ZodOptional<z.ZodString>;
    idempotencyKey: z.ZodString;
    topUp: z.ZodOptional<z.ZodObject<{
        amount: z.ZodBranded<z.ZodNumber, "Paise">;
        orderId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        amount: number & z.BRAND<"Paise">;
    }, {
        orderId: string;
        amount: number;
    }>>;
    countedTowardStreak: z.ZodDefault<z.ZodBoolean>;
} & {
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    updatedAt: string;
    schemaVersion: number;
    id: string & z.BRAND<"CheckInId">;
    userId: string & z.BRAND<"UserId">;
    gymId: string & z.BRAND<"GymId">;
    passId: string & z.BRAND<"PassId">;
    gymTier: "BASIC" | "STANDARD" | "PREMIUM";
    passTier: "BASIC" | "STANDARD" | "PREMIUM";
    scannedAt: string;
    idempotencyKey: string;
    countedTowardStreak: boolean;
    syncedAt?: string | undefined;
    topUp?: {
        orderId: string;
        amount: number & z.BRAND<"Paise">;
    } | undefined;
}, {
    createdAt: string;
    updatedAt: string;
    id: string;
    userId: string;
    gymId: string;
    passId: string;
    gymTier: "BASIC" | "STANDARD" | "PREMIUM";
    passTier: "BASIC" | "STANDARD" | "PREMIUM";
    scannedAt: string;
    idempotencyKey: string;
    schemaVersion?: number | undefined;
    syncedAt?: string | undefined;
    topUp?: {
        orderId: string;
        amount: number;
    } | undefined;
    countedTowardStreak?: boolean | undefined;
}>;
type CheckIn = z.infer<typeof CheckIn>;
declare const CheckInSyncInput: z.ZodObject<{
    gymCheckInCode: z.ZodString;
    scannedAt: z.ZodString;
    idempotencyKey: z.ZodString;
    acceptedTopUp: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    scannedAt: string;
    idempotencyKey: string;
    gymCheckInCode: string;
    acceptedTopUp: boolean;
}, {
    scannedAt: string;
    idempotencyKey: string;
    gymCheckInCode: string;
    acceptedTopUp?: boolean | undefined;
}>;
type CheckInSyncInput = z.infer<typeof CheckInSyncInput>;

declare const CoachBadge: z.ZodEnum<["ELITE", "LEGEND"]>;
type CoachBadge = z.infer<typeof CoachBadge>;
declare const CertificationStatus: z.ZodEnum<["PENDING", "VERIFIED", "REJECTED"]>;
type CertificationStatus = z.infer<typeof CertificationStatus>;
declare const Certification: z.ZodObject<{
    title: z.ZodString;
    issuer: z.ZodString;
    documentUrl: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["PENDING", "VERIFIED", "REJECTED"]>>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "VERIFIED" | "REJECTED";
    title: string;
    issuer: string;
    documentUrl: string;
}, {
    title: string;
    issuer: string;
    documentUrl: string;
    status?: "PENDING" | "VERIFIED" | "REJECTED" | undefined;
}>;
type Certification = z.infer<typeof Certification>;
declare const Coach: z.ZodObject<{
    schemaVersion: z.ZodDefault<z.ZodLiteral<number>>;
    id: z.ZodBranded<z.ZodString, "CoachId">;
    userId: z.ZodBranded<z.ZodString, "UserId">;
    displayName: z.ZodString;
    verified: z.ZodDefault<z.ZodBoolean>;
    badge: z.ZodOptional<z.ZodEnum<["ELITE", "LEGEND"]>>;
    bio: z.ZodString;
    specialties: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    pricePerSession: z.ZodBranded<z.ZodNumber, "Paise">;
    tierFloor: z.ZodEnum<["BASIC", "STANDARD", "PREMIUM"]>;
    certifications: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        issuer: z.ZodString;
        documentUrl: z.ZodString;
        status: z.ZodDefault<z.ZodEnum<["PENDING", "VERIFIED", "REJECTED"]>>;
    }, "strip", z.ZodTypeAny, {
        status: "PENDING" | "VERIFIED" | "REJECTED";
        title: string;
        issuer: string;
        documentUrl: string;
    }, {
        title: string;
        issuer: string;
        documentUrl: string;
        status?: "PENDING" | "VERIFIED" | "REJECTED" | undefined;
    }>, "many">>;
    ratingAverage: z.ZodOptional<z.ZodNumber>;
    sessionsCompleted: z.ZodDefault<z.ZodNumber>;
    transformationPhotoUrls: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
} & {
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    updatedAt: string;
    schemaVersion: number;
    id: string & z.BRAND<"CoachId">;
    userId: string & z.BRAND<"UserId">;
    displayName: string;
    verified: boolean;
    bio: string;
    specialties: string[];
    pricePerSession: number & z.BRAND<"Paise">;
    tierFloor: "BASIC" | "STANDARD" | "PREMIUM";
    certifications: {
        status: "PENDING" | "VERIFIED" | "REJECTED";
        title: string;
        issuer: string;
        documentUrl: string;
    }[];
    sessionsCompleted: number;
    transformationPhotoUrls: string[];
    badge?: "ELITE" | "LEGEND" | undefined;
    ratingAverage?: number | undefined;
}, {
    createdAt: string;
    updatedAt: string;
    id: string;
    userId: string;
    displayName: string;
    bio: string;
    pricePerSession: number;
    tierFloor: "BASIC" | "STANDARD" | "PREMIUM";
    schemaVersion?: number | undefined;
    verified?: boolean | undefined;
    badge?: "ELITE" | "LEGEND" | undefined;
    specialties?: string[] | undefined;
    certifications?: {
        title: string;
        issuer: string;
        documentUrl: string;
        status?: "PENDING" | "VERIFIED" | "REJECTED" | undefined;
    }[] | undefined;
    ratingAverage?: number | undefined;
    sessionsCompleted?: number | undefined;
    transformationPhotoUrls?: string[] | undefined;
}>;
type Coach = z.infer<typeof Coach>;
declare const COACH_TAKE_RATE = 0.8;

declare const BookingStatus: z.ZodEnum<["PENDING_PAYMENT", "CONFIRMED", "COMPLETED", "CANCELLED_BY_MEMBER", "CANCELLED_BY_COACH"]>;
type BookingStatus = z.infer<typeof BookingStatus>;
declare const Booking: z.ZodObject<{
    schemaVersion: z.ZodDefault<z.ZodLiteral<number>>;
    id: z.ZodBranded<z.ZodString, "BookingId">;
    memberId: z.ZodBranded<z.ZodString, "UserId">;
    coachId: z.ZodBranded<z.ZodString, "CoachId">;
    gymId: z.ZodBranded<z.ZodString, "GymId">;
    scheduledFor: z.ZodString;
    price: z.ZodBranded<z.ZodNumber, "Paise">;
    status: z.ZodEnum<["PENDING_PAYMENT", "CONFIRMED", "COMPLETED", "CANCELLED_BY_MEMBER", "CANCELLED_BY_COACH"]>;
    orderId: z.ZodString;
    insured: z.ZodDefault<z.ZodBoolean>;
    chatUnlockedAt: z.ZodOptional<z.ZodString>;
} & {
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "PENDING_PAYMENT" | "CONFIRMED" | "COMPLETED" | "CANCELLED_BY_MEMBER" | "CANCELLED_BY_COACH";
    createdAt: string;
    updatedAt: string;
    schemaVersion: number;
    id: string & z.BRAND<"BookingId">;
    orderId: string;
    gymId: string & z.BRAND<"GymId">;
    memberId: string & z.BRAND<"UserId">;
    coachId: string & z.BRAND<"CoachId">;
    scheduledFor: string;
    price: number & z.BRAND<"Paise">;
    insured: boolean;
    chatUnlockedAt?: string | undefined;
}, {
    status: "PENDING_PAYMENT" | "CONFIRMED" | "COMPLETED" | "CANCELLED_BY_MEMBER" | "CANCELLED_BY_COACH";
    createdAt: string;
    updatedAt: string;
    id: string;
    orderId: string;
    gymId: string;
    memberId: string;
    coachId: string;
    scheduledFor: string;
    price: number;
    schemaVersion?: number | undefined;
    insured?: boolean | undefined;
    chatUnlockedAt?: string | undefined;
}>;
type Booking = z.infer<typeof Booking>;

declare const TIER_DAY_RATE: Record<Tier, Paise>;
declare const passPrice: (tier: Tier, pack: PassPack) => Paise;
declare const passPerDayPrice: (tier: Tier, pack: PassPack) => Paise;
type PassPackLadderRow = {
    pack: PassPack;
    days: number;
    badge?: "MOST_CHOSEN" | "BEST_RATE";
    rankMultiplier?: number;
    emphasized?: boolean;
};
declare const PASS_LADDER: readonly PassPackLadderRow[];
declare const topUpCost: (passTier: Tier, gymTier: Tier) => Paise | null;

export { Amenity, Booking, BookingId, BookingStatus, COACH_TAKE_RATE, Certification, CertificationStatus, CheckIn, CheckInId, CheckInSyncInput, Coach, CoachBadge, CoachId, GeoPoint, Gym, GymId, HealthProfile, IndianState, IsoDateTime, PASS_LADDER, PASS_PACK_DAYS, Paise, Pass, PassId, PassPack, type PassPackLadderRow, PhoneNumber, TIER_DAY_RATE, TIER_RANK, Tier, Timestamps, User, UserId, UserRole, Zone, brandedId, passPerDayPrice, passPrice, schemaVersion, topUpCost };
