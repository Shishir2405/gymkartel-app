
export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface GeoPointLike {
  lat: number;
  lng: number;
}

export const DEFAULT_MAP_CENTER: LatLng = {
  latitude: 12.9716,
  longitude: 77.5946,
};

export const DEFAULT_MAP_DELTA = { latitudeDelta: 0.06, longitudeDelta: 0.06 };

function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function gymCoords(gymId: string, center: LatLng = DEFAULT_MAP_CENTER): LatLng {
  const h = hashString(gymId);
  const angle = (h % 360) * (Math.PI / 180);
  const radiusFrac = ((h >>> 9) % 1000) / 1000;
  const radiusDeg = 0.008 + radiusFrac * 0.024;
  return {
    latitude: center.latitude + Math.sin(angle) * radiusDeg,
    longitude: center.longitude + Math.cos(angle) * radiusDeg,
  };
}

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
