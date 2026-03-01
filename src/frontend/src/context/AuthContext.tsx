import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

// ── Storage keys ──────────────────────────────────────────────
const STORAGE_KEY_AUTH = "tt_auth";
const STORAGE_KEY_USERS = "tt_users";

// ── Types ─────────────────────────────────────────────────────
type StoredAuth = { username: string };
type UsersStore = Record<string, string>; // username → password (plain text for demo)

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
function getUsers(): UsersStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) return {};
    return JSON.parse(raw) as UsersStore;
  } catch {
    return {};
  }
}

function saveUsers(users: UsersStore): void {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

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

  // Restore session on mount
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.username) {
      // Verify the user still exists
      const users = getUsers();
      if (stored.username in users) {
        setIsLoggedIn(true);
        setUsername(stored.username);
      } else {
        // User no longer exists, clean up stale session
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
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

      const users = getUsers();
      const storedPassword = users[trimmed];

      if (storedPassword === undefined || storedPassword !== password) {
        return { success: false, error: "Invalid username or password." };
      }

      // Persist session
      const auth: StoredAuth = { username: trimmed };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(auth));
      setIsLoggedIn(true);
      setUsername(trimmed);
      return { success: true };
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

      const users = getUsers();
      if (trimmed in users) {
        return { success: false, error: "Username already taken." };
      }

      users[trimmed] = password;
      saveUsers(users);
      return { success: true };
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
