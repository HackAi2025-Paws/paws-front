import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAppDispatch } from '../../hooks'
import { loginSuccess } from '../../store/authSlice'
import { mockUser } from '../../data/mockData'
import { useAuth } from '../../modules/auth/AuthContext'
import { useAuthFlow } from '../../hooks/useAuth'
import { env } from '../../config/env'
import { Phone, Shield } from 'lucide-react'
import Logo from '../../components/ui/Logo'

export const LoginPage: React.FC = () => {
  const { /* login, */ isLoading: authLoading } = useAuth()
  const { sendOTP, verifyOTP, isLoading: apiLoading, error: apiError, clearError } = useAuthFlow()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isLoading = authLoading || apiLoading
  const error = apiError

  async function handlePhoneSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    setSuccessMessage(null)
    try {
      const result = await sendOTP({ phone })
      setSuccessMessage(result.message)
      setStep('otp')
    } catch (err) {
      // Error is handled by the hook
    }
  }

  async function handleOTPSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    try {
      const session = await verifyOTP({ phone, otp })
      // Update Redux store with user data
      dispatch(loginSuccess({
        id: session.user.id,
        name: `${session.user.firstName} ${session.user.lastName}`,
        email: session.user.email
      }))
      // Store session for AuthContext (ya se hace en authService, pero por seguridad)
      localStorage.setItem(env.SESSION_STORAGE_KEY, JSON.stringify(session))
      navigate('/dashboard')
    } catch (err) {
      // Error is handled by the hook
    }
  }

  function handleBackToPhone() {
    setStep('phone')
    setOtp('')
    clearError()
    setSuccessMessage(null)
  }

  const handleQuickLogin = () => {
    dispatch(loginSuccess(mockUser))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo y bienvenida */}
        <div className="text-center space-y-4">
          <div className="mx-auto rounded-full flex items-center justify-center">
            <Logo size={100} />
          </div>
          <div>
            <p className="text-gray-600">Cuidando a tus mascotas con amor</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 'phone' ? <Phone className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
              Iniciar Sesión
            </CardTitle>
            <CardDescription>
              {step === 'phone'
                ? 'Ingresa tu número de teléfono para recibir un código'
                : 'Ingresa el código que recibiste por SMS'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Número de teléfono
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+5491123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    💡 Ingresa tu número con código de país (ej: +5491123456789)
                  </p>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
                {successMessage && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{successMessage}</div>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Enviando código...' : 'Enviar código'}
                </Button>

                <div className="mt-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">PARA PRUEBAS</span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleQuickLogin}
                    className="w-full mt-4"
                  >
                    Acceso rápido (Demo)
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium">
                    Código de verificación
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    💡 Revisa WhatsApp para obtener el código OTP
                  </p>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verificando...' : 'Verificar código'}
                </Button>

                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleBackToPhone}
                  className="w-full"
                >
                  ← Cambiar número
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p>¿No tienes cuenta? <Link to="/register" className="text-primary font-medium hover:underline">Regístrate</Link></p>
        </div>
      </div>
    </div>
  )
}
