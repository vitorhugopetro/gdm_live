// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface Track {
  id: string;
  filePath: string;
  fileName: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  format: string;
  fileSize: number;
  coverArtPath?: string;
  coverArtDataUrl?: string; // base64 for API response
  discoveredAt: string; // ISO timestamp
  validationStatus: 'valid' | 'invalid' | 'pending';
  availableForPlayback: boolean;
  lastModified: string; // ISO timestamp
}

export interface NowPlaying {
  track: Track | null;
  startedAt: string | null;
  streamUrl: string;
  listenerCount: number;
  isLive: boolean;
  programMode: 'random' | 'sequential' | 'playlist';
  requestedBy?: {
    name: string;
    city?: string;
  } | null;
}

export interface PlaybackHistory {
  id: string;
  track: Track;
  playedAt: string; // ISO timestamp
  duration: number; // seconds played before track ended/skipped
}

export interface LibraryStats {
  totalTracks: number;
  validTracks: number;
  invalidTracks: number;
  totalDuration: number; // seconds
  lastSync: string | null; // ISO timestamp
  syncInProgress: boolean;
}

export interface ProgramSchedulerConfig {
  mode: 'random' | 'sequential' | 'playlist';
  avoidRepeatWithin: number; // minutes
  crossfadeSeconds: number;
}

// ─── Community & Spiritual Features ──────────────────────────────────────────

export interface PrayerRequest {
  id: string;
  name: string;
  city?: string;
  request: string;
  prayerCount: number;
  createdAt: string;
}

export interface Testimony {
  id: string;
  name: string;
  city?: string;
  title: string;
  testimony: string;
  createdAt: string;
}

export interface ListenerMessage {
  id: string;
  name: string;
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
  active: boolean;
  updatedAt: string;
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

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Streaming Types ──────────────────────────────────────────────────────────

export interface StreamMetadata {
  title: string;
  artist: string;
  trackId: string;
  startedAt: string;
}

export interface StreamListener {
  id: string;
  connectedAt: string;
  remoteAddress: string;
}

// ─── Scanner Types ────────────────────────────────────────────────────────────

export interface ScanResult {
  tracks: Track[];
  errors: ScanError[];
  scannedFiles: number;
  durationMs: number;
}

export interface ScanError {
  filePath: string;
  error: string;
}

// ─── Log Entry (for admin API) ────────────────────────────────────────────────

export interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

// ─── Admin Config Patch ───────────────────────────────────────────────────────

export interface AdminConfigPatch {
  mode?: 'random' | 'sequential' | 'playlist';
  avoidRepeatMinutes?: number;
  crossfadeSeconds?: number;
  streamBitrate?: number;
}
