"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch } from "@/lib/api/client";
import { patchUserProfile, verifyAuthOtp } from "@/lib/api/auth";
import type { ApiUser } from "@/lib/api/types";

const STORAGE_KEY = "lcc_token";

type AuthContextValue = {
  token: string | null;
  user: ApiUser | null;
  loading: boolean;
  signInWithOtp: (phoneNational10: string, code: string) => Promise<{ needsOnboarding: boolean }>;
  completeOnboarding: (input: {
    childName: string;
    learningGoal: string;
    childGrade: number;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (typeof window === "undefined") return;
    const t = window.localStorage.getItem(STORAGE_KEY);
    if (!t) {
      setToken(null);
      setUser(null);
      return;
    }
    setToken(t);
    const data = await apiFetch<{ user: ApiUser }>("/api/users/me", {
      method: "GET",
      token: t,
    });
    setUser(data.user);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const t = window.localStorage.getItem(STORAGE_KEY);
      if (!t) {
        if (!cancelled) setLoading(false);
        return;
      }
      setToken(t);
      try {
        const data = await apiFetch<{ user: ApiUser }>("/api/users/me", {
          method: "GET",
          token: t,
        });
        if (!cancelled) setUser(data.user);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signInWithOtp = useCallback(async (phoneNational10: string, code: string) => {
    const data = await verifyAuthOtp({ phone: phoneNational10, code });
    window.localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return { needsOnboarding: data.needsOnboarding };
  }, []);

  const completeOnboarding = useCallback(
    async (input: { childName: string; learningGoal: string; childGrade: number }) => {
      const t = window.localStorage.getItem(STORAGE_KEY);
      if (!t) throw new Error("Not signed in");
      const { user: next } = await patchUserProfile(input, t);
      setUser(next);
    },
    [],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      signInWithOtp,
      completeOnboarding,
      logout,
      refreshUser,
    }),
    [token, user, loading, signInWithOtp, completeOnboarding, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
