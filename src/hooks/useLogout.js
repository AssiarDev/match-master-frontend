import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useLogout = () => {
  const { setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erreur lors de la déconnexion");

      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Déconnexion échouée :", error);
    }
  };

  return logout;
};