import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './modules/auth/AuthContext'
import httpAuthClient from './modules/auth/httpClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider client={httpAuthClient}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
