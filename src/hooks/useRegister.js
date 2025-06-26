import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { checkAuth } = useAuth();
    const navigate = useNavigate();

    const register = async (username, email, password, confirmPassword, onSuccess) => {
        setLoading(true);
        setError("");

        if(password !== confirmPassword){
            setError('Les mots de passe ne correspondent pas.')
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({username, mail: email, password, confirmPassword})
            });

            if(!response.ok){
                throw new Error('Echec tentative d\'inscription')
            }

            const data = await response.json();

            if(response.ok){
                await checkAuth();
                onSuccess?.();
                navigate('/login');
            } else {
                setError(data?.message || "Erreur lors de l'inscription")
            }
        } catch(e){
            setError('Erreur de connexion au serveur', e)
        } finally {
            setLoading(false)
        }
    };

    return { register, loading, error}
};