import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
import api from '../config/api'

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    // Sign in with Firebase
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Get ID token
    const idToken = await user.getIdToken()
    
    // Get device info
    const deviceInfo = {
      deviceName: navigator.userAgent,
      deviceType: 'web',
    }
    
    // Sign in to backend
    const response = await api.post('/auth/google-signin', {
      idToken,
      deviceInfo,
    })
    
    if (response.data.success) {
      const { accessToken, refreshToken, user: userData } = response.data.data
      
      // Store tokens and user data
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
