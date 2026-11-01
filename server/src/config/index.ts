import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Music library
  musicLibraryPath:
    process.env.MUSIC_LIBRARY_PATH || 'E:\\GDM_LIVE_RADIO\\Minhas_Musicas',

  // Streaming
  streamBitrate: parseInt(process.env.STREAM_BITRATE || '128', 10),
  streamSampleRate: 44100,
  streamPort: parseInt(process.env.PORT || '3001', 10),

  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',

  // Firebase
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'gdm-live-radio',
  firebaseServiceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '',

  // Admin
  adminEmails: (process.env.ADMIN_EMAILS || '').split(',').filter(Boolean),

  // CORS
  corsOrigins: (
    process.env.CORS_ORIGINS ||
    'https://gdmlive.web.app,http://localhost:5173,http://localhost:3000'
  ).split(','),

  // Scheduler
  schedulerMode: (process.env.SCHEDULER_MODE || 'random') as
    | 'random'
    | 'sequential'
    | 'playlist',
  avoidRepeatMinutes: parseInt(process.env.AVOID_REPEAT_MINUTES || '60', 10),
  crossfadeSeconds: parseInt(process.env.CROSSFADE_SECONDS || '3', 10),

  // Storage
  cloudStorageBucket:
    process.env.CLOUD_STORAGE_BUCKET || 'gdm-live-radio-music',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Library
  syncOnStartup:
    (process.env.SYNC_ON_STARTUP || 'true').toLowerCase() === 'true',
  watchDirectory:
    (process.env.WATCH_DIRECTORY || 'true').toLowerCase() === 'true',
  scanIntervalMinutes: parseInt(process.env.SCAN_INTERVAL_MINUTES || '30', 10),

  // History
  maxHistoryEntries: parseInt(process.env.MAX_HISTORY_ENTRIES || '200', 10),

  // Queue
  queueLookaheadSize: parseInt(process.env.QUEUE_LOOKAHEAD_SIZE || '10', 10),

  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export type Config = typeof config;
