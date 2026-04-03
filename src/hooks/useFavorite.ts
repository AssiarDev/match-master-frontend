import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Favorite } from '../types'

export const useFavorite = () => {
  const [favorite, setFavorite] = useState<Favorite[]>([])
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const fetchFavorite = async () => {
    if (!user?.id) return
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/protected/users/${user.id}/favorites`,
        { credentials: 'include' }
      )
      if (!response.ok) throw new Error('Erreur lors de la reponse.')

      const data: Favorite[] = await response.json()
      setFavorite(data)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  useEffect(() => {
    fetchFavorite()
  }, [user])

  return { favorite, error, refreshFavorites: fetchFavorite }
}
