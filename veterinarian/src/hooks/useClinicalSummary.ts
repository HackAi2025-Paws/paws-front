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
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchClinicalSummary = async () => {
    if (!petId) {
      setSummary(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.get<ClinicalSummary>(`pets/${petId}/clinical-summary`)

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch clinical summary')
      }

      setSummary(response.data!)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clinical summary')
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    fetchClinicalSummary()
  }, [petId, refreshTrigger])

  return {
    summary,
    loading,
    error,
    refetch
  }
}