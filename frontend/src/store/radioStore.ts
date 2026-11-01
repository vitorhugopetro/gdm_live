import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { NowPlaying, PlaybackHistory, Track, ConnectionState, BroadcastBanner } from '@/types';
import { GDM_WEB_PLAYLIST } from '@/config/webPlaylist';

interface RadioState {
  // Data
  nowPlaying: NowPlaying | null;
  history: PlaybackHistory[];
  upcomingTracks: Track[];
  banner: BroadcastBanner | null;
  favorites: string[]; // Track IDs
  currentPlaylistIndex: number;

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
  setCurrentPlaylistIndex: (index: number) => void;
  reset: () => void;
}

function resolveDefaultStreamUrl(): string {
  const envUrl = import.meta.env.VITE_STREAM_URL;
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  if (isHttps) {
    if (envUrl && envUrl.startsWith('https://')) {
      return envUrl;
    }
    return '/stream';
  }

  return envUrl || 'http://localhost:3001/stream';
}

const DEFAULT_STREAM_URL = resolveDefaultStreamUrl();
const LOCAL_STORAGE_FAVORITES_KEY = 'gdm_live_favorites';

function loadInitialFavorites(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getInitialNowPlaying(): NowPlaying {
  const first = GDM_WEB_PLAYLIST[0] || {
    id: '01-a-cruz-e-o-sacrificio.mp3',
    title: 'A Cruz e o Sacrifício de Jesus',
    artist: 'Graça Digital (GDM)',
    album: 'Louvores de Fé & Esperança',
    url: '/audio/01-a-cruz-e-o-sacrificio.mp3',
    coverUrl: '/images/player-album-art.jpg'
  };

  return {
    track: {
      id: first.id,
      title: first.title,
      artist: first.artist,
      album: first.album,
      duration: 320,
      coverArt: first.coverUrl,
      coverArtDataUrl: first.coverUrl,
      fileName: first.id,
      fileSize: 5482486,
      format: 'mp3',
    },
    startedAt: new Date().toISOString(),
    elapsed: 0,
    listenerCount: 142,
    streamUrl: first.url,
  };
}

export const useRadioStore = create<RadioState>()(
  subscribeWithSelector((set, get) => ({
    nowPlaying: getInitialNowPlaying(),
    history: [],
    upcomingTracks: [],
    banner: null,
    favorites: loadInitialFavorites(),
    currentPlaylistIndex: 0,

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
    setCurrentPlaylistIndex: (currentPlaylistIndex) => set({ currentPlaylistIndex }),

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

    setStreamUrl: (streamUrl) => {
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const safeUrl =
        isHttps && streamUrl.startsWith('http://')
          ? streamUrl.startsWith('http://localhost') || streamUrl.startsWith('http://127.0.0.1')
            ? '/stream'
            : streamUrl.replace('http://', 'https://')
          : streamUrl;
      set({ streamUrl: safeUrl });
    },

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
        nowPlaying: getInitialNowPlaying(),
        history: [],
        upcomingTracks: [],
        isPlayerPlaying: false,
        connectionState: 'idle',
        reconnectAttempt: 0,
        sleepTimerEndsAt: null,
        currentPlaylistIndex: 0,
      }),
  })),
);
