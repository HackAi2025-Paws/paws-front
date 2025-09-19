import { Navigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/AuthContext'

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function PublicRoute({
  children,
  redirectTo = '/dashboard'
}: PublicRouteProps) {
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

  // If user is authenticated and has valid token, redirect to dashboard
  if (session && session.token) {
    try {
      const tokenPayload = JSON.parse(atob(session.token.split('.')[1]))
      const isExpired = tokenPayload.exp * 1000 < Date.now()

      // If token is still valid, redirect to dashboard
      if (!isExpired) {
        return <Navigate to={redirectTo} replace />
      }
    } catch (error) {
      // If token can't be parsed, let them stay on public route
      console.error('Invalid JWT token:', error)
    }
  }

  return <>{children}</>
}