# Route Protection Strategy

## Two-Layer Protection

### 1. Frontend Protection (UX Layer)
**Purpose**: Improve user experience, prevent unnecessary navigation

**Implementation**: `ProtectedRoute` component
```typescript
<ProtectedRoute>
  <MyProfilePage />
</ProtectedRoute>
```

**What it does**:
- Checks if user is authenticated (from Zustand store)
- Redirects to login page if not authenticated
- Prevents rendering protected components

**Why it's not enough**:
- ❌ Can be bypassed with browser DevTools
- ❌ Client-side state can be manipulated
- ❌ Direct API calls still possible
- ✅ Good for UX, NOT for security

### 2. Backend Protection (Security Layer)
**Purpose**: Actual security enforcement

**Implementation**: `requireAuth` middleware
```javascript
myProtectedResolver: async (_, args, { user }) => {
  requireAuth(user); // Throws error if not authenticated
  // ... rest of resolver logic
}
```

**What it does**:
- Verifies JWT token from HTTP-only cookie
- Checks token expiration
- Validates user exists in database
- Throws UNAUTHENTICATED error if invalid

**Why it's essential**:
- ✅ Cannot be bypassed by client
- ✅ Validates actual authentication state
- ✅ Protects against direct API calls
- ✅ Real security enforcement

## Architecture

```
User Request
    ↓
Frontend ProtectedRoute (UX check)
    ↓ (if authenticated)
Component Renders
    ↓
GraphQL Request with Cookie
    ↓
Backend Context Middleware
    ↓ (extracts user from JWT)
Resolver requireAuth() (Security check)
    ↓ (if valid)
Data Returned
```

## Protected vs Public Endpoints

### Public Endpoints (No Auth Required)
```graphql
# Anyone can access
randomImage(region: String): Image
leaderboard(region: String, mode: String): [LeaderboardEntry!]!
locationNameByCoords(lat: Float!, lon: Float!): String
```

### Protected Endpoints (Auth Required)
```graphql
# Must be logged in
me: User
playerStats: PlayerStats!
myGames(limit: Int): [GameSession!]!
```

### Hybrid Endpoints (Optional Auth)
```graphql
# Works for both, but behavior differs
startGame(region: String!, mode: String!): GameSession!
# - Authenticated: Links to user account
# - Guest: Creates anonymous session

playerStats: PlayerStats!
# - Authenticated: Shows only your stats
# - Guest: Shows all stats (or could be protected)
```

## Implementation Examples

### Frontend Protected Route
```typescript
// App.tsx
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  } 
/>
```

### Backend Protected Resolver
```javascript
// resolvers.js
Query: {
  myGames: async (_, { limit }, { user }) => {
    requireAuth(user); // Security enforcement
    
    return await prisma.gameSession.findMany({
      where: { userId: user.userId },
      take: limit
    });
  }
}
```

### Backend Resource Ownership Check
```javascript
// resolvers.js
Query: {
  gameSession: async (_, { id }, { user }) => {
    const session = await prisma.gameSession.findUnique({
      where: { id }
    });
    
    // Check if user owns this session
    requireOwnership(user, session.userId);
    
    return session;
  }
}
```

## Error Handling

### Frontend
```typescript
// Apollo Client error link handles 401/403
if (error.extensions?.code === 'UNAUTHENTICATED') {
  // Try to refresh token
  // If refresh fails, redirect to login
}
```

### Backend
```javascript
// requireAuth throws GraphQLError
throw new GraphQLError('Authentication required', {
  extensions: {
    code: 'UNAUTHENTICATED',
    http: { status: 401 }
  }
});
```

## Security Best Practices

✅ **Never trust the frontend** - Always validate on backend  
✅ **Use HTTP-only cookies** - Prevent XSS attacks  
✅ **Validate JWT on every request** - Check expiration and signature  
✅ **Check resource ownership** - User can only access their data  
✅ **Use proper error codes** - 401 (Unauthenticated), 403 (Forbidden)  
✅ **Log security events** - Track failed auth attempts  
✅ **Rate limit auth endpoints** - Prevent brute force  

## Testing Protection

### Frontend Test
1. Logout
2. Try to navigate to `/profile`
3. Should redirect to `/login`

### Backend Test
1. Logout (clear cookies)
2. Try to call `myGames` query directly
3. Should return UNAUTHENTICATED error

### Token Expiry Test
1. Login
2. Wait 15+ minutes (access token expires)
3. Make request
4. Should auto-refresh and succeed

### Ownership Test
1. Login as User A
2. Try to access User B's game session
3. Should return FORBIDDEN error

## Common Mistakes to Avoid

❌ **Only protecting frontend** - Can be bypassed  
❌ **Storing tokens in localStorage** - Vulnerable to XSS  
❌ **Not checking resource ownership** - Users access others' data  
❌ **Trusting client-side state** - Can be manipulated  
❌ **Not validating token expiration** - Stale tokens accepted  
❌ **Weak error messages** - Leak security information  

## Correct Approach

✅ Frontend protection for UX  
✅ Backend protection for security  
✅ HTTP-only cookies for tokens  
✅ Validate on every request  
✅ Check resource ownership  
✅ Proper error handling  
✅ Token refresh mechanism  

This two-layer approach provides both good UX and real security.
