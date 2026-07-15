import {
  Car,
  Drop,
  Lockers,
  Heartbeat,
  Barbell,
  PersonSimpleRun,
  Thermometer,
  SwimmingPool,
  Users,
  Sparkle,
} from "phosphor-react-native";
import type { PhosphorIcon } from "@/ui";

/**
 * The nine amenities a gym can advertise (mirrors the contract `Amenity` enum),
 * each mapped to a phosphor glyph and a plain human label. Gym amenities arrive
 * from GraphQL as `string[]`, so lookups accept any string and fall back to a
 * neutral sparkle for anything unknown.
 */
export const AMENITY_ORDER = [
  "PARKING",
  "SHOWERS",
  "LOCKERS",
  "CARDIO",
  "FREE_WEIGHTS",
  "CROSSFIT",
  "SAUNA",
  "POOL",
  "PT_AVAILABLE",
] as const;

export type Amenity = (typeof AMENITY_ORDER)[number];

const ICONS: Record<Amenity, PhosphorIcon> = {
  PARKING: Car,
  SHOWERS: Drop,
  LOCKERS: Lockers,
  CARDIO: Heartbeat,
  FREE_WEIGHTS: Barbell,
  CROSSFIT: PersonSimpleRun,
  SAUNA: Thermometer,
  POOL: SwimmingPool,
  PT_AVAILABLE: Users,
};

const LABELS: Record<Amenity, string> = {
  PARKING: "Parking",
  SHOWERS: "Showers",
  LOCKERS: "Lockers",
  CARDIO: "Cardio",
  FREE_WEIGHTS: "Free weights",
  CROSSFIT: "Crossfit",
  SAUNA: "Sauna",
  POOL: "Pool",
  PT_AVAILABLE: "PT available",
};

/** Phosphor glyph for an amenity code (falls back to a neutral sparkle). */
export function useAmenityIcon(amenity: string): PhosphorIcon {
  return ICONS[amenity as Amenity] ?? Sparkle;
}

/** Plain human label for an amenity code (title-cases anything unknown). */
export function amenityLabel(amenity: string): string {
  return (
    LABELS[amenity as Amenity] ??
    amenity
      .toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}
