"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "@/lib/api";
import type { RegistrationContext } from "@/lib/device-context";
import type { User, UserRole } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  phoneSession: (data: {
    phone: string;
    name?: string;
    registrationContext?: RegistrationContext;
    proximityTarget?: { placeId: string };
  }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  isAdmin: boolean;
  isGestor: boolean;
  isTurista: boolean;
  canManagePlaces: boolean;
  canManageCategories: boolean;
  canManageUsers: boolean;
  canRespondSignals: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const me = await api.auth.me();
      setUser(me);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    localStorage.setItem("token", res.token);
    setUser(res.user);
  }, []);

  const phoneSession = useCallback(
    async (data: {
      phone: string;
      name?: string;
      registrationContext?: RegistrationContext;
      proximityTarget?: { placeId: string };
    }) => {
      const res = await api.auth.phoneSession(data);
      localStorage.setItem("token", res.token);
      setUser(res.user);
    },
    [],
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
    }) => {
      const res = await api.auth.register(data);
      localStorage.setItem("token", res.token);
      setUser(res.user);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      phoneSession,
      register,
      logout,
      refresh,
      isAdmin: user?.role === "ADMIN",
      isGestor: user?.role === "GESTOR",
      isTurista: user?.role === "TURISTA",
      canManagePlaces:
        user?.role === "GESTOR" || user?.role === "ADMIN",
      canManageCategories: user?.role === "ADMIN",
      canManageUsers: user?.role === "ADMIN",
      canRespondSignals:
        user?.role === "GESTOR" || user?.role === "ADMIN",
    }),
    [user, loading, login, phoneSession, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
