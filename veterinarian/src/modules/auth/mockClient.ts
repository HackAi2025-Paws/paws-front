import type { AuthClient, AuthSession, LoginInput, PhoneLoginInput, OTPVerificationInput, RegisterInput, User } from './types'

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
const phoneToUserMap = new Map<string, string>() // phone -> email mapping
const otpStorage = new Map<string, { otp: string, timestamp: number }>() // phone -> otp data

// Mock phone numbers with their corresponding user emails
phoneToUserMap.set('+5491123456789', 'demo@vetcare.com')
phoneToUserMap.set('+5491187654321', 'test@example.com')

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

  async loginWithPhone({ phone }: PhoneLoginInput): Promise<{ success: boolean, message: string }> {
    await delay(800)

    if (!phone) {
      throw new Error('Número de teléfono requerido')
    }

    // Check if phone exists in our system
    if (!phoneToUserMap.has(phone)) {
      throw new Error('Número de teléfono no registrado')
    }

    // Generate OTP (mock)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    otpStorage.set(phone, { otp, timestamp: Date.now() })

    // In real app, send SMS here
    console.log(`OTP enviado a ${phone}: ${otp}`) // For testing

    return {
      success: true,
      message: `Código OTP enviado a ${phone}`
    }
  },

  async verifyOTP({ phone, otp }: OTPVerificationInput): Promise<AuthSession> {
    await delay(600)

    if (!phone || !otp) {
      throw new Error('Teléfono y código OTP requeridos')
    }

    const storedOTP = otpStorage.get(phone)
    if (!storedOTP) {
      throw new Error('No se encontró código OTP para este número')
    }

    // Check if OTP expired (5 minutes)
    if (Date.now() - storedOTP.timestamp > 5 * 60 * 1000) {
      otpStorage.delete(phone)
      throw new Error('El código OTP ha expirado')
    }

    if (storedOTP.otp !== otp) {
      throw new Error('Código OTP incorrecto')
    }

    // Get user email from phone
    const email = phoneToUserMap.get(phone)
    if (!email) {
      throw new Error('Usuario no encontrado')
    }

    // Clear used OTP
    otpStorage.delete(phone)

    // Get or create user
    let user = usersDb.get(email)
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        firstName: 'Usuario',
        lastName: 'Demo',
        email,
        clinicName: 'Clínica Demo',
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


