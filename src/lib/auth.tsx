import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AdminRole = "admin" | "editor" | "viewer";

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: AdminProfile | null;
  loading: boolean;
  isAuthorized: boolean;
  recoveryMode: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  changeOwnPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Authentication failed. Please try again.";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const sessionUserId = useRef<string | null>(null);

  const loadProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      setProfile(null);
      setAuthError(error.message.includes("schema cache")
        ? "The Supabase database migration has not been installed yet."
        : error.message);
      return;
    }

    setProfile(data ? {
      id: data.id,
      email: data.email,
      fullName: data.full_name || data.email.split("@")[0],
      role: data.role,
    } : null);
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      sessionUserId.current = data.session?.user.id ?? null;
      setSession(data.session);
      setAuthError(error?.message ?? null);
      return loadProfile(data.session?.user ?? null);
    }).finally(() => {
      if (active) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      const previousUserId = sessionUserId.current;
      sessionUserId.current = nextSession?.user.id ?? null;
      setSession(nextSession);
      setAuthError(null);
      setRecoveryMode(event === "PASSWORD_RECOVERY");
      if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED" || (event === "SIGNED_IN" && previousUserId === nextSession?.user.id)) {
        setLoading(false);
        return;
      }
      setLoading(true);
      queueMicrotask(() => void loadProfile(nextSession?.user ?? null).finally(() => setLoading(false)));
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    profile,
    loading,
    isAuthorized: profile?.role === "admin" || profile?.role === "editor",
    recoveryMode,
    authError,
    signIn: async (email, password) => {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setAuthError(error.message);
        throw new Error(error.message);
      }
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      setProfile(null);
    },
    sendPasswordReset: async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (error) throw new Error(error.message);
    },
    updatePassword: async (password) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error(error.message);
      setRecoveryMode(false);
    },
    changeOwnPassword: async (currentPassword, newPassword) => {
      const email = session?.user.email;
      if (!email) throw new Error("Your authenticated account has no email address.");
      if (currentPassword === newPassword) throw new Error("Choose a password different from your current password.");

      const { error: verificationError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (verificationError) throw new Error("The current password is incorrect.");

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
    },
    refreshProfile: async () => {
      try {
        setAuthError(null);
        await loadProfile(session?.user ?? null);
      } catch (error) {
        setAuthError(errorMessage(error));
      }
    },
  }), [authError, loadProfile, loading, profile, recoveryMode, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// The provider and its hook intentionally share one module so the auth contract stays atomic.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
