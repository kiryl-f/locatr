# Complete Setup Guide

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js v18+ installed
- ✅ PostgreSQL v14+ installed and running
- ✅ npm or yarn package manager
- ✅ Git (for cloning)

## Step-by-Step Setup

### 1. Clone and Navigate

```bash
git clone <your-repo-url>
cd locatr
```

### 2. PostgreSQL Database Setup

#### Option A: Using psql
```bash
# Create database
createdb locatr

# Verify it was created
psql -l | grep locatr
```

#### Option B: Using PostgreSQL GUI (pgAdmin, etc.)
1. Open your PostgreSQL client
2. Create new database named `locatr`
3. Note your connection details

#### Option C: Using psql interactive
```bash
psql -U postgres
CREATE DATABASE locatr;
\q
```

### 3. Backend Setup

```bash
cd locatr-be

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

**Required .env values:**
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/locatr"
ACCESS_TOKEN_SECRET="generate-a-random-string-here"
REFRESH_TOKEN_SECRET="generate-another-random-string-here"
FRONTEND_URL="http://localhost:5173"
```

**Generate secure secrets:**
```bash
# On macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Run database migrations:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Start the backend:**
```bash
npm start
# or for development with auto-reload
npm run dev
```

✅ Backend should now be running on `http://localhost:4000`

### 4. Frontend Setup

Open a new terminal:

```bash
cd locatr-fe

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env (optional - defaults work for local dev)
nano .env
```

**Optional .env customization:**
```env
VITE_API_URL=http://localhost:4000/graphql
VITE_MAPILLARY_TOKEN=your_token_here  # Optional for now
```

**Start the frontend:**
```bash
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

### 5. Verify Installation

1. **Open browser** to `http://localhost:5173`
2. **Register** a new account
3. **Login** with your credentials
4. **Start a game** and play a round
5. **Check leaderboard** and stats

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Ensure database exists: `psql -l | grep locatr`
- Check username/password are correct

### Issue: "Port 4000 already in use"
**Solution:**
- Change PORT in `locatr-be/.env`
- Update VITE_API_URL in `locatr-fe/.env` to match
- Or kill process using port: `lsof -ti:4000 | xargs kill`

### Issue: "Prisma Client not generated"
**Solution:**
```bash
cd locatr-be
npx prisma generate
```

### Issue: "CORS error in browser"
**Solution:**
- Verify FRONTEND_URL in backend `.env` matches frontend URL
- Ensure credentials: 'include' in Apollo Client config
- Check browser console for specific CORS error

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
cd locatr-be
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Mapillary images not loading"
**Solution:**
- Get free API token from https://www.mapillary.com/developer
- Add to both `.env` files
- Or use the pre-populated images.json (if available)

## Optional: Populate Image Data

If you want to fetch fresh Mapillary images:

```bash
cd locatr-be
npm run fetch-images
```

This will populate `src/data/images.json` with street view locations.

## Development Workflow

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd locatr-be
npm start
```

**Terminal 2 (Frontend):**
```bash
cd locatr-fe
npm run dev
```

### Database Management

**View database in browser:**
```bash
cd locatr-be
npx prisma studio
```

**Create new migration:**
```bash
cd locatr-be
npx prisma migrate dev --name your_migration_name
```

**Reset database (WARNING: deletes all data):**
```bash
cd locatr-be
npx prisma migrate reset
```

### Useful Commands

**Backend:**
```bash
npm start          # Start server
npm run dev        # Start with auto-reload (if configured)
npm run fetch-images  # Populate image data
```

**Frontend:**
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Production Deployment

### Backend

1. **Set environment variables:**
```env
NODE_ENV=production
DATABASE_URL=your_production_db_url
ACCESS_TOKEN_SECRET=strong_random_secret
REFRESH_TOKEN_SECRET=another_strong_secret
FRONTEND_URL=https://your-frontend-domain.com
```

2. **Run migrations:**
```bash
npx prisma migrate deploy
```

3. **Start server:**
```bash
npm start
```

### Frontend

1. **Build:**
```bash
npm run build
```

2. **Deploy `dist` folder** to your hosting service (Vercel, Netlify, etc.)

3. **Set environment variables** in hosting dashboard:
```env
VITE_API_URL=https://your-backend-domain.com/graphql
```

## Testing the Application

### Manual Testing Checklist

- [ ] Register new account
- [ ] Login with credentials
- [ ] Start a game
- [ ] Play all 5 rounds
- [ ] Submit score to leaderboard
- [ ] View personal stats
- [ ] Logout
- [ ] Login again (verify session persists)
- [ ] Play as guest (without login)
- [ ] Check leaderboard shows all scores

### API Testing (Optional)

Use GraphQL Playground at `http://localhost:4000/graphql`

**Test query:**
```graphql
query {
  leaderboard(limit: 5) {
    username
    score
    region
  }
}
```

## Next Steps

- 📖 Read [ROUTE_PROTECTION.md](./ROUTE_PROTECTION.md) for security details
- 🔐 Read [AUTH.md](./locatr-be/AUTH.md) for authentication flow
- 🔄 Read [TOKEN_REFRESH.md](./TOKEN_REFRESH.md) for token management
- 📊 Read [FINAL_FEATURES.md](./FINAL_FEATURES.md) for complete feature list

## Getting Help

If you encounter issues:
1. Check this guide's "Common Issues" section
2. Review error messages in terminal
3. Check browser console for frontend errors
4. Verify all environment variables are set
5. Ensure PostgreSQL is running

## Quick Reference

**Backend URL:** http://localhost:4000  
**Frontend URL:** http://localhost:5173  
**GraphQL Playground:** http://localhost:4000/graphql  
**Prisma Studio:** Run `npx prisma studio` in backend folder  

**Default Credentials:** Create your own during registration!

---

Happy coding! 🚀
