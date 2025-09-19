// API Client with SOLID principles

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ApiClient {
  get<T>(endpoint: string): Promise<ApiResponse<T>>
  post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  delete<T>(endpoint: string): Promise<ApiResponse<T>>
}

class HttpApiClient implements ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const session = JSON.parse(localStorage.getItem("vetcare.session") ?? "{}");
      const token = session.token || session.accessToken;
      const url = `${this.baseUrl}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const responseData = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: responseData.message || responseData.error || 'Request failed',
        }
      }

      return {
        success: true,
        data: responseData.data || responseData,
        message: responseData.message,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
    })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// Factory for creating API client
export const createApiClient = (baseUrl?: string): ApiClient => {
  const envUrl = import.meta.env?.VITE_BACK_URL
  const processUrl = typeof process !== 'undefined' ? process.env.BACK_URL : undefined
  const fallbackUrl = 'http://localhost:3001/api/'

  const url = baseUrl || envUrl || processUrl || fallbackUrl

  console.log('🔧 API Client Config:', {
    baseUrl,
    envUrl,
    processUrl,
    finalUrl: url
  })

  return new HttpApiClient(url)
}

// Default instance
export const apiClient = createApiClient()