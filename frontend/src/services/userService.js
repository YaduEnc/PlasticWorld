import api from '../config/api'

/**
 * Get current user profile from API
 */
export const getUserProfile = async () => {
  const response = await api.get('/users/me')
  return response.data.data.user
}

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/users/me', profileData)
  return response.data.data.user
}

/**
 * Get public user profile
 */
export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`)
  return response.data.data.user
}

/**
 * Search users
 */
export const searchUsers = async (query, type = 'all', limit = 20, offset = 0) => {
  const response = await api.get('/users/search', {
    params: { q: query, type, limit, offset }
  })
  return response.data.data
}

/**
 * Update user status
 */
export const updateStatus = async (status) => {
  const response = await api.put('/users/me/status', { status })
  return response.data.data
}
