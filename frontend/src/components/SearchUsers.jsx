import { useState } from 'react'
import { searchUsers } from '../services/userService'
import { sendFriendRequest } from '../services/friendService'
import './SearchUsers.css'

const SearchUsers = ({ onUserSelect }) => {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('all')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sentRequests, setSentRequests] = useState(new Set())

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await searchUsers(query.trim(), searchType)
      setResults(data.users || [])
    } catch (err) {
      setError(err.message || 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId)
      setSentRequests(prev => new Set([...prev, userId]))
    } catch (err) {
      setError(err.message || 'Failed to send friend request')
    }
  }

  return (
    <div className="search-users">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search by username, email, or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="search-type-select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="search-error">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="search-results">
          <h3 className="search-results-title">
            Found {results.length} user{results.length !== 1 ? 's' : ''}
          </h3>
          <div className="search-results-list">
            {results.map((user) => (
              <div key={user.id} className="search-result-card">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={user.name}
                    className="search-result-avatar"
                    onClick={() => onUserSelect && onUserSelect(user)}
                  />
                ) : (
                  <div
                    className="search-result-avatar-placeholder"
                    onClick={() => onUserSelect && onUserSelect(user)}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div
                  className="search-result-info"
                  onClick={() => onUserSelect && onUserSelect(user)}
                >
                  <p className="search-result-name">{user.name}</p>
                  <p className="search-result-username">@{user.username}</p>
                  {user.bio && (
                    <p className="search-result-bio">{user.bio}</p>
                  )}
                </div>
                <button
                  className="search-result-button"
                  onClick={() => handleSendRequest(user.id)}
                  disabled={sentRequests.has(user.id)}
                >
                  {sentRequests.has(user.id) ? 'Request Sent' : 'Add Friend'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {query && !loading && results.length === 0 && (
        <div className="search-empty">
          <p>No users found</p>
          <p className="search-empty-subtitle">Try a different search term</p>
        </div>
      )}
    </div>
  )
}

export default SearchUsers
