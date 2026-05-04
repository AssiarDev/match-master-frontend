import { useState } from "react";

export const useAddLeagueFavorite = () => {
    const [error, setError] = useState<string | null>(null)

    const addLeagueFavorite = async (userId: number, leagueId: number) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/protected/users/favorites-leagues`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({ userId,  leagueId }),
                }
            )

            if(!response.ok) throw new Error('Erreur lors de la reponse')
            
                const data = await response.json()
                return data
        } catch (err){
            setError(`Une erreur est survenue : ${err}`)
        }
    }
    
    return { addLeagueFavorite, error }
}