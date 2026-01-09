import axios from 'axios'
import { API_BASE_URL } from '../config/api'

/**
 * Check if backend is accessible
 * Uses direct axios call to avoid token refresh loops
 */
export const checkBackendHealth = async () => {
  try {
    // Use root endpoint or health endpoint
    const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`, { 
      timeout: 3000 
    })
    return { healthy: true, response }
  } catch (error) {
    // Try root endpoint as fallback
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/`, { 
        timeout: 3000 
      })
      return { healthy: true, response }
    } catch (fallbackError) {
      return { 
        healthy: false, 
        error: error.message || fallbackError.message,
        code: error.code || fallbackError.code
      }
    }
  }
}
