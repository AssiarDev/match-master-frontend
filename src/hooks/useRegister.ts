import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Handles user registration. Validates password confirmation,
 * updates the auth context and redirects to login on success.
 * Accepts an optional `onSuccess` callback.
 *
 * @returns `{ register, loading, error }`
 */
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    onSuccess?: () => void,
  ) => {
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username,
          mail: email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || "Erreur lors de l'inscription.");
        return;
      }

      await checkAuth();
      onSuccess?.();
      navigate("/login");
    } catch (e) {
      console.error(e);
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
