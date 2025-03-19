import React, { useState, useEffect, useRef } from 'react';
import userService from '../services/userService';
import '../styles/Profile.css';

// Avatar component that displays the first letter of user's name
const UserAvatar = ({ name = 'User', color, size = 150, onClick, className = '' }) => {
  const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : 'U';
  
  return (
    <div 
      className={`user-avatar ${className}`}
      style={{ 
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2.5}px`
      }}
      onClick={onClick}
    >
      {initial}
    </div>
  );
};

// Available avatar colors
const AVATAR_COLORS = [
  '#4F46E5', // Indigo
  '#0EA5E9', // Sky blue
  '#14B8A6', // Teal
  '#10B981', // Emerald
  '#22C55E', // Green
  '#EAB308', // Yellow
  '#F59E0B', // Amber
  '#F97316', // Orange
  '#EF4444', // Red
  '#EC4899', // Pink
  '#8B5CF6'  // Violet
];

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    avatarColor: AVATAR_COLORS[0],
    preferences: {
      difficulty: 'medium',
      dailyGoal: 1,
      themes: ['arrays', 'strings']
    },
    stats: {
      problemsSolved: {
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0
      },
      submissions: 0,
      activeDays: 0,
      maxStreak: 0
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editedUser, setEditedUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await userService.getProfile();
        // Ensure default avatarColor if not present
        if (!userData.avatarColor) {
          userData.avatarColor = AVATAR_COLORS[0];
        }
        setUser(userData);
        setEditedUser(userData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load user profile. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  useEffect(() => {
    setEditedUser(user);
  }, [user]);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset to original values if cancelling
    if (isEditing) {
      setEditedUser(user);
      setShowColorPicker(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setEditedUser({
        ...editedUser,
        [section]: {
          ...editedUser[section],
          [field]: value
        }
      });
    } else {
      setEditedUser({
        ...editedUser,
        [name]: value
      });
    }
  };
  
  const handleAvatarColorChange = (color) => {
    setEditedUser({
      ...editedUser,
      avatarColor: color
    });
    setShowColorPicker(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      const updatedUser = await userService.updateProfile(editedUser);
      setUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update profile');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDifficultyChange = (difficulty) => {
    setEditedUser({
      ...editedUser,
      preferences: {
        ...editedUser.preferences,
        difficulty
      }
    });
  };
  
  const handleThemeToggle = (theme) => {
    const currentThemes = editedUser.preferences.themes || [];
    let newThemes;
    
    if (currentThemes.includes(theme)) {
      newThemes = currentThemes.filter(t => t !== theme);
    } else {
      newThemes = [...currentThemes, theme];
    }
    
    setEditedUser({
      ...editedUser,
      preferences: {
        ...editedUser.preferences,
        themes: newThemes
      }
    });
  };
  
  if (isLoading) {
    return <div className="loading-spinner">Loading profile...</div>;
  }
  
  return (
    <div className="profile-container">
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          
          <div className="profile-header">
            <div className="profile-avatar-container">
              <UserAvatar 
                name={user.name} 
                color={isEditing ? editedUser.avatarColor : user.avatarColor}
                className={isEditing ? "editable" : ""}
                onClick={() => isEditing && setShowColorPicker(!showColorPicker)}
              />
              
              {isEditing && (
                <div className="avatar-edit-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </div>
              )}
              
              {showColorPicker && (
                <div className="color-picker">
                  {AVATAR_COLORS.map(color => (
                    <button
                      key={color}
                      className={`color-option ${color === editedUser.avatarColor ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleAvatarColorChange(color)}
                    ></button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="profile-info">
              <h1>{user.name || 'User Profile'}</h1>
              <p className="profile-email">{user.email}</p>
              
              <button 
                className={`edit-toggle ${isEditing ? 'save-mode' : ''} ${isSaving ? 'disabled' : ''}`}
                onClick={handleEditToggle}
                disabled={isSaving}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              
              {isEditing && (
                <button 
                  className={`save-button ${isSaving ? 'loading' : ''}`}
                  onClick={handleSubmit}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
          
          <div className="profile-content">
            <div className="profile-sidebar">
              <div className="user-stats-card">
                <h2>Your Stats</h2>
                <div className="stat-item">
                  <span className="stat-label">Problems Solved</span>
                  <span className="stat-value">{user?.stats?.problemsSolved?.total || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Submissions</span>
                  <span className="stat-value">{user?.stats?.submissions || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active Days</span>
                  <span className="stat-value">{user?.stats?.activeDays || 0} days</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Max Streak</span>
                  <span className="stat-value">{user?.stats?.maxStreak || 0} days</span>
                </div>
              </div>
              
              <div className="difficulty-distribution-card">
                <h2>Problems by Difficulty</h2>
                <div className="difficulty-distribution">
                  <div className="difficulty-bar">
                    <div className="difficulty-label">Easy</div>
                    <div className="bar-container">
                      <div 
                        className="bar easy" 
                        style={{width: `${Math.min(100, (user?.stats?.problemsSolved?.easy || 0) / (user?.stats?.problemsSolved?.total || 1) * 100)}%`}}
                      ></div>
                    </div>
                    <div className="difficulty-count">{user?.stats?.problemsSolved?.easy || 0}</div>
                  </div>
                  <div className="difficulty-bar">
                    <div className="difficulty-label">Medium</div>
                    <div className="bar-container">
                      <div 
                        className="bar medium" 
                        style={{width: `${Math.min(100, (user?.stats?.problemsSolved?.medium || 0) / (user?.stats?.problemsSolved?.total || 1) * 100)}%`}}
                      ></div>
                    </div>
                    <div className="difficulty-count">{user?.stats?.problemsSolved?.medium || 0}</div>
                  </div>
                  <div className="difficulty-bar">
                    <div className="difficulty-label">Hard</div>
                    <div className="bar-container">
                      <div 
                        className="bar hard" 
                        style={{width: `${Math.min(100, (user?.stats?.problemsSolved?.hard || 0) / (user?.stats?.problemsSolved?.total || 1) * 100)}%`}}
                      ></div>
                    </div>
                    <div className="difficulty-count">{user?.stats?.problemsSolved?.hard || 0}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-main">
              {isEditing ? (
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editedUser.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={editedUser.bio || ""}
                      onChange={handleInputChange}
                      rows="4"
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label>Preferred Difficulty</label>
                    <div className="difficulty-options">
                      <div 
                        className={`difficulty-option ${editedUser?.preferences?.difficulty === 'easy' ? 'selected' : ''}`}
                        onClick={() => handleDifficultyChange('easy')}
                      >
                        Easy
                      </div>
                      <div 
                        className={`difficulty-option ${editedUser?.preferences?.difficulty === 'medium' ? 'selected' : ''}`}
                        onClick={() => handleDifficultyChange('medium')}
                      >
                        Medium
                      </div>
                      <div 
                        className={`difficulty-option ${editedUser?.preferences?.difficulty === 'hard' ? 'selected' : ''}`}
                        onClick={() => handleDifficultyChange('hard')}
                      >
                        Hard
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="dailyGoal">Daily Goal (problems)</label>
                    <input
                      type="number"
                      id="dailyGoal"
                      name="preferences.dailyGoal"
                      value={editedUser?.preferences?.dailyGoal || 1}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Preferred Topics</label>
                    <div className="topics-checkboxes">
                      {['arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dp', 'sorting'].map(theme => (
                        <div className="topic-checkbox" key={theme}>
                          <label>
                            <input
                              type="checkbox"
                              checked={editedUser?.preferences?.themes?.includes(theme) || false}
                              onChange={() => handleThemeToggle(theme)}
                            />
                            {theme.charAt(0).toUpperCase() + theme.slice(1).replace('-', ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="detail-section">
                    <h2>Personal Information</h2>
                    <div className="detail-item">
                      <span className="detail-label">Name</span>
                      <span className="detail-value">{user.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bio</span>
                      <span className="detail-value bio-text">
                        {user.bio || "No bio added yet. Click 'Edit Profile' to add a bio."}
                      </span>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h2>Preferences</h2>
                    <div className="detail-item">
                      <span className="detail-label">Preferred Difficulty</span>
                      <span className="detail-value">
                        <span className={`difficulty ${user?.preferences?.difficulty || 'medium'}`}>
                          {user?.preferences?.difficulty 
                            ? user.preferences.difficulty.charAt(0).toUpperCase() + user.preferences.difficulty.slice(1) 
                            : 'Medium'}
                        </span>
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Daily Goal</span>
                      <span className="detail-value">{user?.preferences?.dailyGoal || 1} problems</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Preferred Topics</span>
                      <div className="topics-list">
                        {user?.preferences?.themes?.map(theme => (
                          <span className="topic-tag" key={theme}>
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile; 