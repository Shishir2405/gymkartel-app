import React, { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useUiStore } from "../../store/uiStore";

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
