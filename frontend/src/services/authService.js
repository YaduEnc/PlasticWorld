import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
import api from '../config/api'

/**
 * Sign in with Google
 * @param {Function} progressCallback - Optional callback for progress updates
 */
export const signInWithGoogle = async (progressCallback) => {
  try {
    // Step 1: Sign in with Firebase
    if (progressCallback) progressCallback('Connecting to Google...')
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Step 2: Get ID token
    if (progressCallback) progressCallback('Getting authentication token...')
    const idToken = await user.getIdToken()
    
    // Step 3: Prepare device info
    const deviceInfo = {
      deviceName: navigator.userAgent.substring(0, 100), // Limit length
      deviceType: 'web',
    }
    
    // Step 4: Sign in to backend
    if (progressCallback) progressCallback('Signing in to PlasticWorld...')
    const response = await api.post('/auth/google-signin', {
      idToken,
      deviceInfo,
    })
    
    if (response.data.success) {
      const { accessToken, refreshToken, user: userData } = response.data.data
      
      // Step 5: Store tokens
      if (progressCallback) progressCallback('Saving your session...')
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return { success: true, user: userData }
    }
    
    throw new Error('Sign in failed')
  } catch (error) {
    console.error('Sign in error:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method
      }
    })
    
    // Provide better error messages
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://plasticworld.yaduraj.me/api/v1'
      if (apiUrl.includes('localhost')) {
        throw new Error('Cannot connect to local backend. Make sure the backend is running on localhost:3000, or set VITE_API_URL to use production backend.')
      } else {
        throw new Error('Cannot connect to backend server. Please check your internet connection or try again later.')
      }
    }
    
    // Handle CORS errors
    if (error.message?.includes('CORS') || error.code === 'ERR_CORS') {
      throw new Error('CORS error: Backend may not be configured to allow requests from this origin.')
    }
    
    // Handle timeout
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error('Request timed out. The backend server may be slow or unavailable.')
    }
    
    // Handle specific HTTP errors
    if (error.response) {
      const status = error.response.status
      const errorData = error.response.data?.error
      
      if (status === 401) {
        throw new Error('Authentication failed. Please try signing in again.')
      } else if (status === 403) {
        throw new Error('Access denied. Please check your permissions.')
      } else if (status === 404) {
        throw new Error('Backend endpoint not found. Please check the API URL.')
      } else if (status >= 500) {
        throw new Error('Backend server error. Please try again later.')
      } else if (errorData?.message) {
        throw new Error(errorData.message)
      } else {
        throw new Error(`Sign in failed: ${error.response.statusText || 'Unknown error'}`)
      }
    }
    
    // Generic error fallback
    throw new Error(error.message || 'Sign in failed. Please try again.')
  }
}

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    // Call backend logout
    await api.post('/auth/logout')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Clear local storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    // Sign out from Firebase
    await auth.signOut()
  }
}

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken')
}
