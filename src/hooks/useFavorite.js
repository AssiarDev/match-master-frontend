import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useFavorite = () => {
    const [favorite, setFavorite] = useState([]);
    const { user } = useAuth();
    const [error, setError] = useState(null);

    const fetchFavorite = async () => {

        if (!user?.id) return;
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
    
    useEffect(() => {
        fetchFavorite();
    },[user]);

    return { favorite, error, refreshFavorites: fetchFavorite }
}