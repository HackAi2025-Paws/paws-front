import { useState, useEffect } from 'react'
import apiClient from '../services/apiClient'
import { env } from '../config/env'

export interface BackendStatus {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  lastChecked: Date | null
  usingMockData: boolean
}

export const useBackendConnection = () => {
  const [status, setStatus] = useState<BackendStatus>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastChecked: null,
    usingMockData: env.MOCK_API
  })

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const isConnected = await apiClient.testConnection()
      setStatus({
        isConnected,
        isLoading: false,
        error: isConnected ? null : 'Backend no disponible',
        lastChecked: new Date(),
        usingMockData: env.MOCK_API || !isConnected
      })
      
      if (env.DEBUG_MODE) {
        console.log(isConnected ? '✅ Backend connected' : '❌ Backend disconnected, using mock data')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión'
      setStatus({
        isConnected: false,
        isLoading: false,
        error: errorMessage,
        lastChecked: new Date(),
        usingMockData: true
      })
      
      if (env.DEBUG_MODE) {
        console.error('❌ Backend connection error:', error)
      }
    }
  }

  useEffect(() => {
    checkConnection()
    
    // Verificar conexión cada 30 segundos si no estamos en mock mode
    if (!env.MOCK_API) {
      const interval = setInterval(checkConnection, 30000)
      return () => clearInterval(interval)
    }
  }, [])

  return {
    ...status,
    checkConnection,
    forceRefresh: checkConnection
  }
}
