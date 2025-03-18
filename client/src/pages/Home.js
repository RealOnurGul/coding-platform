import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <h1>Master Competitive Programming</h1>
          <p>
            Practice with AI-generated problems, track your progress, and improve
            your coding skills.
          </p>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Adaptive Learning</h3>
              <p>
                Get personalized problem sets based on your performance and
                learning goals.
              </p>
            </div>
            <div className="feature-card">
              <h3>AI-Powered Problems</h3>
              <p>
                Practice with dynamically generated problems and get detailed
                explanations.
              </p>
            </div>
            <div className="feature-card">
              <h3>Progress Tracking</h3>
              <p>
                Monitor your improvement with comprehensive analytics and
                performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 