import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const useDeleteProfile = () => {
    const { setIsAuthenticated, setUser } = useAuth()
    const navigate = useNavigate()

    const deleteProfile = async (userId: number | undefined) => {

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            })

            if(!response.ok) {
                throw new Error('Echec tentative de suppression du compte')
            }
            const data = await response.json()
            console.log('data :', data)

            setIsAuthenticated(false)
            setUser(null)
            navigate('/', { state: data})

        } catch (error){
            console.error('Suppression du compte échouée :', error)
        }
    }

    return deleteProfile
}