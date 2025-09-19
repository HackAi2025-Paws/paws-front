import React from 'react'
import { Button } from './button'
import { Card, CardContent } from './card'
import { useBackendConnection } from '../../hooks/useBackendConnection'
import { Wifi, WifiOff, RefreshCw, Database, Loader2 } from 'lucide-react'

interface ConnectionStatusProps {
  showDetails?: boolean
  className?: string
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  showDetails = false, 
  className = "" 
}) => {
  const { isConnected, isLoading, error, lastChecked, usingMockData, forceRefresh } = useBackendConnection()

  if (!showDetails) {
    // Modo compacto - solo un indicador pequeño
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        ) : isConnected ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        {usingMockData && (
          <Database className="h-4 w-4 text-yellow-500" />
        )}
      </div>
    )
  }

  // Modo detallado - card completa
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {isLoading ? 'Verificando...' : isConnected ? 'Conectado' : 'Desconectado'}
                </span>
                {usingMockData && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    <Database className="h-3 w-3" />
                    Mock Data
                  </span>
                )}
              </div>
              
              {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              )}
              
              {lastChecked && (
                <p className="text-xs text-gray-500 mt-1">
                  Última verificación: {lastChecked.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={forceRefresh}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Verificando...' : 'Verificar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
