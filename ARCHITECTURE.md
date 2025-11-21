# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 19 + TypeScript + Vite                        │  │
│  │  ├─ Apollo Client (GraphQL)                          │  │
│  │  ├─ Zustand (State Management)                       │  │
│  │  ├─ React Router (Navigation)                        │  │
│  │  ├─ MapLibre GL (Maps)                               │  │
│  │  └─ Mapillary JS (Street View)                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕ HTTP/GraphQL                     │
│                    (with HTTP-only cookies)                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Node.js + Express + Apollo Server                   │  │
│  │  ├─ GraphQL API (Queries & Mutations)                │  │
│  │  ├─ JWT Authentication                                │  │
│  │  ├─ Cookie Parser Middleware                          │  │
│  │  ├─ CORS Configuration                                │  │
│  │  └─ Prisma ORM                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕ SQL                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       PostgreSQL                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                              │  │
│  │  ├─ users                                             │  │
│  │  ├─ refresh_tokens                                    │  │
│  │  ├─ game_sessions                                     │  │
│  │  ├─ rounds                                            │  │
│  │  └─ leaderboard_entries                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. User Registration/Login

```
User → Frontend Form
         ↓
    Validation
         ↓
    GraphQL Mutation (register/login)
         ↓
    Backend Resolver
         ↓
    Hash Password (bcrypt)
         ↓
    Store in PostgreSQL
         ↓
    Generate JWT Tokens
         ↓
    Set HTTP-only Cookies
         ↓
    Return User Data
         ↓
    Update Zustand Store
         ↓
    Redirect to Home
```

### 2. Authenticated Request

```
User Action → Frontend Component
                ↓
         GraphQL Query/Mutation
                ↓
         Apollo Client
                ↓
    Automatically includes cookies
                ↓
         Backend Middleware
                ↓
    Extract JWT from cookie
                ↓
         Verify Token
                ↓
    Add user to context
                ↓
         Resolver
                ↓
    Check requireAuth()
                ↓
    Query PostgreSQL
                ↓
    Return Data
                ↓
    Apollo Cache Update
                ↓
    Component Re-renders
```

### 3. Token Refresh Flow

```
Timer (12 min) → useTokenRefresh Hook
                      ↓
              refreshToken Mutation
                      ↓
              Backend Resolver
                      ↓
         Validate refresh token
                      ↓
         Check database
                      ↓
         Generate new access token
                      ↓
         Set new cookie
                      ↓
         Return success
                      ↓
         Show indicator (optional)
```

### 4. Game Session Flow

```
Start Game → startGame Mutation
                ↓
         Create GameSession
                ↓
    Generate 5 random locations
                ↓
         Create 5 Rounds
                ↓
    Return session with rounds
                ↓
    Store in Zustand
                ↓
    Display Round 1
                ↓
User Makes Guess → submitRound Mutation
                ↓
    Calculate distance & points
                ↓
         Update Round
                ↓
    Update session totalScore
                ↓
    Return updated session
                ↓
    Show result → Next Round
                ↓
         (Repeat 5 times)
                ↓
    Navigate to Summary
                ↓
completeGame Mutation → Save to Leaderboard
```

## Data Flow Diagram

