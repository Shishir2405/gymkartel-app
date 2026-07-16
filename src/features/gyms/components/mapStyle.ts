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
