import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { MapTrifold } from "phosphor-react-native";
import type { Region, MapStyleElement } from "react-native-maps";
import { Text, colors, radius, spacing } from "@/ui";
import { IS_DEMO } from "@/config/appMode";
import { darkMapStyle } from "./mapStyle";
import {
  resolveGymCoords,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_DELTA,
  type LatLng,
  type GeoPointLike,
} from "@/features/gyms/lib/gymCoords";

export interface GymMapMarker {
  id: string;
  name: string;
  coords?: LatLng;
  location?: GeoPointLike | null;
}

export interface GymMapProps {
  markers: readonly GymMapMarker[];
  selectedGymId?: string | null;
  onSelectMarker?: (gymId: string) => void;
  onPressMap?: () => void;
  height?: number;
  interactive?: boolean;
  center?: LatLng;
  fallbackBody?: string;
  testID?: string;
}

type MapsModule = typeof import("react-native-maps");
function loadMaps(): MapsModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("react-native-maps") as MapsModule;
    return mod && mod.default ? mod : null;
  } catch {
    return null;
  }
}
const Maps = loadMaps();

export function GymMap({
  markers,
  selectedGymId,
  onSelectMarker,
  onPressMap,
  height = 200,
  interactive = true,
  center = DEFAULT_MAP_CENTER,
  fallbackBody = "Map view is coming. Browse the list below for now — distances are from your zone.",
  testID,
}: GymMapProps) {
  if (IS_DEMO || !Maps) {
    const fallback = (
      <GymMapFallback height={height} body={fallbackBody} {...(testID ? { testID } : {})} />
    );
    return onPressMap ? (
      <Pressable accessibilityRole="button" accessibilityLabel="Open in maps" onPress={onPressMap}>
        {fallback}
      </Pressable>
    ) : (
      fallback
    );
  }

  const MapView = Maps.default;
  const { Marker } = Maps;
  const region: Region = {
    latitude: center.latitude,
    longitude: center.longitude,
    ...DEFAULT_MAP_DELTA,
  };

  const map = (
    <MapView
      testID={testID ?? "gym-map"}
      style={[styles.map, { height }]}
      initialRegion={region}
      customMapStyle={darkMapStyle as unknown as MapStyleElement[]}
      provider={Platform.OS === "android" ? Maps.PROVIDER_GOOGLE : undefined}
      pitchEnabled={false}
      rotateEnabled={false}
      scrollEnabled={interactive}
      zoomEnabled={interactive}
      toolbarEnabled={false}
      showsCompass={false}
      showsPointsOfInterests={false}
      showsBuildings={false}
    >
      {markers.map((m) => {
        const selected = m.id === selectedGymId;
        return (
          <Marker
            key={m.id}
            testID={`gym-marker-${m.id}`}
            coordinate={m.coords ?? resolveGymCoords(m.id, m.location, center)}
            title={m.name}
            tracksViewChanges={false}
            {...(onSelectMarker ? { onPress: () => onSelectMarker(m.id) } : {})}
          >
            <View style={[styles.pin, selected ? styles.pinSelected : styles.pinMuted]}>
              <View style={[styles.pinDot, selected ? styles.pinDotSelected : styles.pinDotMuted]} />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );

  if (!interactive && onPressMap) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open in maps"
        onPress={onPressMap}
        style={[styles.snippet, { height }]}
      >
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {map}
        </View>
      </Pressable>
    );
  }

  return <View style={[styles.snippet, { height }]}>{map}</View>;
}

export function GymMapFallback({
  height = 200,
  body,
  testID,
}: {
  height?: number;
  body: string;
  testID?: string;
}) {
  return (
    <View style={[styles.fallback, { height }]} testID={testID ? `${testID}-fallback` : "gym-map-fallback"}>
      <MapTrifold size={22} color={colors.text.secondary} weight="regular" />
      <Text preset="body" color="secondary" style={styles.fallbackText}>
        {body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  snippet: {
    borderRadius: radius.card,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
  },
  map: { width: "100%" },
  fallback: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.stroke.hairline,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: spacing.lg,
  },
  fallbackText: { flex: 1 },
  pin: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  pinMuted: {
    backgroundColor: colors.surface.raised,
    borderColor: colors.stroke.hairline,
  },
  pinSelected: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  pinDot: { width: 8, height: 8, borderRadius: radius.pill },
  pinDotMuted: { backgroundColor: colors.text.secondary },
  pinDotSelected: { backgroundColor: colors.text.primary },
});