```
┌──────────────┐
│   Browser    │
│  (Cookies)   │
└──────┬───────┘
       │ Access Token (15 min)
       │ Refresh Token (7 days)
       ↓
┌──────────────────────────────────────┐
│         Apollo Client                 │
│  ┌────────────────────────────────┐  │
│  │  Error Link (Token Refresh)    │  │
│  │  HTTP Link (with credentials)  │  │
│  │  InMemory Cache                 │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│      Express Middleware               │
│  ┌────────────────────────────────┐  │
│  │  cookie-parser                  │  │
│  │  cors (with credentials)        │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│      Apollo Server Context            │
│  ┌────────────────────────────────┐  │
│  │  Extract JWT from cookie        │  │
│  │  Verify token                   │  │
│  │  Add user to context            │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│         GraphQL Resolvers             │
│  ┌────────────────────────────────┐  │
│  │  requireAuth() check            │  │
│  │  Business logic                 │  │
│  │  Prisma queries                 │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│           Prisma ORM                  │
│  ┌────────────────────────────────┐  │
│  │  Type-safe queries              │  │
│  │  Migrations                     │  │
│  │  Connection pooling             │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│          PostgreSQL                   │
│  ┌────────────────────────────────┐  │
│  │  Relational data                │  │
│  │  Indexes for performance        │  │
│  │  ACID transactions              │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

## State Management

### Frontend State (Zustand)

```
┌─────────────────────────────────┐
│       authStore                  │
│  ├─ user: User | null            │
│  ├─ isAuthenticated: boolean     │
│  ├─ setUser()                    │
│  └─ logout()                     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│    gameSessionStore              │
│  ├─ session: GameSession | null  │
│  ├─ setSession()                 │
│  ├─ updateSession()              │
│  ├─ clearSession()               │
│  └─ getCurrentRound()            │
└─────────────────────────────────┘
```

### Backend State (Database)

```
┌─────────────────────────────────┐
│       User Session               │
│  ├─ Access Token (cookie)        │
│  ├─ Refresh Token (cookie + DB)  │
│  └─ User ID (from JWT)           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│       Game State                 │
│  ├─ GameSession (DB)             │
│  ├─ Rounds (DB)                  │
│  └─ Current Round (computed)     │
└─────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: Frontend Route Protection     │
│  ├─ ProtectedRoute component            │
│  ├─ Redirect to login if not auth       │
│  └─ UX improvement only                 │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Layer 2: HTTP-Only Cookies             │
│  ├─ No JavaScript access                │
│  ├─ Secure flag (HTTPS)                 │
│  └─ SameSite attribute                  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Layer 3: JWT Verification              │
│  ├─ Verify signature                    │
│  ├─ Check expiration                    │
│  └─ Extract user ID                     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Layer 4: Backend Authorization         │
│  ├─ requireAuth() in resolvers          │
│  ├─ Check user exists                   │
│  └─ Verify resource ownership           │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Layer 5: Database Constraints          │
│  ├─ Foreign key relationships           │
│  ├─ Unique constraints                  │
│  └─ Indexes for performance             │
└─────────────────────────────────────────┘
```

## Deployment Architecture

### Development
```
localhost:5173 (Frontend)
      ↓
localhost:4000 (Backend)
      ↓
localhost:5432 (PostgreSQL)
```

### Production
```
your-domain.com (Frontend - CDN)
      ↓
api.your-domain.com (Backend - Server)
      ↓
db.your-provider.com (PostgreSQL - Managed DB)
```

## Technology Choices & Rationale

| Technology | Why? |
|------------|------|
| **React 19** | Latest features, concurrent rendering, improved hooks |
| **TypeScript** | Type safety, better DX, catch errors early |
| **Vite** | Fast builds, HMR, modern tooling |
| **GraphQL** | Flexible queries, type system, single endpoint |
| **PostgreSQL** | ACID compliance, relations, mature ecosystem |
| **Prisma** | Type-safe ORM, migrations, great DX |
| **JWT** | Stateless auth, scalable, industry standard |
| **HTTP-only Cookies** | XSS protection, automatic sending |
| **Zustand** | Lightweight, simple API, no boilerplate |
| **MapLibre GL** | Open-source, performant, feature-rich |

## Performance Considerations

- ✅ Database indexes on frequently queried fields
- ✅ Apollo Client caching
- ✅ Token refresh before expiry (proactive)
- ✅ Connection pooling (Prisma)
- ✅ Lazy loading of components
- ✅ Optimized bundle size (Vite)
- ✅ SCSS modules (scoped styles)

## Scalability

- ✅ Stateless backend (JWT tokens)
- ✅ Horizontal scaling possible
- ✅ Database connection pooling
- ✅ CDN for frontend assets
- ✅ Separate frontend/backend deployment
- ✅ Environment-based configuration

This architecture supports both development and production deployments while maintaining security and performance.
