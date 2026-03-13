"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthChange, signInAsGuest, signInWithEmail, signOut } from "@/lib/firebase";
import type { AppUser } from "@/lib/firebase";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signInGuest: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signInGuest: async () => {},
  signInEmail: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInGuest = async () => { await signInAsGuest(); };
  const signInEmail = async (email: string, password: string) => { await signInWithEmail(email, password); };
  const logout = async () => { await signOut(); };

  return (
    <AuthContext.Provider value={{ user, loading, signInGuest, signInEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
