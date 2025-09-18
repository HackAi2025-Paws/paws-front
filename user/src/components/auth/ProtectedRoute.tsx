import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks'
import { useAuth } from '../../modules/auth/AuthContext'
import { env } from '../../config/env'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { user, isLoading } = useAuth()

  // Verificar también si hay sesión en localStorage
  const hasStoredSession = () => {
    try {
      const session = localStorage.getItem(env.SESSION_STORAGE_KEY)
      const token = localStorage.getItem(env.AUTH_TOKEN_KEY)
      return !!(session && token)
    } catch {
      return false
    }
  }

  // Si está cargando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Verificar autenticación (Redux, AuthContext, o localStorage)
  const isUserAuthenticated = isAuthenticated || user || hasStoredSession()

  if (!isUserAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
