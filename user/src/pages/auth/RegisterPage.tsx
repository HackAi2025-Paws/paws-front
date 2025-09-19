import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAppDispatch } from '../../hooks'
import { loginSuccess } from '../../store/authSlice'
import { useAuth } from '../../modules/auth/AuthContext'
import { UserPlus } from 'lucide-react'
import Logo from '../../components/ui/Logo'

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    
    try {
      await register(formData)
      // The AuthContext will handle session storage
      // Update Redux store for compatibility
      dispatch(loginSuccess({
        id: crypto.randomUUID(),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email
      }))
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    }
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
            <p className="text-gray-600">Únete y cuida a tus mascotas</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Crear Cuenta
            </CardTitle>
            <CardDescription>
              Completa tus datos para crear tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    Nombre *
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Apellido *
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Teléfono *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+5491123456789"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  💡 Incluye código de país para recibir códigos OTP
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña *
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar contraseña *
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p>¿Ya tienes cuenta? <Link to="/login" className="text-primary font-medium hover:underline">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  )
}
