import { apiClient, type ApiClient } from './apiClient'
import type { AuthSession, PhoneLoginInput, OTPVerificationInput } from '../modules/auth/types'

// Service interfaces following SOLID principles
export interface OTPService {
  sendOTP(input: PhoneLoginInput): Promise<{ success: boolean; message: string }>
}

export interface LoginService {
  verifyOTP(input: OTPVerificationInput): Promise<AuthSession>
}

// OTP Service Implementation
class ApiOTPService implements OTPService {
  constructor(private apiClient: ApiClient) {}

  async sendOTP(input: PhoneLoginInput): Promise<{ success: boolean; message: string }> {
    const response = await this.apiClient.post('auth/otp', {
      phone: input.phone
    })

    if (!response.success) {
      throw new Error(response.error || 'Failed to send OTP')
    }

    return {
      success: true,
      message: response.message || `Código OTP enviado a ${input.phone}`
    }
  }
}

// Login Service Implementation
class ApiLoginService implements LoginService {
  constructor(private apiClient: ApiClient) {}

  async verifyOTP(input: OTPVerificationInput): Promise<AuthSession> {
    const response = await this.apiClient.post<AuthSession>('auth/login', {
      phone: input.phone,
      token: input.otp
    })

    if (!response.success) {
      throw new Error(response.error || 'Failed to verify OTP')
    }

    if (!response.data) {
      throw new Error('No session data received')
    }

    return response.data
  }
}

// Factory functions
export const createOTPService = (client: ApiClient = apiClient): OTPService => {
  return new ApiOTPService(client)
}

export const createLoginService = (client: ApiClient = apiClient): LoginService => {
  return new ApiLoginService(client)
}

// Default instances
export const otpService = createOTPService()
export const loginService = createLoginService()