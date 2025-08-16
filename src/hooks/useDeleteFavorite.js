import { useState } from "react";

export const useDeleteFavorite = () => {
    const [error, setError] = useState(null);

    const deleteFavorite = async (clubId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/protected/users/favorites/${clubId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            if(!response.ok){
                throw new error('Erreur lors de la reponse.')
            };

            const data = await response.json();
            return data

        } catch (e){
            setError(`Une erreur est survenue : ${e}`)
        }
    } 

    return { deleteFavorite, error }
}