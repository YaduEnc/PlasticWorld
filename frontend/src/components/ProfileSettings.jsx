import { useState, useEffect } from 'react'
import { getUserProfile, updateProfile } from '../services/userService'
import { getCurrentUser as getLocalUser } from '../services/authService'
import './ProfileSettings.css'

const ProfileSettings = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    phoneNumber: '',
    profilePictureUrl: '',
  })

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to load from API first
      try {
        const userData = await getUserProfile()
        setUser(userData)
        setFormData({
          name: userData.name || '',
          username: userData.username || '',
          bio: userData.bio || '',
          phoneNumber: userData.phoneNumber || '',
          profilePictureUrl: userData.profilePictureUrl || '',
        })
      } catch (apiError) {
        // If API fails, try to use local storage user
        console.warn('API call failed, using local user data:', apiError)
        const localUser = getLocalUser()
        if (localUser) {
          setUser(localUser)
          setFormData({
            name: localUser.name || '',
            username: localUser.username || '',
            bio: localUser.bio || '',
            phoneNumber: localUser.phoneNumber || '',
            profilePictureUrl: localUser.profilePictureUrl || '',
          })
        } else {
          throw apiError
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to load profile'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)
      
      const updatedUser = await updateProfile(formData)
      setUser(updatedUser)
      setSuccess(true)
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="profile-settings-loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="profile-settings">
      <h2 className="profile-settings-title">Profile Settings</h2>

      {error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      {success && (
        <div className="profile-success">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-form-group">
          <label className="profile-label">Name</label>
          <input
            type="text"
            name="name"
            className="profile-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Username</label>
          <input
            type="text"
            name="username"
            className="profile-input"
            value={formData.username}
            onChange={handleChange}
            required
            pattern="[a-zA-Z0-9_]{3,30}"
            title="Username must be 3-30 characters (letters, numbers, underscore only)"
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Bio</label>
          <textarea
            name="bio"
            className="profile-textarea"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            maxLength={500}
            placeholder="Tell us about yourself..."
          />
          <span className="profile-char-count">
            {formData.bio.length}/500
          </span>
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            className="profile-input"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+1234567890"
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Profile Picture URL</label>
          <input
            type="url"
            name="profilePictureUrl"
            className="profile-input"
            value={formData.profilePictureUrl}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <button
          type="submit"
          className="profile-save-button"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default ProfileSettings
