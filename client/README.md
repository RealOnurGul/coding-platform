# Adaptive Competitive Programming Platform - Frontend

This is the frontend application for the Adaptive Competitive Programming Practice Platform. It provides a modern, responsive UI for users to practice coding problems, track their progress, and improve their skills.

## Features

- **User Authentication**: Login and registration system with secure token-based authentication
- **Dashboard**: Visual representation of user progress and problem statistics
- **Practice Area**: Interactive coding environment with problem descriptions and a code editor
- **User Profile**: Customizable user profiles with preferences and statistics
- **Dark/Light Theme**: Toggle between color themes for comfortable viewing
- **AI Assistant**: Chat with an AI assistant for help and guidance (via floating chat button)
- **Responsive Design**: Works well on desktop and mobile devices

## Project Structure

```
client/
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React context for state management
│   ├── pages/             # Main application pages
│   ├── services/          # API service functions
│   ├── styles/            # CSS files
│   ├── utils/             # Utility functions
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
```

## Components

- **NavbarNew**: Main navigation with theme toggle and user menu
- **ChatButton**: Floating chat button for AI assistance
- **ProtectedRoute**: Route guard for authenticated pages

## Pages

- **Home**: Landing page with features and call-to-action
- **Login/Register**: Authentication pages
- **Dashboard**: Overview of user progress and topic statistics
- **Practice**: Interactive coding environment for solving problems
- **Profile**: User profile and preferences management

## Getting Started

1. Clone the repository
2. Navigate to the client directory
3. Install dependencies with `npm install`
4. Create a `.env` file with necessary environment variables
5. Start the development server with `npm start`

## Environment Variables

Create a `.env` file in the client directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5001/api
```

## Available Scripts

- `npm start`: Run the development server
- `npm build`: Build the production version
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## Technologies Used

- React.js
- React Router
- CSS (with CSS variables for theming)
- LocalStorage for client-side data persistence

## Backend API

The frontend communicates with the backend API at `http://localhost:5001/api`. See the server README for details on setting up the backend. 