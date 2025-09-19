import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/AuthContext'
import Logo from '../../components/ui/Logo'
import Card, { CardContent, CardFooter, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import TextInput from '../../components/ui/TextInput'

type FieldErrors = Partial<Record<'fullName' | 'phone' | 'otp', string>>

export default function RegisterPage() {
  const { registerWithPhone, verifyOTP, isLoading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'register' | 'otp'>('register')
  const [values, setValues] = useState({
    fullName: '',
    phone: '',
    otp: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  function validate(): boolean {
    const err: FieldErrors = {}
    if (step === 'register') {
      if (!values.fullName || values.fullName.length < 2) err.fullName = 'Nombre completo requerido'
      if (!values.phone || !/^\+?[0-9\s-()]{10,15}$/.test(values.phone.replace(/\s/g, ''))) err.phone = 'Teléfono inválido'
    } else if (step === 'otp') {
      if (!values.otp || values.otp.length !== 6) err.otp = 'Código de 6 dígitos requerido'
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return

    try {
      if (step === 'register') {
        const result = await registerWithPhone({
          name: values.fullName,
          phone: values.phone
        })
        if (result.success) {
          setStep('otp')
          setSubmitError(null)
        } else {
          setSubmitError(result.message || 'Error al enviar código')
        }
      } else if (step === 'otp') {
        await verifyOTP({
          phone: values.phone,
          otp: values.otp
        })
        navigate('/dashboard')
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al registrar')
    }
  }

  return (
    <div className="authLayout">
      <div className="authLayout__header">
        <Logo />
        <div className="brand">
          <div className="brand__title">PawsCare</div>
          <div className="brand__subtitle">{step === 'register' ? 'Crear cuenta' : 'Verificar teléfono'}</div>
        </div>
      </div>

      <Card className="authCard">
        <CardHeader>
          <h1 className="authCard__title">
            {step === 'register' ? 'Registro' : 'Código de verificación'}
          </h1>
          <p className="authCard__subtitle">
            {step === 'register'
              ? 'Ingresa tu nombre completo y teléfono'
              : `Ingresa el código de 6 dígitos enviado a ${values.phone}`
            }
          </p>
        </CardHeader>
        <CardContent>
          <form className="form" onSubmit={handleSubmit}>
            {step === 'register' ? (
              <>
                <TextInput
                  label="Nombre completo"
                  name="fullName"
                  placeholder="Juan Carlos Pérez"
                  value={values.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                />
                <TextInput
                  label="Teléfono"
                  name="phone"
                  type="tel"
                  placeholder="+54 9 11 1234-5678"
                  value={values.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
              </>
            ) : (
              <TextInput
                label="Código de verificación"
                name="otp"
                placeholder="123456"
                value={values.otp}
                onChange={handleChange}
                error={errors.otp}
                maxLength={6}
                required
              />
            )}
            {submitError && <div className="form__error">{submitError}</div>}
            <Button type="submit" fullWidth isLoading={isLoading}>
              {step === 'register' ? 'Enviar código' : 'Verificar y crear cuenta'}
            </Button>
            {step === 'otp' && (
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => setStep('register')}
              >
                Cambiar teléfono
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <div className="authCard__footerText">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </div>
        </CardFooter>
      </Card>

      <footer className="authLayout__footer">© 2024 PawsCare. Sistema de gestión veterinaria.</footer>
    </div>
  )
}


