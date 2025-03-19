import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import authService from '../services/authService';
import '../styles/NavbarNew.css';

// Icons
import { Sun, Moon, Menu, Code, LayoutDashboard, BookOpen, User, LogOut, MessageSquare } from 'lucide-react';

const NavbarNew = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status whenever location changes
  useEffect(() => {
    const checkAuth = () => {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    };
    
    checkAuth();
    
    // Add event listener for storage changes (for multi-tab support)
    window.addEventListener('storage', checkAuth);
    
    // Add custom event listener for auth state changes
    window.addEventListener('authStateChanged', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authStateChanged', checkAuth);
    };
  }, [location]);

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authStateChanged'));
    
    navigate('/');
  };

  const toggleDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const closeDropdown = () => {
    setUserDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  // Generate user's initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get user avatar color
  const getUserAvatarColor = () => {
    if (currentUser && currentUser.avatarColor) {
      return currentUser.avatarColor;
    }
    return '#6366f1'; // Default color
  };

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
    closeDropdown();
  }, [location]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <Code size={24} className="navbar-logo-icon" />
            Code<span>Platform</span>
          </Link>
        </div>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          {currentUser && (
            <>
              <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>
              <NavLink to="/practice" className={({isActive}) => isActive ? 'active' : ''}>
                <BookOpen size={18} />
                Practice
              </NavLink>
              <NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>
                <User size={18} />
                Profile
              </NavLink>
              <NavLink to="/chat" className={({isActive}) => isActive ? 'active' : ''}>
                <MessageSquare size={18} />
                Chat
              </NavLink>
              
              <button className="logout-link mobile-only" onClick={handleLogout}>
                <LogOut size={18} />
                Log Out
              </button>
            </>
          )}
          
          {!currentUser && (
            <div className="mobile-only auth-links">
              <Link to="/login" className="dropdown-item">
                Log In
              </Link>
              <Link to="/register" className="dropdown-item">
                Sign Up
              </Link>
            </div>
          )}
          
          {!currentUser && (
            <>
              <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>
                Home
              </NavLink>
              <NavLink to="/features" className={({isActive}) => isActive ? 'active' : ''}>
                Features
              </NavLink>
              <NavLink to="/pricing" className={({isActive}) => isActive ? 'active' : ''}>
                Pricing
              </NavLink>
            </>
          )}
        </div>

        <div className="navbar-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {currentUser ? (
            <div className="user-dropdown-container">
              <div className="user-avatar-wrapper" onClick={toggleDropdown}>
                <div 
                  className="user-avatar"
                  style={{ 
                    backgroundColor: getUserAvatarColor(),
                    width: '36px', 
                    height: '36px',
                    fontSize: '16px' 
                  }}
                >
                  {getInitials(currentUser.name)}
                </div>
              </div>

              {userDropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-user-info">
                    <div 
                      className="user-avatar"
                      style={{ 
                        backgroundColor: getUserAvatarColor(),
                        width: '40px', 
                        height: '40px',
                        fontSize: '16px' 
                      }}
                    >
                      {getInitials(currentUser.name)}
                    </div>
                    <div className="user-info-text">
                      <span className="user-name">{currentUser.name}</span>
                      <span className="user-role">{currentUser.role || 'User'}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={closeDropdown}>
                    <User size={18} />
                    Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Log In
              </Link>
              <Link to="/register" className="signup-btn">
                Sign Up
              </Link>
            </div>
          )}

          <div className="menu-icon" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarNew;