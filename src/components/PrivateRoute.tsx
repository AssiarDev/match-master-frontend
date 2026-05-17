import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Protects routes that require authentication. Redirects to /login if not authenticated. */
export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
