import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/AuthContext'
import { useAuthFlow } from '../../hooks/useAuth'
import Logo from '../../components/ui/Logo'
import Card, { CardContent, CardFooter, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import TextInput from '../../components/ui/TextInput'

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth()
  const { sendOTP, verifyOTP, isLoading: apiLoading, error: apiError, clearError } = useAuthFlow()
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
      localStorage.setItem('vetcare.session', JSON.stringify(session))
      window.location.href = '/dashboard'
    } catch (err) {
      // Error is handled by the hook
    }
  }

  async function handleAutoLogin() {
    clearError()
    try {
      await login({ email: 'demo@vetcare.com', password: 'demo' })
      navigate('/dashboard')
    } catch (err) {
      // Keep demo login for development
    }
  }

  function handleBackToPhone() {
    setStep('phone')
    setOtp('')
    clearError()
    setSuccessMessage(null)
  }

  return (
    <div className="authLayout">
      <div className="authLayout__header">
        <Logo />
        <div className="brand">
          <div className="brand__title">VetCare Digital</div>
          <div className="brand__subtitle">Accede a tu plataforma veterinaria</div>
        </div>
      </div>

      <Card className="authCard">
        <CardHeader>
          <h1 className="authCard__title">Iniciar Sesión</h1>
          <p className="authCard__subtitle">
            {step === 'phone'
              ? 'Ingresa tu número de teléfono para recibir un código'
              : 'Ingresa el código que recibiste por SMS'
            }
          </p>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form className="form" onSubmit={handlePhoneSubmit}>
              <TextInput
                label="Número de teléfono"
                name="phone"
                type="tel"
                placeholder="+5491123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                required
              />
              {error && <div className="form__error">{error}</div>}
              {successMessage && <div className="form__success">{successMessage}</div>}
              <Button type="submit" fullWidth isLoading={isLoading} aria-label="Enviar código">
                Enviar código
              </Button>

              <div className="divider">PARA PRUEBAS</div>

              <Button type="button" fullWidth variant="secondary" onClick={handleAutoLogin}>
                Auto Login (Demo)
              </Button>

              <div className="form__hint">
                💡 Ingresa tu número con código de país (ej: +5491123456789)
              </div>
            </form>
          ) : (
            <form className="form" onSubmit={handleOTPSubmit}>
              <TextInput
                label="Código de verificación"
                name="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              {error && <div className="form__error">{error}</div>}
              <Button type="submit" fullWidth isLoading={isLoading} aria-label="Verificar código">
                Verificar código
              </Button>

              <Button type="button" fullWidth variant="ghost" onClick={handleBackToPhone}>
                ← Cambiar número
              </Button>

              <div className="form__hint">
                💡 Revisa WhatsApp para obtener el código OTP
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <div className="authCard__footerText">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </div>
        </CardFooter>
      </Card>

      <footer className="authLayout__footer">© 2024 VetCare Digital. Plataforma profesional para veterinarias.</footer>
    </div>
  )
}


