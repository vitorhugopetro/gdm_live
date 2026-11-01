import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { create } from 'zustand';
import { app } from '@/config/firebase';

const auth = getAuth(app);

// Use a flexible interface for the authenticated Firebase user
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
  getIdToken?: (forceRefresh?: boolean) => Promise<string>;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  init: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  init: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },

  login: async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  getToken: async () => {
    const { user } = get();
    if (!user) throw new Error('Not authenticated');
    return user.getIdToken();
  },
}));
