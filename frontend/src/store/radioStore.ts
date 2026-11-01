import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { NowPlaying, PlaybackHistory, Track, ConnectionState } from '@/types';

interface RadioState {
  // Data
  nowPlaying: NowPlaying | null;
  history: PlaybackHistory[];
  upcomingTracks: Track[];

  // Player state
  isPlayerPlaying: boolean;
  playerVolume: number; // 0–1
  playerMuted: boolean;
  connectionState: ConnectionState;
  streamUrl: string;
  reconnectAttempt: number;

  // Actions
  setNowPlaying: (nowPlaying: NowPlaying | null) => void;
  setHistory: (history: PlaybackHistory[]) => void;
  setUpcomingTracks: (tracks: Track[]) => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setConnectionState: (state: ConnectionState) => void;
  setStreamUrl: (url: string) => void;
  setReconnectAttempt: (attempt: number) => void;
  reset: () => void;
}

const DEFAULT_STREAM_URL =
  import.meta.env.VITE_STREAM_URL || 'http://localhost:3001/stream';

export const useRadioStore = create<RadioState>()(
  subscribeWithSelector((set) => ({
    nowPlaying: null,
    history: [],
    upcomingTracks: [],
    isPlayerPlaying: false,
    playerVolume: 0.8,
    playerMuted: false,
    connectionState: 'idle',
    streamUrl: DEFAULT_STREAM_URL,
    reconnectAttempt: 0,

    setNowPlaying: (nowPlaying) => set({ nowPlaying }),
    setHistory: (history) => set({ history }),
    setUpcomingTracks: (upcomingTracks) => set({ upcomingTracks }),

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

    reset: () =>
      set({
        nowPlaying: null,
        history: [],
        upcomingTracks: [],
        isPlayerPlaying: false,
        connectionState: 'idle',
        reconnectAttempt: 0,
      }),
  })),
);
