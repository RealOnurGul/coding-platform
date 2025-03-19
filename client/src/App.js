import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import NavbarNew from './components/NavbarNew';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Profile from './pages/Profile';
import ChatAssistant from './pages/ChatAssistant';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <NavbarNew />
          <div className="content">
            <div className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/features" element={<Home />} />
                <Route path="/pricing" element={<Home />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/practice" 
                  element={
                    <ProtectedRoute>
                      <Practice />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <ChatAssistant />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback redirect */}
                <Route 
                  path="*" 
                  element={
                    localStorage.getItem('token') 
                      ? <Navigate to="/dashboard" replace /> 
                      : <Navigate to="/" replace />
                  } 
                />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 