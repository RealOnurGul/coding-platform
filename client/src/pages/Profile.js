import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([
    { id: 1, name: 'Data Structures', level: 0, problemsSolved: 0 },
    { id: 2, name: 'Algorithms', level: 0, problemsSolved: 0 },
    { id: 3, name: 'System Design', level: 0, problemsSolved: 0 },
    { id: 4, name: 'Problem Solving', level: 0, problemsSolved: 0 },
    { id: 5, name: 'Dynamic Programming', level: 0, problemsSolved: 0 },
    { id: 6, name: 'Graph Theory', level: 0, problemsSolved: 0 },
    { id: 7, name: 'String Manipulation', level: 0, problemsSolved: 0 },
    { id: 8, name: 'Sorting & Searching', level: 0, problemsSolved: 0 },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user data
    fetchUserData(token);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getLevelColor = (level) => {
    if (level >= 80) return '#22c55e'; // Green
    if (level >= 60) return '#3b82f6'; // Blue
    if (level >= 40) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        {user && (
          <div className="user-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        )}
      </div>

      <div className="skills-section">
        <h2>Skills & Progress</h2>
        <div className="skills-grid">
          {skills.map(skill => (
            <div key={skill.id} className="skill-card">
              <h3>{skill.name}</h3>
              <div className="skill-progress">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${skill.level}%`,
                    backgroundColor: getLevelColor(skill.level)
                  }}
                />
                <span className="progress-text">{skill.level}%</span>
              </div>
              <div className="skill-stats">
                <p>Problems Solved: {skill.problemsSolved}</p>
                <button className="practice-btn">Practice</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          <div className="achievement-card">
            <h3>First Problem Solved</h3>
            <p>Complete your first coding problem</p>
          </div>
          <div className="achievement-card">
            <h3>Algorithm Master</h3>
            <p>Solve 50 algorithm problems</p>
          </div>
          <div className="achievement-card">
            <h3>Speed Demon</h3>
            <p>Solve a problem in under 5 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 