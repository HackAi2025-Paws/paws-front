import { useState, useEffect, useMemo } from 'react'
import { petsService, type Pet, type PetsSearchParams } from '../services/petsService'

// Hook for searching pets
export function usePetsSearch(params: PetsSearchParams = {}) {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 0,
    pages: 0
  })

  // Memoize params to avoid unnecessary re-renders
  const searchParams = useMemo(() => ({
    ...params
  }), [params.name, params.breed, params.ownerName, params.page, params.limit])

  useEffect(() => {
    let mounted = true

    const fetchPets = async () => {

      // If searchParams has no meaningful search criteria, don't fetch
      const hasValidParams = searchParams.name || searchParams.breed || searchParams.ownerName || searchParams.id

      if (!hasValidParams) {
        if (mounted) {
          setLoading(false)
          setPets([])
          setPagination({ total: 0, page: 1, limit: 0, pages: 0 })
        }
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await petsService.searchPets(searchParams)
        if (mounted) {
          const petsArray = Array.isArray(response) ? response : (response.data || [])
          const paginationData = response.pagination || { total: 0, page: 1, limit: 0, pages: 0 }
          setPets(petsArray)
          setPagination(paginationData)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load pets')
          setPets([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchPets()

    return () => {
      mounted = false
    }
  }, [searchParams])

  return {
    pets,
    loading,
    error,
    pagination
  }
}

// Hook for getting default pets (all pets without filters by default)
export function useDefaultPets(limit?: number) {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchDefaultPets = async () => {
      setLoading(true)
      setError(null)

      try {
        const searchParams = limit ? { limit } : {}
        const response = await petsService.searchPets(searchParams)
        if (mounted) {
          const petsArray = Array.isArray(response) ? response : (response.data || [])
          setPets(petsArray)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load pets')
          setPets([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchDefaultPets()

    return () => {
      mounted = false
    }
  }, [limit])

  return {
    pets,
    loading,
    error
  }
}

// Hook for getting single pet by ID with full details
export function usePetById(id: number | null) {
  const [pet, setPet] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchPet = async () => {
    if (!id) {
      setPet(null)
      return
    }

    console.log('🐾 usePetById - Starting fetch for ID:', id)
    setLoading(true)
    setError(null)

    try {
      const petData = await petsService.getPetById(id)
      console.log('🐾 usePetById - Pet detail received:', petData)

      setPet(petData)
      console.log('🐾 usePetById - Pet state updated')
    } catch (err) {
      console.error('🐾 usePetById - Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load pet')
      setPet(null)
    } finally {
      setLoading(false)
      console.log('🐾 usePetById - Loading finished')
    }
  }

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    fetchPet()
  }, [id, refreshTrigger])

  return {
    pet,
    loading,
    error,
    refetch
  }
}