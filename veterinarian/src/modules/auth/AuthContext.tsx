import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthClient, AuthSession, LoginInput, RegisterInput, User } from './types'

type AuthContextValue = {
  user: User | null
  session: AuthSession | null
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
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
      .finally(() => mounted && setIsLoading(false))
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
    () => ({ user: session?.user ?? null, session, isLoading, login, register, logout }),
    [session, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}


