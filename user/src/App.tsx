import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { Layout } from './components/layout/Layout'
import { LoginPage } from './pages/auth/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { PetProfilePage } from './pages/pet/PetProfilePage'
import { AddPetPage } from './pages/pet/AddPetPage'
import { ConsultationsPage } from './pages/consultations/ConsultationsPage'
import { RemindersPage } from './pages/reminders/RemindersPage'
import { FAQPage } from './pages/faq/FAQPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AuthProvider } from './modules/auth/AuthContext'
import { mockAuthClient } from './modules/auth/mockClient'
import { useSessionSync } from './hooks/useSessionSync'
import { useAppDispatch, useAppSelector } from './hooks'
import { loadPets } from './store/petsSlice'
import { useAuth } from './modules/auth/AuthContext'

function AppContent() {
  // Sincronizar sesión al inicializar
  useSessionSync()
  
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { pets } = useAppSelector(state => state.pets)

  // Cargar mascotas cuando el usuario está autenticado
  useEffect(() => {
    if (user && pets.length === 0) {
      console.log('🔄 Loading pets from backend...')
      dispatch(loadPets())
    }
  }, [user, pets.length, dispatch])

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Rutas protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/pet/:petId" element={
              <ProtectedRoute>
                <PetProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/pet/add" element={
              <ProtectedRoute>
                <AddPetPage />
              </ProtectedRoute>
            } />
            
            <Route path="/consultations" element={
              <ProtectedRoute>
                <ConsultationsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/reminders" element={
              <ProtectedRoute>
                <RemindersPage />
              </ProtectedRoute>
            } />
            
            <Route path="/faq" element={
              <ProtectedRoute>
                <FAQPage />
              </ProtectedRoute>
            } />
            
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Redirecciones */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider client={mockAuthClient}>
        <AppContent />
      </AuthProvider>
    </Provider>
  )
}

export default App