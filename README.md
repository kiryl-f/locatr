# 🌍 Locatr - GeoGuessr Clone

A full-stack geolocation guessing game built with React, Node.js, PostgreSQL, and GraphQL. Features multi-round gameplay, JWT authentication, leaderboards, and player statistics.

![Tech Stack](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Node.js](https://img.shields.io/badge/Node.js-Latest-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)
![GraphQL](https://img.shields.io/badge/GraphQL-16-pink)

## 🎮 Features

### Core Gameplay
- 🗺️ Interactive street view navigation (Mapillary)
- 📍 Map-based location guessing (MapLibre GL)
- 🎯 Distance calculation and scoring system
- 🌍 Multiple regions (Europe, USA)
- ⏱️ Game modes (Classic, Timed)
- 📊 5-round game sessions with cumulative scoring

### Authentication & Security
- 🔐 JWT-based authentication with HTTP-only cookies
- 🔄 Automatic token refresh (access + refresh tokens)
- 🔒 bcrypt password hashing
- 🛡️ CORS with credentials
- ✅ Protected routes (frontend + backend)
- 🚫 XSS and CSRF protection

### User Features
- 👤 User registration and login
- 📈 Personal statistics dashboard
- 🏆 Global leaderboard (filterable by region/mode)
- 📜 Game history tracking
- 🎮 Guest mode (play without account)

### Technical Highlights
- 🗄️ PostgreSQL with Prisma ORM
- 🔄 GraphQL API with queries and mutations
- 📦 Zustand state management
- 🎨 SCSS modules for styling
- 🔍 Indexed database queries
- ⚡ Optimized performance

## 🏗️ Architecture

```
locatr/
├── locatr-be/          # Backend (Node.js + GraphQL + PostgreSQL)
│   ├── prisma/         # Database schema and migrations
│   ├── src/
│   │   ├── auth/       # Authentication logic (JWT, bcrypt)
│   │   ├── data/       # Static data (images.json)
│   │   ├── schema.js   # GraphQL schema
│   │   ├── resolvers.js # GraphQL resolvers
│   │   └── index.js    # Server entry point
│   └── package.json
│
└── locatr-fe/          # Frontend (React + TypeScript)
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── stores/     # Zustand stores
    │   ├── graphql/    # GraphQL queries/mutations
    │   ├── hooks/      # Custom React hooks
    │   └── utils/      # Utility functions
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd locatr
```

### 2. Backend Setup

```bash
cd locatr-be

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and secrets

# Run database migrations
npx prisma migrate dev --name init
npx prisma generate

# Start the server
npm start
```

Backend will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd locatr-fe

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API URL and Mapillary token

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Create PostgreSQL Database

```bash
# Using psql
createdb locatr

# Or using PostgreSQL client
psql -U postgres
CREATE DATABASE locatr;
```

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/locatr"
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
VITE_MAPILLARY_TOKEN=your_mapillary_token
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:4000/graphql
VITE_MAPILLARY_TOKEN=your_mapillary_token_here
```

## 📊 Database Schema

```prisma
User {
  id, email, username, password (hashed)
  gameSessions, leaderboardEntries, refreshTokens
}

GameSession {
  id, userId, region, mode, totalScore, completed
  rounds[]
}

Round {
  roundNumber, imageId, actualLat, actualLng
  guessLat, guessLng, distance, points
}

LeaderboardEntry {
  username, score, region, mode
}

RefreshToken {
  token, userId, expiresAt
}
```

## 🔐 Authentication Flow

1. **Registration/Login** → JWT tokens set in HTTP-only cookies
2. **Access Token** (15 min) → Used for API requests
3. **Refresh Token** (7 days) → Used to get new access tokens
4. **Auto-refresh** → Tokens refreshed every 12 minutes
5. **Logout** → Tokens revoked and cookies cleared

## 🎯 API Endpoints

### Public Queries
- `randomImage(region)` - Get random street view location
- `leaderboard(region, mode, limit)` - Get top scores
- `locationNameByCoords(lat, lon)` - Reverse geocoding

### Protected Queries (Require Auth)
- `me` - Get current user
- `playerStats` - Get personal statistics
- `myGames(limit)` - Get user's game history

### Mutations
- `register(email, username, password)` - Create account
- `login(email, password)` - Authenticate
- `logout` - End session
- `refreshToken` - Get new access token
- `startGame(region, mode)` - Start 5-round game
- `submitRound(...)` - Submit round result
- `completeGame(sessionId, username)` - Finish game

## 🛡️ Security Features

✅ HTTP-only cookies (no JavaScript access)  
✅ Secure flag in production (HTTPS only)  
✅ SameSite cookie attribute (CSRF protection)  
✅ bcrypt password hashing (12 salt rounds)  
✅ Token expiration and rotation  
✅ Refresh token revocation on logout  
✅ Database-backed refresh tokens  
✅ CORS with credentials  
✅ Protected routes (frontend + backend)  
✅ Automatic token refresh  

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **API**: Apollo Server (GraphQL)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Middleware**: cookie-parser, cors

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **GraphQL Client**: Apollo Client
- **Routing**: React Router
- **State**: Zustand
- **Maps**: MapLibre GL
- **Street View**: Mapillary JS
- **Styling**: SCSS Modules

## 🧪 Testing the App

1. **Register** a new account at `/register`
2. **Login** at `/login`
3. **Start a game** from the main menu
4. **Play 5 rounds** - guess locations on the map
5. **View summary** - see your score and stats
6. **Submit to leaderboard** - save your score
7. **Check stats** - view your performance

## 📝 Development

### Run Backend in Dev Mode
```bash
cd locatr-be
npm run dev
```

### Run Frontend in Dev Mode
```bash
cd locatr-fe
npm run dev
```

### Database Migrations
```bash
cd locatr-be
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

### View Database
```bash
cd locatr-be
npx prisma studio
```

## 🚢 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong secrets for JWT tokens
3. Enable HTTPS
4. Set proper CORS origins
5. Use connection pooling for database

### Frontend
1. Build: `npm run build`
2. Serve `dist` folder
3. Set production API URL
4. Enable HTTPS

## 📚 Documentation

### Getting Started
- **[Quick Reference](./QUICK_REFERENCE.md)** ⚡ - Commands, URLs, and quick tips
- **[Setup Guide](./SETUP_GUIDE.md)** - Complete step-by-step setup instructions

### Architecture & Design
- **[Architecture](./ARCHITECTURE.md)** - System architecture and data flow diagrams
- **[Route Protection](./ROUTE_PROTECTION.md)** - Frontend + backend security strategy
- **[Authentication](./locatr-be/AUTH.md)** - JWT auth system details
- **[Token Refresh](./TOKEN_REFRESH.md)** - Automatic token refresh implementation

### Project Info
- **[Features](./FINAL_FEATURES.md)** - Complete feature list
- **[Project Summary](./PROJECT_SUMMARY.md)** - What we built and why
- **[Demo Checklist](./DEMO_CHECKLIST.md)** - Prepare for client demo
- **[Backend README](./locatr-be/README.md)** - Backend-specific documentation

## 🎨 Screenshots

*Add screenshots of your app here*

## 🤝 Contributing

This is a portfolio/demo project. Feel free to fork and customize!

## 📄 License

MIT

## 👨‍💻 Author

Built to showcase full-stack development skills including:
- Modern React patterns
- GraphQL API design
- Database architecture
- Authentication & security
- State management
- Real-time features

---

**Note**: This project uses Mapillary for street view imagery. You'll need a free API token from [Mapillary](https://www.mapillary.com/developer).
