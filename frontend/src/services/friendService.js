import api from '../config/api'

/**
 * Get friends list
 */
export const getFriends = async (status = 'accepted', limit = 50, offset = 0) => {
  const response = await api.get('/friends', {
    params: { status, limit, offset }
  })
  return response.data.data
}

/**
 * Get pending friend requests
 */
export const getPendingRequests = async () => {
  const response = await api.get('/friends/requests/pending')
  return response.data.data
}

/**
 * Send friend request
 */
export const sendFriendRequest = async (userId) => {
  const response = await api.post('/friends/request', { userId })
  return response.data.data.friendship
}

/**
 * Accept friend request
 */
export const acceptFriendRequest = async (friendshipId) => {
  const response = await api.post(`/friends/${friendshipId}/accept`)
  return response.data.data.friendship
}

/**
 * Deny friend request
 */
export const denyFriendRequest = async (friendshipId) => {
  const response = await api.post(`/friends/${friendshipId}/deny`)
  return response.data.data.friendship
}

/**
 * Unfriend user
 */
export const unfriend = async (friendshipId) => {
  const response = await api.delete(`/friends/${friendshipId}`)
  return response.data
}

/**
 * Block user
 */
export const blockUser = async (userId, reason = '') => {
  const response = await api.post(`/friends/${userId}/block`, { reason })
  return response.data.data.block
}

/**
 * Unblock user
 */
export const unblockUser = async (userId) => {
  const response = await api.delete(`/friends/${userId}/unblock`)
  return response.data
}
