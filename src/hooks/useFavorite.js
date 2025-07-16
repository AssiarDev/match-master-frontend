import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useFavorite = () => {
    const [favorite, setFavorite] = useState([]);
    const { user } = useAuth();
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!user?.id) return;

        const fetchFavorite = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/protected/users/${user.id}/favorites`, {
                    credentials: "include"
                });
                if(!response.ok){
                    throw new Error('Erreur lors de la reponse.')
                };

                const data = await response.json();
                setFavorite(data);

            } catch (e){
                setError(e.message)
            }
        }
        fetchFavorite();
    },[user]);

    return { favorite, error}
}