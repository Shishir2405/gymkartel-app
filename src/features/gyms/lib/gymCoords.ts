/**
 * Gym coordinates for the map.
 *
 * The GraphQL `Gym` type does not (yet) expose the gym's `location` GeoPoint —
 * it lives on the domain model but is not in the wire schema, and the backend
 * is out of scope for this pass. So markers are placed at STABLE, deterministic
 * pseudo-coordinates derived from the gym id, scattered in a tight ring around a
 * city centre. This keeps the map honest (same gym always lands in the same
 * spot, distinct gyms don't overlap) without inventing precise addresses.
 *
 * TODO(backend): expose `location { lat lng }` on the `Gym` type, add it to the
 * GymCard fragment, and read the real coordinates here instead of hashing the id.
 */

export interface LatLng {
  latitude: number;
  longitude: number;
}

/** Default map centre when we have no better anchor (central Bengaluru). */
export const DEFAULT_MAP_CENTER: LatLng = {
  latitude: 12.9716,
  longitude: 77.5946,
};

/** A calm city-scale zoom for the list/detail maps. */
export const DEFAULT_MAP_DELTA = { latitudeDelta: 0.06, longitudeDelta: 0.06 };

/** Deterministic 32-bit hash of a string (FNV-1a). */
function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Map a gym id to a stable point around `center`. The hash seeds an angle and a
 * radius (up to ~3.5 km) so gyms fan out around the centre without clustering.
 */
export function gymCoords(gymId: string, center: LatLng = DEFAULT_MAP_CENTER): LatLng {
  const h = hashString(gymId);
  const angle = (h % 360) * (Math.PI / 180);
  // Second, independent draw for the radius from the upper bits.
  const radiusFrac = ((h >>> 9) % 1000) / 1000;
  const radiusDeg = 0.008 + radiusFrac * 0.024; // ~0.9km .. ~3.5km
  return {
    latitude: center.latitude + Math.sin(angle) * radiusDeg,
    longitude: center.longitude + Math.cos(angle) * radiusDeg,
  };
}
