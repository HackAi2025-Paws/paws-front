import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/AuthContext'
import Logo from '../../components/ui/Logo'
import Card, { CardContent, CardFooter, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import TextInput from '../../components/ui/TextInput'

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    }
  }

  async function handleDemo() {
    setError(null)
    try {
      await login({ email: 'demo@vetcare.com', password: 'demo' })
      navigate('/dashboard')
    } catch (err) {
      setError('No se pudo acceder a la demo')
    }
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
          <p className="authCard__subtitle">Ingresa tus credenciales para acceder al sistema</p>
        </CardHeader>
        <CardContent>
          <form className="form" onSubmit={handleSubmit}>
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="veterinario@clinica.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
            <TextInput
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {error && <div className="form__error">{error}</div>}
            <Button type="submit" fullWidth isLoading={isLoading} aria-label="Iniciar Sesión">
              Iniciar Sesión
            </Button>

            <div className="divider">PARA PRUEBAS</div>

            <Button type="button" fullWidth variant="secondary" onClick={handleDemo}>
              Usar Cuenta Demo
            </Button>
          </form>
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


