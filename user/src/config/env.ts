// Configuración de variables de entorno
export const env = {
  // Backend URLs - Compatible con módulo veterinarios
  API_BASE_URL: import.meta.env.VITE_BACK_URL || import.meta.env.VITE_API_BASE_URL || 'https://b41030c93352.ngrok-free.app/api/',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'https://b41030c93352.ngrok-free.app',
  
  // App info
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Paws',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Auth config
  AUTH_TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY || 'paws_auth_token',
  SESSION_STORAGE_KEY: import.meta.env.VITE_SESSION_STORAGE_KEY || 'paws_session',
  
  // Development flags
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true' || false,
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || true, // Temporarily enable debug mode
  
  // Environment
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const

// Helper para debug
export const logEnvConfig = () => {
  if (env.DEBUG_MODE) {
    console.group('🔧 Environment Configuration')
    console.log('API Base URL:', env.API_BASE_URL)
    console.log('Backend URL:', env.BACKEND_URL)
    console.log('Mock API:', env.MOCK_API)
    console.log('Environment:', env.IS_DEVELOPMENT ? 'Development' : 'Production')
    console.groupEnd()
  }
}

// Validar configuración crítica
export const validateEnvConfig = () => {
  const requiredVars = [
    { key: 'API_BASE_URL', value: env.API_BASE_URL },
    { key: 'BACKEND_URL', value: env.BACKEND_URL }
  ]
  
  const missing = requiredVars.filter(({ value }) => !value)
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.map(m => m.key))
    return false
  }
  
  return true
}
