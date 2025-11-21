# Demo Preparation Checklist

## Before the Demo

### Environment Setup
- [ ] PostgreSQL is running
- [ ] Backend server is running (`npm start` in locatr-be)
- [ ] Frontend dev server is running (`npm run dev` in locatr-fe)
- [ ] Database has been migrated (`npx prisma migrate dev`)
- [ ] No console errors in browser DevTools
- [ ] No errors in backend terminal

### Test Account
- [ ] Create a test account with memorable credentials
- [ ] Play at least one complete game (5 rounds)
- [ ] Submit score to leaderboard
- [ ] Verify stats are showing correctly

### Browser Setup
- [ ] Clear browser cache and cookies
- [ ] Open browser DevTools (F12)
- [ ] Have Network tab ready to show requests
- [ ] Have Application tab ready to show cookies
- [ ] Close unnecessary tabs

## Demo Flow

### 1. Introduction (2 min)
**What to say:**
> "This is Locatr, a full-stack geolocation game I built to showcase modern web development practices. It features React, Node.js, PostgreSQL, and GraphQL with complete authentication."

**What to show:**
- [ ] Main menu with clean UI
- [ ] Briefly mention tech stack

### 2. Guest Experience (3 min)
**What to say:**
> "Users can play without an account. Let me show the core gameplay."

**What to show:**
- [ ] Start a game as guest
- [ ] Navigate street view (WASD keys)
- [ ] Make a guess on the map
- [ ] Show distance calculation and scoring
- [ ] Complete 1-2 rounds
- [ ] Show round progress indicator (1/5, 2/5)
- [ ] Show running score

### 3. Authentication System (4 min)
**What to say:**
> "The app uses JWT authentication with HTTP-only cookies for security. Let me show the registration and login flow."

**What to show:**
- [ ] Navigate to registration page
- [ ] Show form validation (try invalid email)
- [ ] Register new account
- [ ] Open DevTools → Application → Cookies
- [ ] Point out HTTP-only cookies (accessToken, refreshToken)
- [ ] Show user menu appears after login
- [ ] Explain: "These cookies are secure, HTTP-only, and automatically refresh"

### 4. Protected Features (3 min)
**What to say:**
> "Authenticated users get enhanced features. Their games are tracked, and they don't need to enter a username."

**What to show:**
- [ ] Start a new game (logged in)
- [ ] Complete all 5 rounds quickly
- [ ] Show end-game summary
- [ ] Point out: "Username is auto-filled from account"
- [ ] Submit to leaderboard
- [ ] Show personal statistics dashboard

### 5. Backend & Database (5 min)
**What to say:**
> "Let me show you the backend architecture. It's a GraphQL API with PostgreSQL."

**What to show:**
- [ ] Open `http://localhost:4000/graphql` (GraphQL Playground)
- [ ] Show schema documentation
- [ ] Run a query (e.g., leaderboard)
- [ ] Show the response
- [ ] Open terminal with backend logs
- [ ] Show a request being processed
- [ ] Open Prisma Studio (`npx prisma studio`)
- [ ] Show database tables and relationships
- [ ] Point out: "All data is properly normalized and indexed"

### 6. Security Features (4 min)
**What to say:**
> "Security is a priority. Let me demonstrate the protection layers."

**What to show:**
- [ ] Open DevTools → Network tab
- [ ] Make a request, show cookies being sent automatically
- [ ] Show access token in cookie (HTTP-only flag)
- [ ] Explain: "Frontend can't access these tokens via JavaScript"
- [ ] Open code editor
- [ ] Show `requireAuth()` middleware in backend
- [ ] Show `ProtectedRoute` component in frontend
- [ ] Explain: "Two-layer protection: UX on frontend, security on backend"

### 7. Token Refresh (3 min)
**What to say:**
> "The app automatically refreshes tokens to keep users logged in during long sessions."

**What to show:**
- [ ] Open code: `useTokenRefresh` hook
- [ ] Explain: "Refreshes every 12 minutes, before 15-minute expiry"
- [ ] Open code: Apollo error link
- [ ] Explain: "If a request fails with 401, automatically refreshes and retries"
- [ ] Show token refresh indicator (if visible)

### 8. Code Quality (3 min)
**What to say:**
> "The codebase follows best practices with TypeScript, modular architecture, and proper separation of concerns."

