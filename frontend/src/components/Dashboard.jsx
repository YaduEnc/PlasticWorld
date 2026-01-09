import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, signOut } from '../services/authService'
import './Dashboard.css'

const Dashboard = () => {
  const [user, setUser] = useState(null)
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
          <button className="dashboard-signout" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2 className="dashboard-title">Welcome back!</h2>
            <p className="dashboard-subtitle">
              You're successfully signed in to PlasticWorld
            </p>
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Your Profile</h3>
            <div className="dashboard-user-info">
              {user.profilePictureUrl && (
                <img
                  src={user.profilePictureUrl}
                  alt={user.name}
                  className="dashboard-avatar"
                />
              )}
              <div className="dashboard-user-details">
                <p className="dashboard-user-name">{user.name}</p>
                <p className="dashboard-user-email">{user.email}</p>
                <p className="dashboard-user-username">@{user.username}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title">What's Next?</h3>
            <p className="dashboard-card-text">
              Phase 3 will add:
            </p>
            <ul className="dashboard-list">
              <li>Friends list</li>
              <li>Search users</li>
              <li>Friend requests</li>
              <li>Profile settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
