import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import '../styles/Dashboard.css';

// Icons
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// Problem Card Component
const ProblemCard = ({ problem }) => {
  const difficultyClass = problem.difficulty.toLowerCase();
  
  return (
    <div className={`problem-card ${difficultyClass}`}>
      <div className="problem-header">
        <h3 className="problem-title">
          <Link to={`/problems/${problem.id}`}>{problem.title}</Link>
        </h3>
        <span className={`problem-difficulty ${difficultyClass}`}>
          {problem.difficulty}
        </span>
      </div>
      <p className="problem-description">{problem.description}</p>
      <div className="problem-tags">
        {problem.tags.map((tag, index) => (
          <span key={index} className="problem-tag">{tag}</span>
        ))}
      </div>
      <div className="problem-meta">
        <span className="problem-stat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          {problem.acceptanceRate}% acceptance
        </span>
        <span className="problem-stat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {problem.avgTime} min
        </span>
      </div>
      <Link to={`/problems/${problem.id}`} className="solve-button">Solve Now</Link>
    </div>
  );
};

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [recommendedProblems, setRecommendedProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample problems data (in a real app, this would come from an API)
  const sampleProblems = [
    {
      id: 1,
      title: "Two Sum",
      description: "Find two numbers in an array that add up to a specific target.",
      difficulty: "Easy",
      tags: ["Arrays", "Hash Table"],
      acceptanceRate: 85,
      avgTime: 12
    },
    {
      id: 2,
      title: "Valid Parentheses",
      description: "Determine if the input string has valid parentheses pairs.",
      difficulty: "Easy",
      tags: ["Stack", "String"],
      acceptanceRate: 78,
      avgTime: 15
    },
    {
      id: 3,
      title: "Merge K Sorted Lists",
      description: "Merge k sorted linked lists into one sorted linked list.",
      difficulty: "Hard",
      tags: ["Linked List", "Heap", "Divide and Conquer"],
      acceptanceRate: 45,
      avgTime: 35
    },
    {
      id: 4,
      title: "LRU Cache",
      description: "Design and implement a data structure for Least Recently Used (LRU) cache.",
      difficulty: "Medium",
      tags: ["Design", "Hash Table", "Linked List"],
      acceptanceRate: 65,
      avgTime: 28
    }
  ];
  
  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const data = await userService.getProfile();
        setUserData(data);
        
        // Get recommended problems (in a real app, this would be based on user preferences)
        // For now, we'll just use the sample problems
        setRecommendedProblems(sampleProblems);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  if (isLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {userData?.name || 'Coder'}!</h1>
          <p className="subtitle">Here's your coding progress and recommendations</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/practice" className="action-button primary">Practice Now</Link>
          <Link to="/chat-assistant" className="action-button secondary">Get AI Help</Link>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon solved">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Problems Solved</h3>
            <div className="stat-value">{userData?.stats?.problemsSolved?.total || 0}</div>
            <div className="stat-breakdown">
              <span className="easy">{userData?.stats?.problemsSolved?.easy || 0} Easy</span>
              <span className="medium">{userData?.stats?.problemsSolved?.medium || 0} Medium</span>
              <span className="hard">{userData?.stats?.problemsSolved?.hard || 0} Hard</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon streak">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Current Streak</h3>
            <div className="stat-value">{userData?.stats?.maxStreak || 0} days</div>
            <div className="streak-subtitle">Active for {userData?.stats?.activeDays || 0} days total</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon submissions">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Submissions</h3>
            <div className="stat-value">{userData?.stats?.submissions || 0}</div>
            <div className="streak-subtitle">Keep practicing to improve!</div>
          </div>
        </div>
      </div>

      <div className="dashboard-daily-goal">
        <div className="goal-header">
          <h2>Daily Goal</h2>
          <span className="goal-progress">{userData?.stats?.problemsSolved?.today || 0} / {userData?.preferences?.dailyGoal || 1} problems</span>
        </div>
        <div className="goal-progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min(100, ((userData?.stats?.problemsSolved?.today || 0) / (userData?.preferences?.dailyGoal || 1)) * 100)}%` 
            }}
          ></div>
        </div>
      </div>
    
      <section className="dashboard-section">
        <h2>Recommended Problems</h2>
        <div className="problems-grid">
          {recommendedProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      </section>
      
      <section className="dashboard-section">
        <h2>Recent Activity</h2>
        <div className="activity-timeline">
          <div className="activity-item">
            <div className="activity-icon solved">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="activity-content">
              <span className="activity-text">You solved <strong>Binary Search</strong></span>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon submission">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </div>
            <div className="activity-content">
              <span className="activity-text">You submitted a solution to <strong>Maximum Subarray</strong></span>
              <span className="activity-time">Yesterday</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon streak">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <div className="activity-content">
              <span className="activity-text">You reached a <strong>7-day streak</strong>!</span>
              <span className="activity-time">2 days ago</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 