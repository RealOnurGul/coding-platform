import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import '../styles/Practice.css';

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

const Practice = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    status: 'all',
    tags: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Sample problems data
  const sampleProblems = [
    {
      id: 1,
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "Easy",
      tags: ["Arrays", "Hash Table"],
      status: "Solved",
      acceptanceRate: 85,
      avgTime: 12
    },
    {
      id: 2,
      title: "Valid Parentheses",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      difficulty: "Easy",
      tags: ["Stack", "String"],
      status: "Attempted",
      acceptanceRate: 78,
      avgTime: 15
    },
    {
      id: 3,
      title: "Merge K Sorted Lists",
      description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      difficulty: "Hard",
      tags: ["Linked List", "Heap", "Divide and Conquer"],
      status: "To Do",
      acceptanceRate: 45,
      avgTime: 35
    },
    {
      id: 4,
      title: "LRU Cache",
      description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
      difficulty: "Medium",
      tags: ["Design", "Hash Table", "Linked List"],
      status: "Solved",
      acceptanceRate: 65,
      avgTime: 28
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      description: "Given a string s, return the longest palindromic substring in s.",
      difficulty: "Medium",
      tags: ["String", "Dynamic Programming"],
      status: "To Do",
      acceptanceRate: 72,
      avgTime: 22
    },
    {
      id: 6,
      title: "Trapping Rain Water",
      description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      difficulty: "Hard",
      tags: ["Arrays", "Two Pointers", "Dynamic Programming"],
      status: "To Do",
      acceptanceRate: 55,
      avgTime: 30
    },
    {
      id: 7,
      title: "Number of Islands",
      description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
      difficulty: "Medium",
      tags: ["Graph", "BFS", "DFS", "Matrix"],
      status: "Attempted",
      acceptanceRate: 76,
      avgTime: 25
    },
    {
      id: 8,
      title: "Reverse Linked List",
      description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      difficulty: "Easy",
      tags: ["Linked List", "Recursion"],
      status: "Solved",
      acceptanceRate: 92,
      avgTime: 10
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would fetch problems from an API
        setProblems(sampleProblems);
        setFilteredProblems(sampleProblems);
        
        // Get user data
        const userData = await userService.getProfile();
        setUserData(userData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...problems];
    
    // Filter by tab (status)
    if (activeTab !== 'all') {
      filtered = filtered.filter(problem => {
        if (activeTab === 'solved') return problem.status === 'Solved';
        if (activeTab === 'attempted') return problem.status === 'Attempted';
        if (activeTab === 'todo') return problem.status === 'To Do';
        return true;
      });
    }
    
    // Filter by difficulty
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(problem => 
        problem.difficulty.toLowerCase() === filters.difficulty
      );
    }
    
    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(problem => 
        filters.tags.some(tag => problem.tags.includes(tag))
      );
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(problem => 
        problem.title.toLowerCase().includes(query) ||
        problem.description.toLowerCase().includes(query) ||
        problem.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredProblems(filtered);
  }, [problems, filters, searchQuery, activeTab]);

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  const handleTagToggle = (tag) => {
    if (filters.tags.includes(tag)) {
      setFilters({
        ...filters,
        tags: filters.tags.filter(t => t !== tag)
      });
    } else {
      setFilters({
        ...filters,
        tags: [...filters.tags, tag]
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return <div className="loading">Loading practice problems...</div>;
  }

  // Extract all unique tags from problems
  const allTags = [...new Set(problems.flatMap(problem => problem.tags))].sort();

  return (
    <div className="practice-container">
      <header className="practice-header">
        <div className="practice-heading">
          <h1>Practice Problems</h1>
          <p className="subtitle">Sharpen your coding skills with our curated problem sets</p>
        </div>
        <div className="practice-actions">
          <div className="search-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
      </header>

      <div className="practice-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabClick('all')}
        >
          All Problems
        </button>
        <button 
          className={`tab-button ${activeTab === 'solved' ? 'active' : ''}`}
          onClick={() => handleTabClick('solved')}
        >
          Solved
        </button>
        <button 
          className={`tab-button ${activeTab === 'attempted' ? 'active' : ''}`}
          onClick={() => handleTabClick('attempted')}
        >
          Attempted
        </button>
        <button 
          className={`tab-button ${activeTab === 'todo' ? 'active' : ''}`}
          onClick={() => handleTabClick('todo')}
        >
          To Do
        </button>
      </div>

      <div className="practice-content">
        <aside className="practice-filters">
          <div className="filter-section">
            <h3>Difficulty</h3>
            <div className="filter-options">
              <button 
                className={`filter-option ${filters.difficulty === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('difficulty', 'all')}
              >
                All
              </button>
              <button 
                className={`filter-option easy ${filters.difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => handleFilterChange('difficulty', 'easy')}
              >
                Easy
              </button>
              <button 
                className={`filter-option medium ${filters.difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => handleFilterChange('difficulty', 'medium')}
              >
                Medium
              </button>
              <button 
                className={`filter-option hard ${filters.difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => handleFilterChange('difficulty', 'hard')}
              >
                Hard
              </button>
            </div>
          </div>

          <div className="filter-section">
            <h3>Tags</h3>
            <div className="tags-list">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-filter ${filters.tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="problems-display">
          <div className="problems-header">
            <div className="problems-count">
              {filteredProblems.length} {filteredProblems.length === 1 ? 'problem' : 'problems'} found
            </div>
            <div className="sort-options">
              <label htmlFor="sort">Sort by:</label>
              <select id="sort" className="sort-select">
                <option value="id">ID</option>
                <option value="acceptance">Acceptance Rate</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>
          </div>

          {filteredProblems.length === 0 ? (
            <div className="no-problems">
              <p>No problems match your current filters. Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="problems-grid">
              {filteredProblems.map(problem => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice; 