**What to show:**
- [ ] Show project structure in editor
- [ ] Point out organized folders (components, pages, stores, etc.)
- [ ] Show a TypeScript interface
- [ ] Show Zustand store (simple state management)
- [ ] Show GraphQL query/mutation files
- [ ] Show SCSS modules (scoped styling)
- [ ] Mention: "Everything is typed, tested, and documented"

### 9. Scalability & Deployment (2 min)
**What to say:**
> "The architecture is production-ready and scalable."

**What to show:**
- [ ] Show `.env.example` files
- [ ] Explain environment-based configuration
- [ ] Show Prisma migrations folder
- [ ] Explain: "Database changes are versioned and reproducible"
- [ ] Mention: "Frontend and backend can be deployed separately"
- [ ] Mention: "Stateless backend allows horizontal scaling"

### 10. Q&A and Wrap-up (5 min)
**What to say:**
> "That's the overview. Happy to dive deeper into any area or answer questions."

**Be ready to discuss:**
- [ ] Why GraphQL over REST?
- [ ] Why PostgreSQL over MongoDB?
- [ ] Why HTTP-only cookies over localStorage?
- [ ] How would you add feature X?
- [ ] How would you scale this?
- [ ] What about testing?

## Technical Questions - Prepared Answers

### "Why GraphQL?"
> "GraphQL gives clients flexibility to request exactly what they need, reducing over-fetching. The type system provides excellent developer experience and automatic documentation. It's also easier to evolve the API without versioning."

### "Why PostgreSQL?"
> "PostgreSQL provides ACID compliance, strong relational integrity, and excellent performance. The game data has clear relationships (users → sessions → rounds), which fits perfectly with a relational model. Prisma makes it type-safe and easy to work with."

### "Why HTTP-only cookies?"
> "HTTP-only cookies can't be accessed by JavaScript, protecting against XSS attacks. They're automatically sent with requests, simplifying the client code. Combined with the Secure and SameSite flags, they provide robust security."

### "How do you handle token expiry?"
> "Two-layer approach: proactive refresh every 12 minutes before expiry, and reactive refresh if a request fails with 401. This ensures users stay logged in during long sessions without interruption."

### "How would you add testing?"
> "I'd add Jest for unit tests, React Testing Library for component tests, and Supertest for API integration tests. Prisma supports test databases, so we can test against real PostgreSQL. End-to-end tests with Playwright would cover critical user flows."

### "How would you scale this?"
> "The backend is stateless (JWT tokens), so it can scale horizontally. Add a load balancer, deploy multiple backend instances, use a managed PostgreSQL service with read replicas. Frontend is static files, so CDN distribution is straightforward. Add Redis for caching leaderboards and stats."

### "What about real-time features?"
> "I'd add WebSocket support via GraphQL subscriptions for real-time leaderboard updates. Could also implement a multiplayer mode where players compete simultaneously on the same locations."

## Common Demo Pitfalls to Avoid

❌ Don't rush through the authentication flow  
❌ Don't skip showing the database  
❌ Don't forget to mention security features  
❌ Don't get lost in code details too early  
❌ Don't assume they know GraphQL/Prisma  
❌ Don't skip the "why" behind technical choices  

✅ Do show the user experience first  
✅ Do explain security clearly  
✅ Do show the database structure  
✅ Do mention production readiness  
✅ Do highlight best practices  
✅ Do be ready for deep technical questions  

## Backup Plans

### If PostgreSQL isn't running:
- Have screenshots ready
- Show Prisma Studio screenshots
- Walk through schema.prisma file

### If frontend won't start:
- Have video recording ready
- Show screenshots of key features
- Focus on backend and architecture

### If internet is down:
- Everything runs locally, should be fine
- But have offline documentation ready

### If demo machine fails:
- Have backup laptop ready
- Have GitHub repo accessible
- Have documentation PDFs ready

## Post-Demo Follow-up

- [ ] Send GitHub repository link
- [ ] Send setup instructions (SETUP_GUIDE.md)
- [ ] Send architecture diagram (ARCHITECTURE.md)
- [ ] Offer to answer follow-up questions
- [ ] Provide timeline for any requested changes

## Confidence Boosters

Remember:
- ✅ You built a complete, production-ready application
- ✅ You implemented industry-standard security practices
- ✅ You used modern, in-demand technologies
- ✅ You followed best practices throughout
- ✅ You documented everything thoroughly
- ✅ You can explain every technical decision

**You've got this!** 🚀
