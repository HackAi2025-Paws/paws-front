import type { AuthClient, AuthSession, LoginInput, PhoneLoginInput, OTPVerificationInput, RegisterInput, PhoneRegisterInput, User } from './types'
import { apiClient } from '../../services/apiClient'
import { otpService, loginService } from '../../services/authService'

const STORAGE_KEY = 'vetcare.session'

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

export const httpAuthClient: AuthClient = {
  async login({ email, password }: LoginInput): Promise<AuthSession> {
    const response = await apiClient.post('/auth/login', { email, password })

    if (!response.success) {
      throw new Error(response.error || 'Error de login')
    }

    const session = response.data as AuthSession
    saveSession(session)
    return session
  },

  async loginWithPhone({ phone }: PhoneLoginInput): Promise<{ success: boolean, message: string }> {
    return await otpService.sendOTP({ phone })
  },

  async verifyOTP({ phone, otp }: OTPVerificationInput): Promise<AuthSession> {
    const session = await loginService.verifyOTP({ phone, otp })
    saveSession(session)
    return session
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    const response = await apiClient.post('/auth/register', input)

    if (!response.success) {
      throw new Error(response.error || 'Error al registrar')
    }

    const session = response.data as AuthSession
    saveSession(session)
    return session
  },

  async registerWithPhone({ name, phone }: PhoneRegisterInput): Promise<{ success: boolean, message: string }> {
    const response = await apiClient.post('/auth/register', { name, phone })

    if (!response.success) {
      throw new Error(response.error || 'Error al registrar')
    }

    return {
      success: true,
      message: response.message || 'Código de verificación enviado por WhatsApp'
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      clearSession()
    }
  },

  async getCurrentSession(): Promise<AuthSession | null> {
    return readSession()
  },
}

export default httpAuthClient