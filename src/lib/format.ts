/**
 * Presentation helpers. Money always arrives as paise (integer) from the
 * contract and is only ever formatted here — never computed at a call site.
 */

/** Paise -> "₹1,299". Whole rupees; India grouping. */
export function formatRupees(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/** Paise -> "₹99/day" style per-day label. */
export function formatPerDay(paise: number): string {
  return `${formatRupees(paise)}/day`;
}

/** ISO datetime -> "Tue, 15 Jul". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** ISO datetime -> "6:30 PM". */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

/** Distance in meters -> "1.2 km" / "450 m". */
export function formatDistance(meters: number | null | undefined): string {
  if (meters == null) return "";
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

/** Time-of-day greeting for Home ("Morning" / "Evening"). */
export function greeting(now: Date = new Date()): "Morning" | "Afternoon" | "Evening" {
  const h = now.getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

/** Live-busy fraction -> plain human label. */
export function busyLabel(fraction: number | null | undefined): string {
  if (fraction == null) return "Unknown";
  if (fraction < 0.34) return "Quiet";
  if (fraction < 0.67) return "Steady";
  return "Busy";
}
