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

export function useAmenityIcon(amenity: string): PhosphorIcon {
  return ICONS[amenity as Amenity] ?? Sparkle;
}

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
