import React from "react";
import { Platform, StyleSheet, View, type ViewProps, type ViewStyle } from "react-native";
import { colors, neo, radius as radiusTokens, NEO_SHADOW_OPACITY } from "../tokens";

type Elevation = "raised" | "pressed" | "flat";

export interface NeoSurfaceProps extends ViewProps {
  elevation?: Elevation;
  radius?: number;
  hairline?: boolean;
  padded?: boolean;
  children?: React.ReactNode;
}

export function NeoSurface({
  elevation = "raised",
  radius = radiusTokens.card,
  hairline = true,
  padded = false,
  style,
  children,
  ...rest
}: NeoSurfaceProps) {
  const surfaceColor =
    elevation === "pressed" ? colors.surface.pressed : colors.surface.raised;

  const base: ViewStyle = {
    backgroundColor: surfaceColor,
    borderRadius: radius,
    borderWidth: hairline ? StyleSheet.hairlineWidth * 0 + 1 : 0,
    borderColor: colors.stroke.hairline,
  };

  if (elevation === "flat") {
    return (
      <View style={[base, padded && styles.pad, style]} {...rest}>
        {children}
      </View>
    );
  }

  if (elevation === "pressed") {
    return (
      <View
        style={[
          base,
          {
            borderTopColor: colors.shadow.light,
            borderLeftColor: colors.shadow.light,
            borderBottomColor: colors.shadow.dark,
            borderRightColor: colors.shadow.dark,
          },
          padded && styles.pad,
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  }

  if (Platform.OS === "android") {
    return (
      <View
        style={[
          base,
          { elevation: 6, shadowColor: colors.shadow.dark },
          padded && styles.pad,
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[{ borderRadius: radius }, style]} {...rest}>
      {}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius,
            backgroundColor: surfaceColor,
            shadowColor: colors.shadow.dark,
            shadowOffset: neo.dark.offset,
            shadowRadius: neo.dark.radius,
            shadowOpacity: NEO_SHADOW_OPACITY,
          },
        ]}
      />
      {}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius,
            backgroundColor: surfaceColor,
            shadowColor: colors.shadow.light,
            shadowOffset: neo.light.offset,
            shadowRadius: neo.light.radius,
            shadowOpacity: NEO_SHADOW_OPACITY,
          },
        ]}
      />
      {}
      <View style={[base, padded && styles.pad]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16 },
});
