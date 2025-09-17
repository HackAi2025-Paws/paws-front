import type { AuthClient, AuthSession, LoginInput, RegisterInput, User } from './types'

const STORAGE_KEY = 'vetcare.session'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function makeToken(email: string) {
  return btoa(`${email}|${Date.now()}`)
}

function saveSession(session: AuthSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

function readSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

const usersDb = new Map<string, User>()

export const mockAuthClient: AuthClient = {
  async login({ email, password }: LoginInput): Promise<AuthSession> {
    await delay(600)
    if (!email || !password) {
      throw new Error('Credenciales inválidas')
    }
    let user = usersDb.get(email)
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        firstName: 'Demo',
        lastName: 'User',
        email,
        clinicName: 'Cuenta Demo',
      }
      usersDb.set(email, user)
    }
    const session = { user, token: makeToken(email) }
    saveSession(session)
    return session
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    await delay(800)
    const { firstName, lastName, email, clinicName, password, confirmPassword } = input
    if (!firstName || !lastName || !email || !clinicName || !password) {
      throw new Error('Completa todos los campos')
    }
    if (password !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden')
    }
    if (usersDb.has(email)) {
      throw new Error('El email ya está registrado')
    }
    const user: User = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      clinicName,
    }
    usersDb.set(email, user)
    const session = { user, token: makeToken(email) }
    saveSession(session)
    return session
  },

  async logout(): Promise<void> {
    await delay(200)
    clearSession()
  },

  async getCurrentSession(): Promise<AuthSession | null> {
    await delay(150)
    return readSession()
  },
}

export default mockAuthClient


