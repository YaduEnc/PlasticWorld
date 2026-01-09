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
    
    // Provide better error messages
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check if the backend is running.')
    }
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error.message || 'Sign in failed')
    }
    
    throw error
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
