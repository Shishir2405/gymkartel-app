import React, { createContext, useContext, useMemo } from "react";
import { tokens, type Tokens } from "./tokens";

const ThemeContext = createContext<Tokens>(tokens);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => tokens, []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Tokens {
  return useContext(ThemeContext);
}
