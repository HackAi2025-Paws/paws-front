import { env } from '../config/env'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}

class ApiClient {
  private baseURL: string
  private headers: HeadersInit

  constructor(baseUrl?: string) {
    // Usar la misma lógica que el módulo de veterinarios
    const envUrl = import.meta.env?.VITE_BACK_URL
    const fallbackUrl = 'https://b41030c93352.ngrok-free.app/api/'
    
    this.baseURL = (baseUrl || envUrl || env.API_BASE_URL || fallbackUrl).replace(/\/$/, '')
    this.headers = {
      'Content-Type': 'application/json',
    }
    
    if (env.DEBUG_MODE) {
      console.log('🔧 API Client Config:', {
        baseUrl,
        envUrl,
        finalUrl: this.baseURL
      })
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem(env.AUTH_TOKEN_KEY)
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken()
    
    if (env.DEBUG_MODE) {
      console.log('🔑 Auth Debug:', {
        tokenExists: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
        authKey: env.AUTH_TOKEN_KEY
      })
    }
    
    return {
      ...this.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
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

  private buildURL(endpoint: string, params?: Record<string, unknown>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${this.baseURL}/${cleanEndpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    return url.toString()
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, params)
    
    if (env.DEBUG_MODE) {
      console.log('🔗 GET:', url)
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint)
    const headers = this.getAuthHeaders()
    
    if (env.DEBUG_MODE) {
      console.log('📤 POST:', url, data)
      console.log('📤 POST Headers:', headers)
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (env.DEBUG_MODE) {
      console.log('📥 POST Response Status:', response.status, response.statusText)
      console.log('📥 POST Response Headers:', Object.fromEntries(response.headers.entries()))
    }

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint)
    
    if (env.DEBUG_MODE) {
      console.log('📝 PUT:', url, data)
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint)
    
    if (env.DEBUG_MODE) {
      console.log('🗑️ DELETE:', url)
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    return this.handleResponse<T>(response)
  }

  // Método para cargar archivos
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint)
    const token = this.getAuthToken()
    
    if (env.DEBUG_MODE) {
      console.log('📁 UPLOAD:', url)
    }

    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    })

    return this.handleResponse<T>(response)
  }

  // Test de conectividad
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${env.BACKEND_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      if (env.DEBUG_MODE) {
        console.error('❌ Backend connection test failed:', error)
      }
      return false
    }
  }
}

export const apiClient = new ApiClient()
export default apiClient
