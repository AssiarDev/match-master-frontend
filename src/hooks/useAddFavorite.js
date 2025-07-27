import { useState } from "react";

export const useAddFavorite = () => {
    const [error, setError] = useState(null);

    const addFavorite = async (userId, id) => {
        let clubId = parseInt(id)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/protected/users/favorites`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({userId, clubId})
            });

            if(!response.ok){
                throw new Error('Erreur lors de la reponse.')
            };

            const data = await response.json();
            return data;

        } catch (e){
            setError(`Une erreur est survenue : ${e}`)
        }
    }

    return { addFavorite, error }
    
}