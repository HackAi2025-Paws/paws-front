import type { AuthClient, AuthSession, LoginInput, PhoneLoginInput, OTPVerificationInput, RegisterInput, PhoneRegisterInput } from './types'
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
    const sessionData = JSON.parse(raw) as any

    // Normalize session format
    let session: AuthSession

    if (sessionData.token || sessionData.accessToken) {
      // It's already normalized or can be normalized
      session = {
        token: sessionData.token || sessionData.accessToken,
        user: sessionData.user
      }
    } else if (sessionData.success && sessionData.accessToken) {
      // It's the raw API response format, normalize it
      session = {
        token: sessionData.accessToken,
        user: sessionData.user
      }
      // Save the normalized format
      saveSession(session)
    } else {
      clearSession()
      return null
    }

    // Validate token expiration (only for JWT tokens)
    const token = session.token
    if (token) {
      try {
        const tokenParts = token.split('.')

        if (tokenParts.length === 3) {
          // It's a JWT token, validate expiration
          const tokenPayload = JSON.parse(atob(tokenParts[1]))

          if (tokenPayload.exp) {
            const isExpired = tokenPayload.exp * 1000 < Date.now()

            if (isExpired) {
              clearSession()
              return null
            }
          }
        }
        // Not a JWT token, assume it's valid
      } catch (error) {
        // If token can't be parsed but exists, assume it's valid (maybe it's not JWT)
        console.error('Token validation error:', error)
      }
    }

    return session
  } catch (error) {
    clearSession()
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

    let session: AuthSession

    // Handle different response formats
    if (response.data) {
      // If response.data exists, use it
      const data = response.data as any
      session = {
        token: data.token || data.accessToken,
        user: data.user
      }
    } else {
      // If no response.data, the response itself might be the session
      const data = response as any
      session = {
        token: data.token || data.accessToken,
        user: data.user
      }
    }

    saveSession(session)
    return session
  },

  async loginWithPhone({ phone }: PhoneLoginInput): Promise<{ success: boolean, message: string }> {
    return await otpService.sendOTP({ phone })
  },

  async verifyOTP({ phone, otp }: OTPVerificationInput): Promise<AuthSession> {
    const result = await loginService.verifyOTP({ phone, otp })

    // Normalize the session format
    const session: AuthSession = {
      token: (result as any).token || (result as any).accessToken,
      user: (result as any).user
    }

    saveSession(session)
    return session
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    const response = await apiClient.post('/auth/register', input)

    if (!response.success) {
      throw new Error(response.error || 'Error al registrar')
    }

    let session: AuthSession

    // Handle different response formats
    if (response.data) {
      const data = response.data as any
      session = {
        token: data.token || data.accessToken,
        user: data.user
      }
    } else {
      const data = response as any
      session = {
        token: data.token || data.accessToken,
        user: data.user
      }
    }

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