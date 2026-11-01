import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { NowPlaying, PlaybackHistory, Track, ConnectionState, BroadcastBanner } from '@/types';

interface RadioState {
  // Data
  nowPlaying: NowPlaying | null;
  history: PlaybackHistory[];
  upcomingTracks: Track[];
  banner: BroadcastBanner | null;
  favorites: string[]; // Track IDs

  // Player state
  isPlayerPlaying: boolean;
  playerVolume: number; // 0–1
  playerMuted: boolean;
  connectionState: ConnectionState;
  streamUrl: string;
  reconnectAttempt: number;

  // Sleep Timer
  sleepTimerEndsAt: number | null; // timestamp ms

  // Actions
  setNowPlaying: (nowPlaying: NowPlaying | null) => void;
  setHistory: (history: PlaybackHistory[]) => void;
  setUpcomingTracks: (tracks: Track[]) => void;
  setBanner: (banner: BroadcastBanner | null) => void;
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;

  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setConnectionState: (state: ConnectionState) => void;
  setStreamUrl: (url: string) => void;
  setReconnectAttempt: (attempt: number) => void;
  setSleepTimer: (minutes: number | null) => void;
  reset: () => void;
}

const DEFAULT_STREAM_URL =
  import.meta.env.VITE_STREAM_URL || 'http://localhost:3001/stream';

const LOCAL_STORAGE_FAVORITES_KEY = 'gdm_live_favorites';

function loadInitialFavorites(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useRadioStore = create<RadioState>()(
  subscribeWithSelector((set, get) => ({
    nowPlaying: null,
    history: [],
    upcomingTracks: [],
    banner: null,
    favorites: loadInitialFavorites(),

    isPlayerPlaying: false,
    playerVolume: 0.8,
    playerMuted: false,
    connectionState: 'idle',
    streamUrl: DEFAULT_STREAM_URL,
    reconnectAttempt: 0,
    sleepTimerEndsAt: null,

    setNowPlaying: (nowPlaying) => set({ nowPlaying }),
    setHistory: (history) => set({ history }),
    setUpcomingTracks: (upcomingTracks) => set({ upcomingTracks }),
    setBanner: (banner) => set({ banner }),

    toggleFavorite: (trackId: string) => {
      const current = get().favorites;
      const exists = current.includes(trackId);
      const updated = exists
        ? current.filter((id) => id !== trackId)
        : [...current, trackId];
      try {
        localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(updated));
      } catch { /* ignore */ }
      set({ favorites: updated });
    },

    isFavorite: (trackId: string) => get().favorites.includes(trackId),

    togglePlay: () =>
      set((state) => ({ isPlayerPlaying: !state.isPlayerPlaying })),

    setIsPlaying: (isPlayerPlaying) => set({ isPlayerPlaying }),

    setVolume: (playerVolume) =>
      set({ playerVolume: Math.min(1, Math.max(0, playerVolume)) }),

    setMuted: (playerMuted) => set({ playerMuted }),

    toggleMute: () => set((state) => ({ playerMuted: !state.playerMuted })),

    setConnectionState: (connectionState) => set({ connectionState }),

    setStreamUrl: (streamUrl) => set({ streamUrl }),

    setReconnectAttempt: (reconnectAttempt) => set({ reconnectAttempt }),

    setSleepTimer: (minutes: number | null) => {
      if (minutes === null) {
        set({ sleepTimerEndsAt: null });
      } else {
        const endsAt = Date.now() + minutes * 60 * 1000;
        set({ sleepTimerEndsAt: endsAt });
      }
    },

    reset: () =>
      set({
        nowPlaying: null,
        history: [],
        upcomingTracks: [],
        isPlayerPlaying: false,
        connectionState: 'idle',
        reconnectAttempt: 0,
        sleepTimerEndsAt: null,
      }),
  })),
);
