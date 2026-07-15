import React from "react";
import { Platform, StyleSheet, View, type ViewProps, type ViewStyle } from "react-native";
import { colors, neo, radius as radiusTokens, NEO_SHADOW_OPACITY } from "../tokens";

type Elevation = "raised" | "pressed" | "flat";

export interface NeoSurfaceProps extends ViewProps {
  elevation?: Elevation;
  radius?: number;
  /** Adds the mandatory 1px hairline border used on every card. */
  hairline?: boolean;
  padded?: boolean;
  children?: React.ReactNode;
}

/**
 * The single source of neumorphic shadow math. NEVER hand-roll dual shadows in
 * a screen — compose this.
 *
 * "raised": soft surface floating off the base — dark shadow bottom-right, light
 * shadow top-left. RN only paints one native shadow per view, so we stack two
 * shadow layers (dark under, light over) beneath the content.
 * "pressed": the surface sinks IN. RN has no inset shadow, so we approximate the
 * inverted look with the pressed background + a light hairline at the top edge
 * and a dark hairline at the bottom edge.
 *
 * Text and icons are never children rendered *with* these shadows applied to
 * them — they sit on top of the surface, flat.
 */
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

  // raised — two stacked shadow layers on iOS, elevation on Android.
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
      {/* dark shadow (bottom-right) */}
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
      {/* light shadow (top-left) */}
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
      {/* content surface with hairline */}
      <View style={[base, padded && styles.pad]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16 },
});
