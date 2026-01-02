"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
};

type AuthCtx = {
  user: User | null;
  initials: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  loginTest: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const LS_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  function persist(u: User | null) {
    if (typeof window === "undefined") return;
    if (u) localStorage.setItem(LS_KEY, JSON.stringify(u));
    else localStorage.removeItem(LS_KEY);
  }

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Invalid email or password");
    }

    const data = await res.json();
    const u: User = {
      id: String(data.id),
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email,
      username: data.username,
    };
    setUser(u);
    persist(u);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const res = await fetch(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
        firstName,
        lastName,
        username: email.trim().toLowerCase(),
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Registration failed");
    }

    const data = await res.json();
    const u: User = {
      id: String(data.id),
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email,
      username: data.username,
    };
    setUser(u);
    persist(u);
  };

  // For testing without backend
  const loginTest = () => {
    const u: User = {
      id: "demo-user",
      firstName: "Test",
      lastName: "User",
      email: "test@gmail.com",
      username: "test@gmail.com",
    };
    setUser(u);
    persist(u);
  };

  const logout = () => {
    setUser(null);
    persist(null);
  };

  const initials = useMemo(() => {
    if (!user) return "";
    const f = user.firstName?.[0] ?? "";
    const l = user.lastName?.[0] ?? "";
    return (f + l).toUpperCase();
  }, [user]);

  const value: AuthCtx = { user, initials, loading, login, register, loginTest, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}