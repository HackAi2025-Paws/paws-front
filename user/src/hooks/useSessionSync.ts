import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { loginSuccess, logout } from '../store/authSlice'
import { env } from '../config/env'
import type { AuthSession } from '../modules/auth/types'

export const useSessionSync = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Sincronizar Redux con localStorage al cargar
    const syncSession = () => {
      try {
        const sessionData = localStorage.getItem(env.SESSION_STORAGE_KEY)
        const token = localStorage.getItem(env.AUTH_TOKEN_KEY)
        
        if (sessionData && token && !isAuthenticated) {
          const session: AuthSession = JSON.parse(sessionData)
          dispatch(loginSuccess({
            id: session.user.id,
            name: `${session.user.firstName} ${session.user.lastName}`,
            email: session.user.email
          }))
          
          if (env.DEBUG_MODE) {
            console.log('✅ Session restored from localStorage')
          }
        } else if (!sessionData && isAuthenticated) {
          // Si Redux dice que está autenticado pero no hay sesión en localStorage, desloguear
          dispatch(logout())
          if (env.DEBUG_MODE) {
            console.log('❌ Session cleared - no localStorage data')
          }
        }
      } catch (error) {
        console.error('❌ Error syncing session:', error)
        dispatch(logout())
      }
    }

    syncSession()

    // Escuchar cambios en localStorage (para múltiples tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === env.SESSION_STORAGE_KEY || e.key === env.AUTH_TOKEN_KEY) {
        syncSession()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [dispatch, isAuthenticated])

  // Función para limpiar sesión completamente
  const clearSession = () => {
    localStorage.removeItem(env.SESSION_STORAGE_KEY)
    localStorage.removeItem(env.AUTH_TOKEN_KEY)
    dispatch(logout())
  }

  return { clearSession }
}
