import React from "react";
import { type ViewProps } from "react-native";
import { spacing } from "../tokens";
import { NeoSurface } from "./NeoSurface";

export interface CardProps extends ViewProps {
  elevation?: "raised" | "pressed" | "flat";
  padded?: boolean;
  children?: React.ReactNode;
}

/**
 * A raised soft card with the mandatory 1px hairline. The default surface for
 * grouped content. Composes NeoSurface — never re-implements shadow math.
 */
export function Card({
  elevation = "raised",
  padded = true,
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <NeoSurface
      elevation={elevation}
      hairline
      style={[padded ? { padding: spacing.lg } : null, style]}
      {...rest}
    >
      {children}
    </NeoSurface>
  );
}
