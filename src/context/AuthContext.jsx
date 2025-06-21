import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Non authentifié");
        const data = await res.json();
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);