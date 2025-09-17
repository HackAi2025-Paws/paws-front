import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/AuthContext'
import Logo from '../../components/ui/Logo'
import Card, { CardContent, CardFooter, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import TextInput from '../../components/ui/TextInput'

type FieldErrors = Partial<Record<'firstName' | 'lastName' | 'email' | 'clinicName' | 'password' | 'confirmPassword', string>>

export default function RegisterPage() {
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    clinicName: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  function validate(): boolean {
    const err: FieldErrors = {}
    if (!values.firstName) err.firstName = 'Requerido'
    if (!values.lastName) err.lastName = 'Requerido'
    if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) err.email = 'Email inválido'
    if (!values.clinicName) err.clinicName = 'Requerido'
    if (!values.password || values.password.length < 6) err.password = 'Mínimo 6 caracteres'
    if (values.password !== values.confirmPassword) err.confirmPassword = 'No coincide'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    try {
      await register(values)
      navigate('/dashboard')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al registrar')
    }
  }

  return (
    <div className="authLayout">
      <div className="authLayout__header">
        <Logo />
        <div className="brand">
          <div className="brand__title">VetCare Digital</div>
          <div className="brand__subtitle">Crea tu cuenta profesional</div>
        </div>
      </div>

      <Card className="authCard">
        <CardHeader>
          <h1 className="authCard__title">Registro</h1>
          <p className="authCard__subtitle">Completa tus datos para crear tu cuenta</p>
        </CardHeader>
        <CardContent>
          <form className="form" onSubmit={handleSubmit}>
            <div className="grid grid--2">
              <TextInput
                label="Nombre"
                name="firstName"
                placeholder="Juan"
                value={values.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <TextInput
                label="Apellido"
                name="lastName"
                placeholder="Pérez"
                value={values.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
            </div>
            <TextInput
              label="Email Profesional"
              name="email"
              type="email"
              placeholder="dr.perez@clinicaveterinaria.com"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <TextInput
              label="Nombre de la Clínica"
              name="clinicName"
              placeholder="Clínica Veterinaria San Martín"
              value={values.clinicName}
              onChange={handleChange}
              error={errors.clinicName}
              required
            />
            <TextInput
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <TextInput
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
            {submitError && <div className="form__error">{submitError}</div>}
            <Button type="submit" fullWidth isLoading={isLoading} aria-label="Crear Cuenta">
              Crear Cuenta
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="authCard__footerText">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </div>
        </CardFooter>
      </Card>

      <footer className="authLayout__footer">© 2024 VetCare Digital. Plataforma profesional para veterinarias.</footer>
    </div>
  )
}


