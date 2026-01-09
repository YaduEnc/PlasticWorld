import { useState, useEffect } from 'react'
import { getFriends, getPendingRequests, acceptFriendRequest, denyFriendRequest } from '../services/friendService'
import './FriendsList.css'

const FriendsList = () => {
  const [activeTab, setActiveTab] = useState('friends') // 'friends' | 'requests'
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState({ sent: [], received: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (activeTab === 'friends') {
        const data = await getFriends('accepted')
        setFriends(data.friendships || [])
      } else {
        const data = await getPendingRequests()
        setPendingRequests(data)
      }
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (friendshipId) => {
    try {
      await acceptFriendRequest(friendshipId)
      loadData()
    } catch (err) {
      setError(err.message || 'Failed to accept request')
    }
  }

  const handleDeny = async (friendshipId) => {
    try {
      await denyFriendRequest(friendshipId)
      loadData()
    } catch (err) {
      setError(err.message || 'Failed to deny request')
    }
  }

  if (loading) {
    return (
      <div className="friends-list-loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="friends-list">
      <div className="friends-tabs">
        <button
          className={`friends-tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends ({friends.length})
        </button>
        <button
          className={`friends-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests ({pendingRequests.received?.length || 0})
        </button>
      </div>

      {error && (
        <div className="friends-error">
          {error}
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="friends-content">
          {friends.length === 0 ? (
            <div className="friends-empty">
              <p>No friends yet</p>
              <p className="friends-empty-subtitle">Search for users to add friends</p>
            </div>
          ) : (
            <div className="friends-grid">
              {friends.map((friendship) => (
                <div key={friendship.id} className="friend-card">
                  {friendship.user.profilePictureUrl ? (
                    <img
                      src={friendship.user.profilePictureUrl}
                      alt={friendship.user.name}
                      className="friend-avatar"
                    />
                  ) : (
                    <div className="friend-avatar-placeholder">
                      {friendship.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="friend-info">
                    <p className="friend-name">{friendship.user.name}</p>
                    <p className="friend-username">@{friendship.user.username}</p>
                    <div className="friend-status">
                      <span className={`status-dot ${friendship.user.status}`}></span>
                      <span className="status-text">{friendship.user.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="friends-content">
          {pendingRequests.received?.length === 0 && pendingRequests.sent?.length === 0 ? (
            <div className="friends-empty">
              <p>No pending requests</p>
            </div>
          ) : (
            <>
              {pendingRequests.received && pendingRequests.received.length > 0 && (
                <div className="requests-section">
                  <h3 className="requests-title">Received Requests</h3>
                  <div className="requests-list">
                    {pendingRequests.received.map((request) => (
                      <div key={request.id} className="request-card">
                        {request.user.profilePictureUrl ? (
                          <img
                            src={request.user.profilePictureUrl}
                            alt={request.user.name}
                            className="request-avatar"
                          />
                        ) : (
                          <div className="request-avatar-placeholder">
                            {request.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="request-info">
                          <p className="request-name">{request.user.name}</p>
                          <p className="request-username">@{request.user.username}</p>
                        </div>
                        <div className="request-actions">
                          <button
                            className="request-button accept"
                            onClick={() => handleAccept(request.id)}
                          >
                            Accept
                          </button>
                          <button
                            className="request-button deny"
                            onClick={() => handleDeny(request.id)}
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingRequests.sent && pendingRequests.sent.length > 0 && (
                <div className="requests-section">
                  <h3 className="requests-title">Sent Requests</h3>
                  <div className="requests-list">
                    {pendingRequests.sent.map((request) => (
                      <div key={request.id} className="request-card">
                        {request.user.profilePictureUrl ? (
                          <img
                            src={request.user.profilePictureUrl}
                            alt={request.user.name}
                            className="request-avatar"
                          />
                        ) : (
                          <div className="request-avatar-placeholder">
                            {request.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="request-info">
                          <p className="request-name">{request.user.name}</p>
                          <p className="request-username">@{request.user.username}</p>
                        </div>
                        <div className="request-status">
                          <span className="status-pending">Pending</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default FriendsList
