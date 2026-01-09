import axios from 'axios'
import { API_BASE_URL } from '../config/api'

/**
 * Check if backend is accessible
 * Uses direct axios call to avoid token refresh loops
 */
export const checkBackendHealth = async () => {
  try {
    // Get base URL without /api/v1
    const baseUrl = API_BASE_URL.replace('/api/v1', '')
    
    // Try health endpoint first
    const response = await axios.get(`${baseUrl}/health`, { 
      timeout: 3000 
    })
    return { healthy: true, response }
  } catch (error) {
    return { 
      healthy: false, 
      error: error.message,
      code: error.code,
      message: 'Backend server is not accessible'
    }
  }
}
