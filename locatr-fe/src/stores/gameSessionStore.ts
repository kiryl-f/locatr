import { create } from 'zustand';

interface Round {
  roundNumber: number;
  imageId: string;
  actualLat: number;
  actualLng: number;
  guessLat?: number;
  guessLng?: number;
  distance?: number;
  points?: number;
  locationName?: string;
}

interface GameSession {
  id: string;
  region: string;
  mode: string;
  currentRound: number;
  totalScore: number;
  completed: boolean;
  rounds: Round[];
}

interface GameSessionState {
  session: GameSession | null;
  setSession: (session: GameSession) => void;
  updateSession: (updates: Partial<GameSession>) => void;
  clearSession: () => void;
  getCurrentRound: () => Round | null;
}

export const useGameSessionStore = create<GameSessionState>((set, get) => ({
  session: null,
  
  setSession: (session) => set({ session }),
  
  updateSession: (updates) => set((state) => ({
    session: state.session ? { ...state.session, ...updates } : null
  })),
  
  clearSession: () => set({ session: null }),
  
  getCurrentRound: () => {
    const { session } = get();
    if (!session) return null;
    return session.rounds.find(r => r.roundNumber === session.currentRound) || null;
  }
}));
