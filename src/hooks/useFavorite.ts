import { useAuth } from '../context/AuthContext'
import type { Favorite } from '../types'
import { useFetch } from './useFetch'

export const useFavorite = () => {
  const { user } = useAuth()

  const { data, error, refresh } = useFetch<Favorite[]>(
    user?.id
      ? `${import.meta.env.VITE_API_URL}/protected/users/${user.id}/favorites`
      : null,
    { fetchOptions: { credentials: 'include' } }
  )

  return { favorite: data ?? [], error, refreshFavorites: refresh }
}
