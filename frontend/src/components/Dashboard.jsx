import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, signOut } from '../services/authService'
import FriendsList from './FriendsList'
import SearchUsers from './SearchUsers'
import ProfileSettings from './ProfileSettings'
import './Dashboard.css'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('friends') // 'friends' | 'search' | 'settings'
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      navigate('/signin')
    } else {
      setUser(currentUser)
    }
  }, [navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/signin')
  }

  const handleUserSelect = (selectedUser) => {
    // Navigate to user profile or open chat (future feature)
    console.log('Selected user:', selectedUser)
  }

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="dashboard-nav-container">
          <h1 className="dashboard-logo">PlasticWorld</h1>
          <div className="dashboard-nav-right">
            <div className="dashboard-user-badge">
              {user.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={user.name}
                  className="dashboard-nav-avatar"
                />
              ) : (
                <div className="dashboard-nav-avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="dashboard-nav-username">{user.name}</span>
            </div>
            <button className="dashboard-signout" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-container">
          <div className="dashboard-tabs">
            <button
              className={`dashboard-tab ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </button>
            <button
              className={`dashboard-tab ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              Search
            </button>
            <button
              className={`dashboard-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          <div className="dashboard-tab-content">
            {activeTab === 'friends' && <FriendsList />}
            {activeTab === 'search' && <SearchUsers onUserSelect={handleUserSelect} />}
            {activeTab === 'settings' && <ProfileSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
