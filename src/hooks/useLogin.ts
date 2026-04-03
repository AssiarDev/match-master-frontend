import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const login = async (email: string, password: string, onSuccess?: () => void) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mail: email, password }),
      })

      if (!response.ok) throw new Error('Echec tentative de connexion')

      if (response.ok) {
        await checkAuth()
        onSuccess?.()
        navigate('/favoris')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
