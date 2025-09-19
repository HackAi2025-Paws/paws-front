import { useState, useEffect } from 'react'
import { apiClient } from '../services/apiClient'

export interface UserData {
  id: number
  name: string
  phone: string
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchUser = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await apiClient.get<UserData>('users')

        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch user data')
        }

        if (mounted) {
          setUser(response.data!)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load user data')
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchUser()

    return () => {
      mounted = false
    }
  }, [])

  return {
    user,
    loading,
    error
  }
}