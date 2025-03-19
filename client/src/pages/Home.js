import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

// Icons
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z"></path>
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="m19 9-5 5-4-4-3 3"></path>
  </svg>
);

const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-text">
            <h1>
              <span className="gradient-text">Master</span> Competitive Programming
            </h1>
            <p>
              Elevate your coding skills with our AI-driven platform.
              Practice with personalized problems, track your progress,
              and prepare for technical interviews with confidence.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/practice" className="btn btn-outline btn-lg">
                Try Demo Problems
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">3491+</span>
                <span className="stat-label">Coding Problems</span>
              </div>
              <div className="stat">
                <span className="stat-number">145k+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">92%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="code-preview">
              <div className="code-header">
                <div className="code-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="code-title">Example Problem</div>
              </div>
              <pre className="code-content"><code>
{`function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return null;
}`}
              </code></pre>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <p>Our platform offers everything you need to excel in competitive programming and technical interviews</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <BrainIcon />
              </div>
              <h3>Adaptive Learning</h3>
              <p>
                Get personalized problem sets based on your performance and
                learning goals, adapting to your skill level as you improve.
              </p>
              <Link to="/register" className="feature-link">
                Learn more <ArrowRightIcon />
              </Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <CodeIcon />
              </div>
              <h3>AI-Powered Problems</h3>
              <p>
                Practice with dynamically generated problems that match your skill level
                and get detailed explanations and hints when you need them.
              </p>
              <Link to="/register" className="feature-link">
                Learn more <ArrowRightIcon />
              </Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <ChartIcon />
              </div>
              <h3>Progress Tracking</h3>
              <p>
                Monitor your improvement with comprehensive analytics and
                performance metrics, visualizing your growth over time.
              </p>
              <Link to="/register" className="feature-link">
                Learn more <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="problem-categories">
        <div className="container">
          <div className="section-header">
            <h2>Explore Problem Categories</h2>
            <p>Master all the important algorithms and data structures</p>
          </div>
          <div className="categories-grid">
            {[
              "Arrays & Strings",
              "Linked Lists",
              "Trees & Graphs",
              "Dynamic Programming",
              "Sorting & Searching",
              "Backtracking",
              "Greedy Algorithms",
              "System Design"
            ].map((category, index) => (
              <div className="category-card" key={index}>
                {category}
              </div>
            ))}
          </div>
          <div className="categories-cta">
            <Link to="/register" className="btn btn-primary">
              Explore All Categories
            </Link>
          </div>
        </div>
      </section>

      <section className="comparison">
        <div className="container">
          <div className="section-header">
            <h2>How We Compare</h2>
            <p>See why our platform offers the best preparation experience</p>
          </div>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Features</th>
                  <th>CodeMentor</th>
                  <th>Other Platforms</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Adaptive difficulty</td>
                  <td><CheckIcon className="check-icon" /></td>
                  <td>Limited</td>
                </tr>
                <tr>
                  <td>AI-generated problems</td>
                  <td><CheckIcon className="check-icon" /></td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>Detailed explanations</td>
                  <td><CheckIcon className="check-icon" /></td>
                  <td>Basic</td>
                </tr>
                <tr>
                  <td>Personalized learning path</td>
                  <td><CheckIcon className="check-icon" /></td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>Interview preparation</td>
                  <td><CheckIcon className="check-icon" /></td>
                  <td>Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>Hear from users who improved their coding skills with our platform</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"This platform helped me master algorithms and prepare for interviews. I landed my dream job at a top tech company thanks to the practice I got here."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">JS</div>
                <div className="author-info">
                  <div className="author-name">Jamie Smith</div>
                  <div className="author-title">Software Engineer at Google</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The personalized problem sets were exactly what I needed. The platform adapted to my skill level and helped me improve gradually without feeling overwhelmed."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">ML</div>
                <div className="author-info">
                  <div className="author-name">Michael Lee</div>
                  <div className="author-title">CS Student at MIT</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The detailed explanations and hints are incredible. I finally understand dynamic programming concepts that I struggled with for months."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">AP</div>
                <div className="author-info">
                  <div className="author-name">Aisha Patel</div>
                  <div className="author-title">Full Stack Developer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Coding Journey?</h2>
            <p>Join thousands of developers who have improved their skills with our platform</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Coding Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 