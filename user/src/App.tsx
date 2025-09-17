import React from 'react'
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
import { ChatPage } from './pages/chat/ChatPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            
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
            
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Redirecciones */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App