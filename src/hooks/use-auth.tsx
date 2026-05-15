import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthUser, AuthTenant, LoginResponse } from "@/lib/auth.functions";

const TOKEN_KEY = "patient_iq_token";
const USER_KEY = "patient_iq_user";
const TENANT_KEY = "patient_iq_tenant";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  tenant: AuthTenant;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSession: (data: LoginResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function readStored<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tenant, setTenant] = useState<AuthTenant>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    setToken(window.localStorage.getItem(TOKEN_KEY));
    setUser(readStored<AuthUser>(USER_KEY));
    setTenant(readStored<AuthTenant>(TENANT_KEY));
    setIsHydrated(true);
  }, []);

  const setSession = useCallback((data: LoginResponse) => {
    window.localStorage.setItem(TOKEN_KEY, data.token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    window.localStorage.setItem(TENANT_KEY, JSON.stringify(data.tenant));
    setToken(data.token);
    setUser(data.user);
    setTenant(data.tenant);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(TENANT_KEY);
    setToken(null);
    setUser(null);
    setTenant(null);
  }, []);

  // Cross-tab sync
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === TOKEN_KEY) setToken(e.newValue);
      if (e.key === USER_KEY) setUser(readStored<AuthUser>(USER_KEY));
      if (e.key === TENANT_KEY) setTenant(readStored<AuthTenant>(TENANT_KEY));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ token, user, tenant, isAuthenticated: !!token && !!user, isHydrated, setSession, logout }),
    [token, user, tenant, isHydrated, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
