export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  clinicName?: string
}

export type AuthSession = {
  user: User
  token: string
}

export type LoginInput = {
  email: string
  password: string
}

export type PhoneLoginInput = {
  phone: string
}

export type OTPVerificationInput = {
  phone: string
  otp: string
}

export type RegisterInput = {
  firstName: string
  lastName: string
  email: string
  clinicName: string
  password: string
  confirmPassword: string
}

export type PhoneRegisterInput = {
  name: string
  phone: string
}

export interface AuthClient {
  login(input: LoginInput): Promise<AuthSession>
  loginWithPhone(input: PhoneLoginInput): Promise<{ success: boolean, message: string }>
  verifyOTP(input: OTPVerificationInput): Promise<AuthSession>
  register(input: RegisterInput): Promise<AuthSession>
  registerWithPhone(input: PhoneRegisterInput): Promise<{ success: boolean, message: string }>
  logout(): Promise<void>
  getCurrentSession(): Promise<AuthSession | null>
}


