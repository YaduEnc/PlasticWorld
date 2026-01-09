import axios from 'axios'

// API Base URL
// Priority: 1. VITE_API_URL env var, 2. Check if localhost backend is running, 3. Use production
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'

// Default to production backend (can be overridden with VITE_API_URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://plasticworld.yaduraj.me/api/v1'
const WS_URL = import.meta.env.VITE_WS_URL || 'wss://plasticworld.yaduraj.me'

// If you want to use localhost backend, set VITE_API_URL=http://localhost:3000/api/v1 in .env file

// Log API configuration (only in development)
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    isDevelopment,
    API_BASE_URL,
    WS_URL,
    env: import.meta.env.MODE
  })
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: isDevelopment ? 5000 : 15000, // Shorter timeout for dev, longer for prod
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        // Try to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data.data

        // Update tokens
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/signin'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export { API_BASE_URL, WS_URL }
export default api
