import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { tokenStore } from "../../lib/tokenStore";

/**
 * Auth session as a React Context of a STATIC-ish session value (golden rule:
 * Context for session, not app data). Server data (the Viewer) lives in the
 * urql cache; this only tracks "are we signed in and in which role".
 */
export type SessionStatus = "loading" | "signedOut" | "signedIn";
export type Role = "MEMBER" | "COACH";

interface AuthContextValue {
  status: SessionStatus;
  role: Role;
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Role switch after login (member <-> coach), same app, same design system. */
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue>({
  status: "loading",
  role: "MEMBER",
  signIn: async () => {},
  signOut: async () => {},
  setRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [role, setRole] = useState<Role>("MEMBER");

  useEffect(() => {
    let mounted = true;
    void tokenStore.getAccess().then((token) => {
      if (!mounted) return;
      setStatus(token ? "signedIn" : "signedOut");
    });
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (accessToken: string, refreshToken: string) => {
    await tokenStore.set(accessToken, refreshToken);
    setStatus("signedIn");
  }, []);

  const signOut = useCallback(async () => {
    await tokenStore.clear();
    setRole("MEMBER");
    setStatus("signedOut");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, role, signIn, signOut, setRole }),
    [status, role, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
