import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

/**
 * Updates the authenticated user's profile (username and/or password).
 * Refreshes the auth context on success.
 *
 * @returns `{ updateUser, loading, error }`
 */
export const useUpdateInfoUser = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { checkAuth } = useAuth()

    const updateUser = async (userId: number, username?: string, currentPassword?: string, newPassword?: string, confirmPassword?: string) => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({username, currentPassword, newPassword, confirmPassword})
            })
            const data = await response.json()

            if(!response.ok)
                throw new Error(data.error || data.message || 'Une erreur est survenue')

            await checkAuth()
            return true
        } catch(error){
            setError(error instanceof Error ? error.message : 'Echec mise à jour')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return { updateUser, error, loading}
}