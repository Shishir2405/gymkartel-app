import React, { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useUiStore } from "../../store/uiStore";

/**
 * Mirrors device reachability into the UI store. Screens read `isOnline` to show
 * the quiet offline banner; the check-in flow NEVER waits on this — it only
 * decides whether to attempt an immediate sync or leave the scan queued.
 */
export function ConnectivityProvider({ children }: { children: React.ReactNode }) {
  const setOnline = useUiStore((s) => s.setOnline);
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
    return () => unsub();
  }, [setOnline]);
  return <>{children}</>;
}
