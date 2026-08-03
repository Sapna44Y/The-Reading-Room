"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setAuthToken, setUnauthorizedHandler } from "@/lib/api/client";
import { ROUTES } from "@/constants/routes";
import type { Session, User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (session: Session) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_STORAGE_KEY = "book-manager.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    document.cookie = "session=; path=/; max-age=0";
    queryClient.clear();
    router.push(ROUTES.login);
  }, [queryClient, router]);

  const login = useCallback((session: Session) => {
    setAuthToken(session.token);
    setUser(session.user);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    document.cookie = "session=1; path=/; samesite=lax";
  }, []);

  // `isLoading` starts true and only flips once, here, on mount. AppShell's redirect
  // effect is a child of this provider, so React always runs it before this effect on
  // the first commit — gating on `isLoading` is what stops it from redirecting an
  // authenticated user before sessionStorage has actually been read. (A prior version
  // used useSyncExternalStore to read sessionStorage without this effect, on the theory
  // that its resync was hydration-safe; in practice the resync still lands after
  // AppShell's own effect, so it redirected real sessions to /login on every hard
  // reload of a protected route. Verified against the running app before reverting.)
  useEffect(() => {
    setUnauthorizedHandler(logout);
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const session: Session | null = raw ? JSON.parse(raw) : null;
    setAuthToken(session?.token ?? null);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sessionStorage hydration on mount; see comment above
    setUser(session?.user ?? null);
    setIsLoading(false);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
