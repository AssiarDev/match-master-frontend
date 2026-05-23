import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

/**
 * Shape of the authentication context.
 * - `isAuthenticated`: whether the user has an active session
 * - `loading`: true while the initial session check is in progress
 * - `user`: the authenticated user, or null if not logged in
 * - `setIsAuthenticated`: manually update the auth state (used on login/logout)
 * - `setUser`: manually update the user object (used on login/logout)
 * - `checkAuth`: re-fetches the session from the API and syncs state
 */
interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provides authentication state to the entire app.
 * On mount, calls `checkAuth` to restore the session from the API cookie.
 * Wrap the app root with this provider.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Non authentifié");
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
      setUser(data.user);
      return data.isAuthenticated;
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        setIsAuthenticated,
        setUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access the authentication context.
 * Must be used inside an `AuthProvider` — throws if used outside.
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
