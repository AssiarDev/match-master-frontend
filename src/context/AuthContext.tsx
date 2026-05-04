import { createContext, useState, useEffect, useContext } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'

/**
 * Shape of the authentication context.
 * - `isAuthenticated`: whether the user has an active session
 * - `user`: the authenticated user, or null if not logged in
 * - `setIsAuthenticated`: manually update the auth state (used on login/logout)
 * - `setUser`: manually update the user object (used on login/logout)
 * - `checkAuth`: re-fetches the session from the API and syncs state
 */
interface AuthContextValue {
  isAuthenticated: boolean
  user: User | null
  setIsAuthenticated: (value: boolean) => void
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Provides authentication state to the entire app.
 * On mount, calls `checkAuth` to restore the session from the API cookie.
 * Wrap the app root with this provider.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const checkAuth = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Non authentifié')
      const data = await res.json()
      setIsAuthenticated(data.isAuthenticated)
      setUser(data.user)
    } catch {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access the authentication context.
 * Must be used inside an `AuthProvider` — throws if used outside.
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
