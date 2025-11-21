# Setup Instructions

## If you see TypeScript errors in the IDE

The red highlights you're seeing are TypeScript language server issues, not actual code problems. The code will compile and run fine. To fix the IDE errors:

### Option 1: Restart TypeScript Server (Quickest)
In VS Code:
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "TypeScript: Restart TS Server"
3. Press Enter

### Option 2: Reinstall Dependencies
```bash
cd locatr-fe
rm -rf node_modules
npm install
```

### Option 3: Reload VS Code Window
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Developer: Reload Window"
3. Press Enter

## Running the Application

### Backend
```bash
cd locatr-be
npm install

# Set up PostgreSQL
createdb locatr

# Configure .env
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run migrations
npx prisma migrate dev --name init
npx prisma generate

# Start server
node src/index.js
```

### Frontend
```bash
cd locatr-fe
npm install
npm run dev
```

## Verifying Everything Works

1. Backend should start on http://localhost:4000
2. Frontend should start on http://localhost:5173
3. Play a game and complete all 5 rounds
4. You should see the summary screen with stats and leaderboard
5. Submit your score to the leaderboard

The TypeScript errors in the IDE won't affect the build or runtime - the app will work perfectly!
