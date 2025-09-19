import { useEffect, useMemo, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { AuthClient, AuthSession, LoginInput, RegisterInput } from './types'
import { AuthContext, type AuthContextValue } from './context'

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

  const login = useCallback(async (input: LoginInput) => {
    setIsLoading(true)
    try {
      const s = await client.login(input)
      setSession(s)
    } finally {
      setIsLoading(false)
    }
  }, [client])

  const register = useCallback(async (input: RegisterInput) => {
    setIsLoading(true)
    try {
      const s = await client.register(input)
      setSession(s)
    } finally {
      setIsLoading(false)
    }
  }, [client])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await client.logout()
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }, [client])

  const value: AuthContextValue = useMemo(
    () => ({ user: session?.user ?? null, session, isLoading, login, register, logout }),
    [session, isLoading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


