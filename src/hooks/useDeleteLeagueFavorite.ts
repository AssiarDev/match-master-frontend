import { useState } from 'react'

/**
 * Removes a league from the authenticated user's favorites.
 *
 * @returns `{ deleteLeagueFavorite, error }`
 */
export const useDeleteLeagueFavorite = () => {
  const [error, setError] = useState<string | null>(null)

  const deleteLeagueFavorite = async (leagueId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/protected/users/favorites-leagues/${leagueId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      )
      if (!response.ok) throw new Error('Erreur lors de la reponse.')

      const data = await response.json()
      return data
    } catch (e) {
      setError(`Une erreur est survenue : ${e}`)
    }
  }

  return { deleteLeagueFavorite, error }
}
