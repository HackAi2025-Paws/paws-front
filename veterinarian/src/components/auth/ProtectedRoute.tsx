import { Navigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { session, isLoading } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#64748b'
        }}>
          <div style={{
            fontSize: '24px',
            marginBottom: '8px'
          }}>🩺</div>
          <div>Verificando autenticación...</div>
        </div>
      </div>
    )
  }

  // Check if user has valid session
  const token = session?.token || (session as any)?.accessToken
  if (!session || !token) {
    return <Navigate to={redirectTo} replace />
  }

  // Check if JWT token is expired (if it's a JWT)
  try {
    // Check if token has proper JWT structure (3 parts separated by dots)
    const tokenParts = token.split('.')

    if (tokenParts.length === 3) {
      // It's likely a JWT token, validate it
      const tokenPayload = JSON.parse(atob(tokenParts[1]))

      // If no expiration field, assume token is valid (some tokens might not have exp)
      if (!tokenPayload.exp) {
        return <>{children}</>
      }

      const isExpired = tokenPayload.exp * 1000 < Date.now()

      if (isExpired) {
        return <Navigate to={redirectTo} replace />
      }
    }
    // If it's not a JWT token (maybe a simple bearer token), just check if it exists
  } catch (error) {
    // If token can't be parsed, but exists, assume it's valid (maybe it's not JWT)
    console.error('Token validation error:', error)
  }

  return <>{children}</>
}