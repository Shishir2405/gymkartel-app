import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { tokenStore } from "../../lib/tokenStore";

export type SessionStatus = "loading" | "signedOut" | "signedIn";
export type Role = "MEMBER" | "COACH";

interface AuthContextValue {
  status: SessionStatus;
  role: Role;
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  demoSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setRole: (role: Role) => void;
}

const DEMO_ACCESS_TOKEN = "demo.access.token";
const DEMO_REFRESH_TOKEN = "demo.refresh.token";

const AuthContext = createContext<AuthContextValue>({
  status: "loading",
  role: "MEMBER",
  signIn: async () => {},
  demoSignIn: async () => {},
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

  const demoSignIn = useCallback(async () => {
    await signIn(DEMO_ACCESS_TOKEN, DEMO_REFRESH_TOKEN);
  }, [signIn]);

  const signOut = useCallback(async () => {
    await tokenStore.clear();
    setRole("MEMBER");
    setStatus("signedOut");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, role, signIn, demoSignIn, signOut, setRole }),
    [status, role, signIn, demoSignIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
