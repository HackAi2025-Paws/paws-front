import { apiClient } from './apiClient'

// Types based on API documentation
export interface Pet {
  id: number
  name: string
  dateOfBirth: string
  species: string
  sex: string | null
  weight: number | null
  breed: string | null
  owners: Owner[]
  profileImageUrl?: string | null
}

export interface Owner {
  id: number
  name: string
  phone: string
}

export interface PetsResponse {
  data: Pet[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface PetsSearchParams {
  name?: string
  breed?: string
  ownerName?: string
  id?: number
  page?: number
  limit?: number
}

// Pets Service
export class PetsService {
  async searchPets(params: PetsSearchParams = {}): Promise<PetsResponse> {
    // Build query parameters
    const searchParams = new URLSearchParams()

    if (params.name) searchParams.append('name', params.name)
    if (params.breed) searchParams.append('breed', params.breed)
    if (params.ownerName) searchParams.append('ownerName', params.ownerName)
    if (params.id) searchParams.append('id', params.id.toString())
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())

    const queryString = searchParams.toString()
    const endpoint = queryString ? `pets?${queryString}` : 'pets'

    const response = await apiClient.get<PetsResponse>(endpoint)

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch pets')
    }

    // The API response structure is: response.data = { data: [...], pagination: {...} }
    // Return response.data directly since that's the actual API response
    return response.data!
  }

  async getPetById(id: number): Promise<any> {
    const response = await this.searchPets({ id })

    // If response itself is the pet data (not wrapped in data property)
    if (response && 'id' in response) {
      return response
    }

    // Standard format with data property
    if (!response.data || response.data.length === 0) {
      throw new Error(`Pet with id ${id} not found`)
    }

    return response.data[0]
  }

}

// Export singleton instance
export const petsService = new PetsService()
export default petsService