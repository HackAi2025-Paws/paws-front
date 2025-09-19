import { mockAuthClient } from '../modules/auth/mockClient'
import apiClient from './apiClient'
import { env } from '../config/env'
import type { PhoneLoginInput, OTPVerificationInput, AuthSession, LoginInput, RegisterInput } from '../modules/auth/types'

export interface OTPService {
  sendOTP(input: PhoneLoginInput): Promise<{ success: boolean, message: string }>
}

export interface LoginService {
  verifyOTP(input: OTPVerificationInput): Promise<AuthSession>
}

export interface AuthService {
  login(input: LoginInput): Promise<AuthSession>
  register(input: RegisterInput): Promise<AuthSession>
  logout(): Promise<void>
  refreshToken(): Promise<AuthSession>
  getCurrentUser(): Promise<AuthSession>
}

// Servicios OTP (usa mock o API real según configuración)
export const otpService: OTPService = {
  async sendOTP(input: PhoneLoginInput) {
    if (env.MOCK_API) {
      return await mockAuthClient.loginWithPhone(input)
    }
    
    try {
      const response = await apiClient.post<{ success: boolean, message: string }>('auth/otp', {
        phone: input.phone
      })
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to send OTP')
      }
      
      return {
        success: true,
        message: response.data?.message || `Código OTP enviado a ${input.phone}`
      }
    } catch (error) {
      console.error('❌ Error sending OTP:', error)
      // Fallback to mock in case of error
      return await mockAuthClient.loginWithPhone(input)
    }
  }
}

export const loginService: LoginService = {
  async verifyOTP(input: OTPVerificationInput) {
    if (env.MOCK_API) {
      return await mockAuthClient.verifyOTP(input)
    }
    
    try {
      const response = await apiClient.post<any>('auth/login', {
        phone: input.phone,
        token: input.otp
      })
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to verify OTP')
      }
      
      if (!response.data) {
        throw new Error('No session data received')
      }
      
      // Guardar token y sesión en localStorage
      // El backend devuelve: { success: true, accessToken: "...", user: {...} }
      const backendResponse = response.data
      const token = backendResponse.accessToken
      
      if (token && backendResponse.user) {
        localStorage.setItem(env.AUTH_TOKEN_KEY, token)
        
        // Crear sesión normalizada para el frontend
        const normalizedSession: AuthSession = {
          user: {
            id: backendResponse.user.id.toString(),
            firstName: backendResponse.user.name.split(' ')[0] || backendResponse.user.name,
            lastName: backendResponse.user.name.split(' ').slice(1).join(' ') || '',
            email: backendResponse.user.email || '',
            phone: backendResponse.user.phone
          },
          token: token
        }
        
        localStorage.setItem(env.SESSION_STORAGE_KEY, JSON.stringify(normalizedSession))
        
        if (env.DEBUG_MODE) {
          console.log('✅ Token guardado exitosamente:', {
            tokenLength: token.length,
            userId: backendResponse.user.id,
            userName: backendResponse.user.name
          })
        }
        
        return normalizedSession
      } else {
        throw new Error('Token o usuario no recibido del servidor')
      }
    } catch (error) {
      console.error('❌ Error verifying OTP:', error)
      // Fallback to mock in case of error
      return await mockAuthClient.verifyOTP(input)
    }
  }
}

// Servicio de autenticación completo
export const authService: AuthService = {
  async login(input: LoginInput) {
    if (env.MOCK_API) {
      return await mockAuthClient.login(input)
    }
    
    try {
      const response = await apiClient.post<any>('/auth/login', input)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to login')
      }
      
      // El backend devuelve: { success: true, accessToken: "...", user: {...} }
      const backendResponse = response.data
      const token = backendResponse.accessToken
      
      if (token && backendResponse.user) {
        localStorage.setItem(env.AUTH_TOKEN_KEY, token)
        
        // Crear sesión normalizada para el frontend
        const normalizedSession: AuthSession = {
          user: {
            id: backendResponse.user.id.toString(),
            firstName: backendResponse.user.name.split(' ')[0] || backendResponse.user.name,
            lastName: backendResponse.user.name.split(' ').slice(1).join(' ') || '',
            email: backendResponse.user.email || '',
            phone: backendResponse.user.phone
          },
          token: token
        }
        
        localStorage.setItem(env.SESSION_STORAGE_KEY, JSON.stringify(normalizedSession))
        
        if (env.DEBUG_MODE) {
          console.log('✅ Login exitoso - Token guardado:', {
            tokenLength: token.length,
            userId: backendResponse.user.id,
            userName: backendResponse.user.name
          })
        }
        
        return normalizedSession
      }
      
      throw new Error('No token received from server')
    } catch (error) {
      console.error('❌ Error logging in:', error)
      // Fallback to mock in case of error
      return await mockAuthClient.login(input)
    }
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    if (env.MOCK_API) {
      return await mockAuthClient.register(input)
    }
    
    try {
      const response = await apiClient.post<AuthSession>('/auth/register', input)
      // Guardar token en localStorage
      localStorage.setItem(env.AUTH_TOKEN_KEY, (response as any).data.token || (response as any).token)
      return (response as any).data || (response as unknown as AuthSession)
    } catch (error) {
      console.error('❌ Error registering:', error)
      // Fallback to mock in case of error
      return await mockAuthClient.register(input)
    }
  },

  async logout() {
    if (env.MOCK_API) {
      return await mockAuthClient.logout()
    }
    
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('❌ Error logging out:', error)
    } finally {
      // Siempre limpiar token local
      localStorage.removeItem(env.AUTH_TOKEN_KEY)
      localStorage.removeItem(env.SESSION_STORAGE_KEY)
    }
  },

  async refreshToken(): Promise<AuthSession> {
    if (env.MOCK_API) {
      const session = await mockAuthClient.getCurrentSession()
      if (!session) throw new Error('No session found')
      return session
    }
    
    const response = await apiClient.post<AuthSession>('/auth/refresh')
    localStorage.setItem(env.AUTH_TOKEN_KEY, (response as any).data.token || (response as any).token)
    return (response as any).data || (response as unknown as AuthSession)
  },

  async getCurrentUser(): Promise<AuthSession> {
    if (env.MOCK_API) {
      const session = await mockAuthClient.getCurrentSession()
      if (!session) throw new Error('No session found')
      return session
    }
    
    const response = await apiClient.get<AuthSession>('/auth/me')
    return (response as any).data || (response as unknown as AuthSession)
  }
}
