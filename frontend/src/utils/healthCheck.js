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
    
    // Try health endpoint first with longer timeout for Cloudflare Tunnel
    const response = await axios.get(`${baseUrl}/health`, { 
      timeout: 10000 // 10 seconds for health check
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
