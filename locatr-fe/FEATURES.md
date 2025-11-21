# New Features - Multi-Round Game System

## Overview
Locatr now features a complete multi-round game system with persistent scoring, player statistics, and leaderboards powered by PostgreSQL.

## Features Implemented

### 1. Multi-Round Game Sessions (5 rounds per game)
- Each game consists of 5 rounds with pre-generated locations
- Round progress indicator showing current round (1/5, 2/5, etc.)
- Running score display throughout the game
- Session state managed with Zustand store

### 2. Game Summary Screen
- Comprehensive end-game summary with:
  - Total score display
  - Average distance across all rounds
  - Detailed round breakdown with locations and scores
  - Option to save score to leaderboard with username
  - Play again or return to main menu

### 3. Leaderboard System
- Top 10 scores displayed on summary screen
- Filterable by region and game mode
- Username support for score tracking
- Real-time updates after score submission

### 4. Player Statistics
- Aggregated stats across all games:
  - Total games played
  - Best score achieved
  - Average score
  - Average distance
  - Total points earned
  - Stats breakdown by region

### 5. Backend Architecture
- **PostgreSQL database** with Prisma ORM
- Proper relational data model:
  - GameSession table for game tracking
  - Round table for individual round data
  - LeaderboardEntry table for high scores
- Indexed queries for performance
- GraphQL mutations for game flow:
  - `startGame` - Initialize 5-round session
  - `submitRound` - Save round results
  - `completeGame` - Finalize and optionally add to leaderboard

## Technical Stack

### Backend
- PostgreSQL for data persistence
- Prisma ORM for type-safe database access
- GraphQL API with Apollo Server
- Proper database indexing for performance

### Frontend
- Zustand for game session state management
- Apollo Client for GraphQL integration
- React Router for navigation
- SCSS modules for styling

## User Flow

1. **Start Game** → Select region and mode → Game initializes with 5 pre-generated rounds
2. **Play Rounds** → Make guesses → See results → Progress through 5 rounds
3. **Game Complete** → View summary → Optionally save to leaderboard → See stats and rankings
4. **Play Again** or return to main menu

## Database Schema

```prisma
GameSession {
  id, region, mode, currentRound, totalScore, completed
  rounds: Round[]
}

Round {
  roundNumber, imageId, actualLat, actualLng
  guessLat, guessLng, distance, points, locationName
}

LeaderboardEntry {
  username, score, region, mode, createdAt
}
```

## What This Demonstrates

✅ Full-stack development (React + Node.js + PostgreSQL)
✅ GraphQL API design with queries and mutations
✅ Database modeling and relationships
✅ State management (Zustand)
✅ Complex UI flows with multiple screens
✅ Data aggregation and statistics
✅ Real-time updates and refetching
✅ Proper error handling
✅ Performance optimization (indexing, caching)
