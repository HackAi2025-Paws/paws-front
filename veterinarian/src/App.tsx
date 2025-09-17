import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import './App.css'
import DashboardPage from './pages/DashboardPage'
import PetDetailPage from './pages/PetDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pets/:id" element={<PetDetailPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
