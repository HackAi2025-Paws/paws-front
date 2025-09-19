import { useState, useEffect } from 'react'
import { apiClient } from '../services/apiClient'

export interface ClinicalSummary {
  basic_information: string
  history: string
  last_consultation: string
}

export function useClinicalSummary(petId: number | null) {
  const [summary, setSummary] = useState<ClinicalSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!petId) {
      setSummary(null)
      return
    }

    let mounted = true

    const fetchClinicalSummary = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await apiClient.get<ClinicalSummary>(`petsbien/${petId}/clinical-summary`)

        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch clinical summary')
        }

        if (mounted) {
          setSummary(response.data!)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load clinical summary')
          setSummary(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchClinicalSummary()

    return () => {
      mounted = false
    }
  }, [petId])

  return {
    summary,
    loading,
    error
  }
}