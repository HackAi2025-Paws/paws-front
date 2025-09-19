import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthClient, AuthSession, LoginInput, RegisterInput, PhoneRegisterInput, OTPVerificationInput, User } from './types'

type AuthContextValue = {
  user: User | null
  session: AuthSession | null
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  registerWithPhone: (input: PhoneRegisterInput) => Promise<{ success: boolean, message: string }>
  verifyOTP: (input: OTPVerificationInput) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ client, children }: { client: AuthClient; children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    client
      .getCurrentSession()
      .then((s) => {
        if (mounted) setSession(s)
      })
      .catch((error) => {
        console.error('Error getting current session:', error)
        if (mounted) setSession(null)
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [client])

  async function login(input: LoginInput) {
    setIsLoading(true)
    try {
      const s = await client.login(input)
      setSession(s)
    } finally {
      setIsLoading(false)
    }
  }

  async function register(input: RegisterInput) {
    setIsLoading(true)
    try {
      const s = await client.register(input)
      setSession(s)
    } finally {
      setIsLoading(false)
    }
  }

  async function registerWithPhone(input: PhoneRegisterInput) {
    setIsLoading(true)
    try {
      return await client.registerWithPhone(input)
    } finally {
      setIsLoading(false)
    }
  }

  async function verifyOTP(input: OTPVerificationInput) {
    setIsLoading(true)
    try {
      const s = await client.verifyOTP(input)
      setSession(s)
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    setIsLoading(true)
    try {
      await client.logout()
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextValue = useMemo(
    () => ({ user: session?.user ?? null, session, isLoading, login, register, registerWithPhone, verifyOTP, logout }),
    [session, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}


