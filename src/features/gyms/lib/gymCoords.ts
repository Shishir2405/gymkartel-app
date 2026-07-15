/**
 * Gym coordinates for the map.
 *
 * The wire `Gym` type now exposes a `location { lat lng }` GeoPoint, so markers
 * use the gym's REAL coordinates whenever the backend provides them (see
 * `resolveGymCoords`). When `location` is null — an older gym record, or a query
 * that didn't select it — we fall back to STABLE, deterministic pseudo-coords
 * derived from the gym id, scattered in a tight ring around a city centre. That
 * keeps the map honest (same gym always lands in the same spot, distinct gyms
 * don't overlap) without inventing a precise address.
 */

export interface LatLng {
  latitude: number;
  longitude: number;
}

/** The wire GeoPoint shape ({ lat, lng }) as selected on `Gym.location`. */
export interface GeoPointLike {
  lat: number;
  lng: number;
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

/**
 * Resolve a gym to a map coordinate: prefer the real `location` GeoPoint from
 * the wire, and only fall back to the deterministic id hash when it is null.
 */
export function resolveGymCoords(
  gymId: string,
  location: GeoPointLike | null | undefined,
  center: LatLng = DEFAULT_MAP_CENTER,
): LatLng {
  if (location) {
    return { latitude: location.lat, longitude: location.lng };
  }
  return gymCoords(gymId, center);
}
