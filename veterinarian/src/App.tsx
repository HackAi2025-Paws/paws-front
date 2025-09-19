import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import PetDetailPage from './pages/PetDetailPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import { useAuth } from './modules/auth/AuthContext'
import './App.css'

export default function App() {
  const { session, isLoading } = useAuth()

  // Show loading screen while checking authentication
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
            fontSize: '48px',
            marginBottom: '16px'
          }}>🩺</div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>VetCare Digital</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>Cargando...</div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Default route: redirect based on authentication status */}
      <Route
        path="/"
        element={
          session && session.token ?
            <Navigate to="/dashboard" replace /> :
            <Navigate to="/login" replace />
        }
      />

      {/* Public routes (only accessible when not authenticated) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected routes (only accessible when authenticated) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pets/:id"
        element={
          <ProtectedRoute>
            <PetDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route: redirect based on authentication status */}
      <Route
        path="*"
        element={
          session && session.token ?
            <Navigate to="/dashboard" replace /> :
            <Navigate to="/login" replace />
        }
      />
    </Routes>
  )
}
