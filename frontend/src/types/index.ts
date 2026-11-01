// =============================================================================
// GDM Live Radio — Shared Frontend Types
// =============================================================================

// Connection states for the audio player
export type ConnectionState =
  | 'idle'
  | 'connecting'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'loading'
  | 'reconnecting'
  | 'error'
  | 'offline';

// A single track in the library
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // seconds
  coverArt?: string; // URL
  coverArtDataUrl?: string; // base64 data URL
  tags?: string[];
  // Library metadata fields (from server)
  format?: string;
  fileSize?: number;
  fileName?: string;
  validationStatus?: 'valid' | 'invalid' | 'pending';
  availableForPlayback?: boolean;
  discoveredAt?: string;
  lastModified?: string;
}

// What's currently on air — matches server NowPlaying response
export interface NowPlaying {
  track: Track | null;
  startedAt: string | null; // ISO date
  streamUrl?: string;
  listenerCount?: number;
  isLive?: boolean;
  programMode?: 'random' | 'sequential' | 'playlist';
  requestedBy?: {
    name: string;
    city?: string;
  } | null;
  // Legacy field alias
  elapsed?: number;
  listeners?: number;
}

// Community & Spiritual Types
export interface PrayerRequest {
  id: string;
  name: string;
  city?: string;
  request: string;
  prayerCount: number;
  prayedCount?: number;
  isAnonymous?: boolean;
  createdAt: string;
}

export interface Testimony {
  id: string;
  name: string;
  city?: string;
  title?: string;
  testimony?: string;
  story?: string;
  createdAt: string;
}

export interface ListenerMessage {
  id: string;
  name?: string;
  sender?: string;
  city?: string;
  message: string;
  createdAt: string;
}

export interface SongRequest {
  id: string;
  trackId: string;
  trackTitle: string;
  trackArtist: string;
  requesterName: string;
  requesterCity?: string;
  requestedAt: string;
  status: 'pending' | 'playing' | 'played';
}

export interface BroadcastBanner {
  message: string;
  active?: boolean;
  enabled?: boolean;
  updatedAt?: string;
}

export interface AnalyticsStats {
  totalListeners: number;
  peakListeners: number;
  totalPlays: number;
  totalRequests: number;
  totalPrayers: number;
  mostPlayed: Array<{
    trackId: string;
    title: string;
    artist: string;
    playCount: number;
  }>;
}

// An entry in the playback history
export interface PlaybackHistory {
  id: string;
  track: Track;
  playedAt: string; // ISO date
  duration?: number; // how long it played (seconds)
}

// Library aggregate statistics
export interface LibraryStats {
  totalTracks: number;
  totalDuration: number; // seconds
  totalArtists?: number;
  validTracks?: number;
  invalidTracks?: number;
  lastSync?: string | null; // ISO date
  syncStatus?: 'idle' | 'syncing' | 'error';
  syncInProgress?: boolean;
}

// Admin system status
export interface SystemStatus {
  status: 'online' | 'degraded' | 'offline' | 'ok';
  uptime: number; // seconds
  memoryMb?: number;
  streamActive?: boolean;
  currentTrack?: NowPlaying | null;
  libraryStats?: LibraryStats;
  serverTime?: string; // ISO date
  version?: string;
  library?: {
    totalTracks: number;
    validTracks: number;
    invalidTracks: number;
    totalDuration: number;
    lastSync: string | null;
    syncInProgress: boolean;
  };
  stream?: {
    isLive: boolean;
    listenerCount: number;
    currentTrack: string | null;
  };
  scheduler?: {
    mode: string;
    avoidRepeatWithin: number;
    crossfadeSeconds: number;
  };
}

// Standard paginated response from backend
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Standard API wrapper response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  timestamp?: string;
}
