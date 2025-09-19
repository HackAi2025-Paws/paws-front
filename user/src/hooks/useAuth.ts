import { useState } from 'react'
import { otpService, loginService, type OTPService, type LoginService } from '../services/authService'
import type { PhoneLoginInput, OTPVerificationInput, AuthSession } from '../modules/auth/types'

// Custom hook for OTP functionality
export const useOTP = (service: OTPService = otpService) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendOTP = async (input: PhoneLoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await service.sendOTP(input)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    sendOTP,
    isLoading,
    error,
    clearError
  }
}

// Custom hook for login functionality
export const useLogin = (service: LoginService = loginService) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyOTP = async (input: OTPVerificationInput): Promise<AuthSession> => {
    setIsLoading(true)
    setError(null)

    try {
      const session = await service.verifyOTP(input)
      return session
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    verifyOTP,
    isLoading,
    error,
    clearError
  }
}

// Combined hook for the complete auth flow
export const useAuthFlow = () => {
  const otpHook = useOTP()
  const loginHook = useLogin()

  const isLoading = otpHook.isLoading || loginHook.isLoading
  const error = otpHook.error || loginHook.error

  const clearAllErrors = () => {
    otpHook.clearError()
    loginHook.clearError()
  }

  return {
    // OTP functionality
    sendOTP: otpHook.sendOTP,
    // Login functionality
    verifyOTP: loginHook.verifyOTP,
    // Combined state
    isLoading,
    error,
    clearError: clearAllErrors
  }
}
