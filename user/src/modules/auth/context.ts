import { createContext } from 'react'
import type { AuthSession, LoginInput, RegisterInput, User } from './types'

export type AuthContextValue = {
  user: User | null
  session: AuthSession | null
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
