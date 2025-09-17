// Application configuration
export const APP_CONFIG = {
  // Set to false when integrating with real API
  USE_MOCK_DATA: true,

  // API base URL (used when USE_MOCK_DATA is false)
  API_BASE_URL: (typeof process !== 'undefined' ? process.env.REACT_APP_API_URL : undefined) || 'http://localhost:3001',

  // Feature flags
  FEATURES: {
    PDF_EXPORT: true,
    ADVANCED_SEARCH: true,
    PATIENT_PHOTOS: true
  },

  // UI Configuration
  UI: {
    ITEMS_PER_PAGE: 20,
    DEBOUNCE_DELAY: 300
  }
} as const

// Easy way to check if we're in development mode
export const isDevelopment = (typeof process !== 'undefined' ? process.env.NODE_ENV : 'production') === 'development'

// Easy way to check if we're using mock data
export const useMockData = () => APP_CONFIG.USE_MOCK_DATA || isDevelopment