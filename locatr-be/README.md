# Locatr Backend

GraphQL API for the Locatr geolocation game.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database and configure `.env`:
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. (Optional) Fetch Mapillary images:
```bash
npm run fetch-images
```

6. Start the server:
```bash
node src/index.js
```

## Database Schema

- **GameSession**: Tracks multi-round games with region, mode, and total score
- **Round**: Individual rounds within a game session with guess data
- **LeaderboardEntry**: High scores with usernames

## GraphQL API

### Queries
- `randomImage(region: String)`: Get a random street view image
- `gameSession(id: ID!)`: Retrieve a game session with all rounds
- `playerStats`: Get aggregated player statistics
- `leaderboard(region: String, mode: String, limit: Int)`: Get top scores

### Mutations
- `startGame(region: String!, mode: String!)`: Create a new 5-round game session
- `submitRound(...)`: Submit a guess for a round
- `completeGame(sessionId: ID!, username: String)`: Mark game complete and optionally add to leaderboard
