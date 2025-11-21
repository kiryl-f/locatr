# Quick Reference Card

## 🚀 Quick Start Commands

### Backend
```bash
cd locatr-be
npm install
cp .env.example .env
# Edit .env with your settings
npx prisma migrate dev --name init
npx prisma generate
npm start
```

### Frontend
```bash
cd locatr-fe
npm install
cp .env.example .env
npm run dev
```

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:4000 |
| GraphQL Playground | http://localhost:4000/graphql |
| Prisma Studio | `npx prisma studio` |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `locatr-be/src/schema.js` | GraphQL schema |
| `locatr-be/src/resolvers.js` | GraphQL resolvers |
| `locatr-be/prisma/schema.prisma` | Database schema |
| `locatr-be/src/auth/jwt.js` | Token management |
| `locatr-fe/src/apolloClient.ts` | Apollo setup |
| `locatr-fe/src/stores/authStore.ts` | Auth state |
| `locatr-fe/src/App.tsx` | Root component |

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/locatr"
ACCESS_TOKEN_SECRET="your-secret-here"
REFRESH_TOKEN_SECRET="your-other-secret-here"
FRONTEND_URL="http://localhost:5173"
PORT=4000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:4000/graphql"
VITE_MAPILLARY_TOKEN="your-token-here"
```

## 🗄️ Database Commands

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes data)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

## 🔍 Useful GraphQL Queries

### Get Current User
```graphql
query {
  me {
    id
    email
    username
  }
}
```

### Get Leaderboard
```graphql
query {
  leaderboard(region: "europe", limit: 10) {
    username
    score
    region
  }
}
```

### Get Player Stats
```graphql
query {
  playerStats {
    totalGames
    bestScore
    averageScore
  }
}
```

## 🔐 Authentication Flow

1. **Register**: `mutation register(email, username, password)`
2. **Login**: `mutation login(email, password)`
3. **Auto-refresh**: Every 12 minutes
4. **Logout**: `mutation logout`

## 🎮 Game Flow

1. **Start**: `mutation startGame(region, mode)`
2. **Submit Round**: `mutation submitRound(...)`
3. **Complete**: `mutation completeGame(sessionId, username)`

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | Change PORT in .env or kill process |
| Database error | Check DATABASE_URL, ensure PostgreSQL running |
| Prisma error | Run `npx prisma generate` |
| CORS error | Check FRONTEND_URL in backend .env |
| Token error | Clear cookies, login again |

## 📊 Database Schema

```
User
├── id (UUID)
├── email (unique)
├── username (unique)
├── password (hashed)
└── Relations: gameSessions, leaderboardEntries, refreshTokens

GameSession
├── id (UUID)
├── userId (FK)
├── region
├── mode
├── totalScore
└── Relations: rounds, user

Round
├── id (UUID)
├── sessionId (FK)
├── roundNumber
├── imageId
├── actualLat/Lng
├── guessLat/Lng
├── distance
└── points

LeaderboardEntry
├── id (UUID)
├── sessionId (FK)
├── userId (FK)
├── username
├── score
└── region

RefreshToken
├── id (UUID)
├── token (unique)
├── userId (FK)
└── expiresAt
```

## 🔒 Security Checklist

- [x] HTTP-only cookies
- [x] Secure flag (production)
- [x] SameSite attribute
- [x] Password hashing (bcrypt)
- [x] Token expiration
- [x] Token refresh
- [x] CORS configuration
- [x] Protected routes (frontend + backend)
- [x] Input validation
- [x] Error handling

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| README.md | Main documentation |
| SETUP_GUIDE.md | Setup instructions |
| ARCHITECTURE.md | System architecture |
| ROUTE_PROTECTION.md | Security strategy |
| TOKEN_REFRESH.md | Token refresh details |
| DEMO_CHECKLIST.md | Demo preparation |
| PROJECT_SUMMARY.md | Project overview |

## 🎯 Demo Talking Points

1. **Full-stack**: React + Node.js + PostgreSQL
2. **Security**: JWT + HTTP-only cookies + auto-refresh
3. **Modern**: GraphQL, TypeScript, Prisma
4. **Production-ready**: Migrations, env config, error handling
5. **Scalable**: Stateless backend, horizontal scaling
6. **Well-documented**: 10+ documentation files

## 🚨 Common Mistakes to Avoid

❌ Forgetting to run migrations  
❌ Not setting environment variables  
❌ PostgreSQL not running  
❌ Wrong DATABASE_URL format  
❌ Not generating Prisma Client  
❌ CORS misconfiguration  

## ✅ Pre-Demo Checklist

- [ ] PostgreSQL running
- [ ] Backend running (no errors)
- [ ] Frontend running (no errors)
- [ ] Test account created
- [ ] Browser DevTools open
- [ ] Documentation ready
- [ ] Confident and prepared

## 🎓 Key Technologies

**Frontend**: React 19, TypeScript, Vite, Apollo Client, Zustand  
**Backend**: Node.js, Express, Apollo Server, GraphQL  
**Database**: PostgreSQL, Prisma ORM  
**Auth**: JWT, bcrypt, HTTP-only cookies  
**Maps**: MapLibre GL, Mapillary JS  

## 💡 Quick Tips

- Use `npx prisma studio` to view database visually
- Check browser DevTools → Application → Cookies for tokens
- Use GraphQL Playground for testing queries
- Check backend terminal for request logs
- Clear cookies if auth issues occur

## 📞 Support

If stuck, check:
1. SETUP_GUIDE.md for detailed instructions
2. Backend terminal for error messages
3. Browser console for frontend errors
4. Database connection with `psql -l`
5. Environment variables are set correctly

---

**Remember**: You built something impressive. Be confident! 🚀
