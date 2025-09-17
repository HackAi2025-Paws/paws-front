import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './modules/auth/AuthContext'
import mockAuthClient from './modules/auth/mockClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider client={mockAuthClient}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
