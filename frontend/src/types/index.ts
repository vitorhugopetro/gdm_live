// Core track data from the library
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // seconds
  coverArt?: string; // URL (alias for coverArtDataUrl from server)
  coverArtDataUrl?: string; // base64 data URL from server
  genre?: string;
  year?: number;
  filePath?: string;
  addedAt?: string; // ISO date
  playCount?: number;
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
  // Legacy field alias
  elapsed?: number;
  listeners?: number;
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

// Connection states for the audio player
export type ConnectionState =
  | 'idle'
  | 'connecting'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'reconnecting'
  | 'offline'
  | 'error';

// Admin log entry
export interface LogEntry {
  id?: string;
  timestamp: string; // ISO date
  level: 'info' | 'warn' | 'error';
  message: string;
  meta?: Record<string, unknown>;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// Paginated API response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Schedule entry (for program page)
export interface ScheduleEntry {
  id: string;
  title: string;
  description?: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  days: number[];    // 0=Sun … 6=Sat
  type: 'music' | 'program' | 'special';
}

// Admin settings / config
export interface AdminSettings {
  streamUrl: string;
  maxHistoryItems: number;
  shuffleEnabled: boolean;
  crossfadeDuration: number; // seconds
  autoSyncEnabled: boolean;
  syncIntervalHours: number;
}
