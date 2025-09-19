import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navigation } from './Navigation'
import { useAppSelector } from '../../hooks'
import { useAuth } from '../../modules/auth/hooks'
import { env } from '../../config/env'

export const Layout: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { user } = useAuth()
  const location = useLocation()

  // Verificar si hay sesión en localStorage
  const hasStoredSession = () => {
    try {
      const session = localStorage.getItem(env.SESSION_STORAGE_KEY)
      const token = localStorage.getItem(env.AUTH_TOKEN_KEY)
      return !!(session && token)
    } catch {
      return false
    }
  }

  // Rutas públicas que no necesitan navegación
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(location.pathname)

  // Verificar si el usuario está autenticado
  const isUserAuthenticated = isAuthenticated || user || hasStoredSession()

  // No mostrar navegación en rutas públicas
  if (isPublicRoute || !isUserAuthenticated) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-16">
        <Outlet />
      </main>
      <Navigation />
    </div>
  )
}
