"use client";

import * as React from "react";
import { apiClient } from "@/services";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  bio: string;
  avatar_url: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshUser = React.useCallback(async () => {
    try {
      const data = await apiClient.get<User>("/auth/me/");
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  // On mount, try to restore session from the httpOnly cookie
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = React.useCallback(
    async (email: string, password: string) => {
      await apiClient.post("/auth/login/", { email, password });
      await refreshUser();
    },
    [refreshUser],
  );

  const logout = React.useCallback(async () => {
    try {
      await apiClient.post("/auth/logout/");
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
