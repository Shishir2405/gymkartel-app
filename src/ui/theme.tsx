import React, { createContext, useContext, useMemo } from "react";
import { tokens, type Tokens } from "./tokens";

/**
 * Theme is a React Context of STATIC design tokens only (golden rule: Context is
 * for static values, not app state). There is a single theme — Soft-Dark
 * Luxury. Serious screens deliberately opt OUT of these tokens and use the
 * `colors.serious` palette directly.
 */
const ThemeContext = createContext<Tokens>(tokens);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => tokens, []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Tokens {
  return useContext(ThemeContext);
}
