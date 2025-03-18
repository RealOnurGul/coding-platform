# Adaptive Competitive Programming Practice Platform

An AI-driven platform that helps users improve their competitive programming and interview skills through personalized problem generation and learning.

## Features

- **Adaptive Learning**: Personalized problem sets based on user performance
- **AI-Powered Problem Generation**: Dynamic problem creation with detailed explanations
- **Modern UI**: Clean, intuitive interface for problem-solving and progress tracking
- **User Authentication**: Secure login and profile management
- **Progress Tracking**: Comprehensive dashboard for monitoring improvement

## Tech Stack

- **Frontend**: React.js with plain JavaScript and CSS
- **Backend**: Node.js/Express
- **Database**: PostgreSQL
- **AI Integration**: OpenAI API (planned)

## Project Structure

```
coding-platform/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js/Express server
├── database/              # Database migrations and seeds
└── docs/                  # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/coding-platform.git
cd coding-platform
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables:
```bash
# In the server directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.