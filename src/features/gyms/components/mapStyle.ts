/**
 * Soft-Dark Luxury map style for react-native-maps (Google provider).
 *
 * The land is our base/raised greys (#141416 / #1C1C1F), roads are hairline
 * strokes on the same palette, water sinks to the pressed surface, and every
 * bright POI / transit / business marker is silenced so the ONLY colour on the
 * map is the accent orange we paint on the selected gym marker (golden rule:
 * one orange element per screen). Apple Maps (the iOS default here) is dark by
 * virtue of `userInterfaceStyle: "dark"`, so this JSON drives the Google
 * provider on Android.
 */
export const darkMapStyle: ReadonlyArray<Record<string, unknown>> = [
  { elementType: "geometry", stylers: [{ color: "#141416" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9A9A9E" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#141416" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#2A2A2E" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [{ visibility: "off" }],
  },
  {
    // Silence every point-of-interest so nothing competes with the orange.
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1C1C1F" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1C1C1F" }],
  },
  {
    // Hairline road strokes — same token as our 1px card borders.
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2A2A2E" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#55555A" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#26262B" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#111113" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#55555A" }],
  },
];
