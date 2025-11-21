# Authentication System

## Overview
Locatr uses JWT-based authentication with refresh/access token pattern and HTTP-only cookies for maximum security.

## Security Features

### 1. HTTP-Only Cookies
- Access and refresh tokens stored in HTTP-only cookies
- Not accessible via JavaScript (XSS protection)
- Automatically sent with requests
- Secure flag enabled in production

### 2. Token Strategy
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens
- Refresh tokens stored in database for revocation capability

### 3. Password Security
- Passwords hashed with bcrypt (12 salt rounds)
- Never stored or transmitted in plain text
- Minimum 8 characters required

## Database Schema

```prisma
User {
  id, email, username, password (hashed)
  gameSessions, leaderboardEntries, refreshTokens
}

RefreshToken {
  id, token, userId, expiresAt
}
```

## API Endpoints

### Mutations

**Register**
```graphql
mutation Register($email: String!, $username: String!, $password: String!) {
  register(email: $email, username: $username, password: $password) {
    user { id, email, username }
    message
  }
}
```

**Login**
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user { id, email, username }
    message
  }
}
```

**Logout**
```graphql
mutation Logout {
  logout
}
```

**Refresh Token**
```graphql
mutation RefreshToken {
  refreshToken
}
```

### Queries

**Get Current User**
```graphql
query GetMe {
  me {
    id
    email
    username
    createdAt
  }
}
```

## Authentication Flow

### Registration/Login
1. User submits credentials
2. Backend validates and creates/verifies user
3. Generates access token (JWT) and refresh token (random)
4. Stores refresh token in database
5. Sets both tokens as HTTP-only cookies
6. Returns user data

### Authenticated Requests
1. Client makes request (cookies sent automatically)
2. Backend extracts access token from cookie
3. Verifies JWT signature and expiration
4. Adds user info to GraphQL context
5. Resolvers can access `context.user`

### Token Refresh
1. Access token expires (15 min)
2. Client calls `refreshToken` mutation
3. Backend validates refresh token from cookie
4. Checks database for token validity
5. Generates new access token
6. Sets new access token cookie

### Logout
1. Client calls `logout` mutation
2. Backend deletes refresh token from database
3. Clears both cookies
4. User must login again

## Protected Features

### Automatic (when authenticated)
- Game sessions linked to user account
- Personal statistics (only your games)
- Leaderboard entries show your username
- No need to enter username manually

### Guest Mode
- Can still play without account
- Must enter username for leaderboard
- Stats not tracked across sessions

## Environment Variables

```env
ACCESS_TOKEN_SECRET=your-secret-key-here
REFRESH_TOKEN_SECRET=your-other-secret-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend.com
```

## CORS Configuration

```javascript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies
})
```

## Frontend Setup

### Apollo Client
```typescript
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include', // Send cookies
});
```

### Auth Store (Zustand)
```typescript
{
  user: User | null,
  isAuthenticated: boolean,
  setUser: (user) => void,
  logout: () => void
}
```

## Security Best Practices Implemented

✅ HTTP-only cookies (no XSS access)
✅ Secure flag in production (HTTPS only)
✅ SameSite cookie attribute (CSRF protection)
✅ Password hashing with bcrypt
✅ Token expiration and rotation
✅ Refresh token revocation on logout
✅ Database-backed refresh tokens
✅ CORS with credentials
✅ No tokens in localStorage/sessionStorage
✅ Separate access/refresh token secrets

## Migration

Run after setting up the database:

```bash
npx prisma migrate dev --name add_auth
npx prisma generate
```

## Testing

1. Register a new user
2. Verify cookies are set (check browser DevTools)
3. Make authenticated requests
4. Wait 15 minutes, verify token refresh
5. Logout and verify cookies cleared
6. Try accessing protected features as guest
