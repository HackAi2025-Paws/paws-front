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

export type RegisterInput = {
  firstName: string
  lastName: string
  email: string
  clinicName: string
  password: string
  confirmPassword: string
}

export interface AuthClient {
  login(input: LoginInput): Promise<AuthSession>
  register(input: RegisterInput): Promise<AuthSession>
  logout(): Promise<void>
  getCurrentSession(): Promise<AuthSession | null>
}


