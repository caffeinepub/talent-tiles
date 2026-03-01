import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { createActorWithConfig } from "../config";

// ── Storage keys ──────────────────────────────────────────────
const STORAGE_KEY_AUTH = "tt_auth";

// ── Types ─────────────────────────────────────────────────────
type StoredAuth = { username: string };

type AuthContextType = {
  isLoggedIn: boolean;
  username: string | null;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

// ── Context ───────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Helpers ───────────────────────────────────────────────────
function getStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

// ── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Restore session on mount (just restore from localStorage — no backend verify needed on load)
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.username) {
      setIsLoggedIn(true);
      setUsername(stored.username);
    }
  }, []);

  const login = useCallback(
    async (
      uname: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      const trimmed = uname.trim();
      if (!trimmed || !password) {
        return { success: false, error: "Username and password are required." };
      }

      try {
        // Use anonymous actor (no identity needed for login)
        const actor = await createActorWithConfig();
        const result = await actor.loginUser(trimmed, password);

        if (result.__kind__ === "err") {
          return { success: false, error: result.err };
        }

        // Persist session
        const auth: StoredAuth = { username: trimmed };
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(auth));
        setIsLoggedIn(true);
        setUsername(trimmed);
        return { success: true };
      } catch (e) {
        console.error("Login error:", e);
        return {
          success: false,
          error: "Unable to connect to the server. Please try again.",
        };
      }
    },
    [],
  );

  const register = useCallback(
    async (
      uname: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      const trimmed = uname.trim();

      if (!trimmed) {
        return { success: false, error: "Username cannot be empty." };
      }
      if (trimmed.length < 3) {
        return {
          success: false,
          error: "Username must be at least 3 characters.",
        };
      }
      if (!password) {
        return { success: false, error: "Password cannot be empty." };
      }
      if (password.length < 6) {
        return {
          success: false,
          error: "Password must be at least 6 characters.",
        };
      }

      try {
        // Use anonymous actor (no identity needed for registration)
        const actor = await createActorWithConfig();
        const result = await actor.registerUser(trimmed, password);

        if (result.__kind__ === "err") {
          return { success: false, error: result.err };
        }

        return { success: true };
      } catch (e) {
        console.error("Register error:", e);
        return {
          success: false,
          error: "Unable to connect to the server. Please try again.",
        };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    setIsLoggedIn(false);
    setUsername(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ isLoggedIn, username, login, register, logout }),
    [isLoggedIn, username, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
