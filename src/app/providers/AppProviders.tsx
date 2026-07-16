import React, { useMemo } from "react";
import { Provider as UrqlProvider } from "urql";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, ToastProvider } from "../../ui";
import { createUrqlClient } from "../../graphql/client";
import { AuthProvider } from "./AuthProvider";
import { ConnectivityProvider } from "./ConnectivityProvider";
import { SosProvider } from "../../features/system/components/SosProvider";
import { DemoBadge } from "../components/DemoBadge";

/**
 * Composes every app-wide provider in the right order:
 *  gesture root -> safe area -> urql (server state cache) -> theme (static
 *  tokens) -> auth session -> connectivity mirror -> toast -> SOS overlay host.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createUrqlClient(), []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <UrqlProvider value={client}>
          <ThemeProvider>
            <AuthProvider>
              <ConnectivityProvider>
                <ToastProvider>
                  <SosProvider>
                    {children}
                    {/* App-wide, low-prominence marker; renders only in demo. */}
                    <DemoBadge />
                  </SosProvider>
                </ToastProvider>
              </ConnectivityProvider>
            </AuthProvider>
          </ThemeProvider>
        </UrqlProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
