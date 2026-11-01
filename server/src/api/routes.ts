import { Router, Request, Response } from 'express';
import { library } from '../library/library';
import { scheduler } from '../scheduler/scheduler';
import { streamer } from '../streaming/ffmpeg-stream';
import { requireAuth } from '../middleware/auth';
import { config } from '../config';
import { logger } from '../config/logger';
import type { NowPlaying, ApiResponse, PaginatedResponse, Track, AdminConfigPatch } from '../types';

const router = Router();

// ─── Helper ───────────────────────────────────────────────────────────────────

function ok<T>(res: Response, data: T, status = 200): void {
  const body: ApiResponse<T> = { success: true, data, timestamp: new Date().toISOString() };
  res.status(status).json(body);
}

function fail(res: Response, error: string, status = 400): void {
  const body: ApiResponse = { success: false, error, timestamp: new Date().toISOString() };
  res.status(status).json(body);
}

// ─── GET /api/now-playing ─────────────────────────────────────────────────────

router.get('/now-playing', (_req: Request, res: Response) => {
  const currentTrack = streamer.getCurrentTrack();
  const startedAt = scheduler.getCurrentTrackStartedAt()?.toISOString() ?? null;
  const schedulerCfg = scheduler.getConfig();

  const nowPlaying: NowPlaying = {
    track: currentTrack,
    startedAt,
    streamUrl: `/stream`,
    listenerCount: streamer.getListenerCount(),
    isLive: streamer.isCurrentlyPlaying(),
    programMode: schedulerCfg.mode,
  };

  ok(res, nowPlaying);
});

// ─── GET /api/library ─────────────────────────────────────────────────────────

router.get('/library', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
  const pageSize = Math.min(200, Math.max(1, parseInt((req.query.pageSize as string) || '50', 10)));
  const search = ((req.query.search as string) || '').toLowerCase().trim();
  const artist = ((req.query.artist as string) || '').toLowerCase().trim();

  let tracks = library.getAll();

  // Filter
  if (search) {
    tracks = tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(search) ||
        t.artist.toLowerCase().includes(search) ||
        t.album.toLowerCase().includes(search)
    );
  }
  if (artist) {
    tracks = tracks.filter((t) => t.artist.toLowerCase().includes(artist));
  }

  // Sort by artist then title
  tracks.sort((a, b) =>
    a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title)
  );

  const total = tracks.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const offset = (page - 1) * pageSize;
  const items = tracks.slice(offset, offset + pageSize);

  // Strip coverArtDataUrl for list view (too much data)
  const stripped = items.map(({ coverArtDataUrl: _cov, ...rest }) => rest as Track);

  const paged: PaginatedResponse<Track> = { items: stripped, total, page, pageSize, totalPages };
  ok(res, paged);
});

// ─── GET /api/library/stats ───────────────────────────────────────────────────

router.get('/library/stats', (_req: Request, res: Response) => {
  ok(res, library.getStats());
});

// ─── GET /api/library/:id ─────────────────────────────────────────────────────

router.get('/library/:id', (req: Request, res: Response) => {
  const track = library.getById(req.params.id);
  if (!track) {
    fail(res, `Track not found: ${req.params.id}`, 404);
    return;
  }
  ok(res, track);
});

// ─── GET /api/history ─────────────────────────────────────────────────────────

router.get('/history', (req: Request, res: Response) => {
  const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) || '50', 10)));
  ok(res, library.getHistory(limit));
});

// ─── GET /api/upcoming ────────────────────────────────────────────────────────

router.get('/upcoming', (_req: Request, res: Response) => {
  const queue = scheduler.getQueue().slice(0, config.queueLookaheadSize);
  ok(res, queue);
});

// ─── GET /api/status ──────────────────────────────────────────────────────────

router.get('/status', (_req: Request, res: Response) => {
  const stats = library.getStats();
  ok(res, {
    status: 'ok',
    uptime: process.uptime(),
    memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    library: stats,
    stream: {
      isLive: streamer.isCurrentlyPlaying(),
      listenerCount: streamer.getListenerCount(),
      currentTrack: streamer.getCurrentTrack()?.title ?? null,
    },
    scheduler: scheduler.getConfig(),
    version: process.env.npm_package_version || '1.0.0',
    nodeVersion: process.version,
    environment: config.nodeEnv,
  });
});

// ─── SSE /api/events ──────────────────────────────────────────────────────────
// Server-Sent Events for real-time now-playing updates

router.get('/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const sendEvent = (event: string, data: unknown): void => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial state
  sendEvent('connected', { message: 'GDM Live Radio SSE connected' });

  const nowPlayingInterval = setInterval(() => {
    const currentTrack = streamer.getCurrentTrack();
    const startedAt = scheduler.getCurrentTrackStartedAt()?.toISOString() ?? null;
    const nowPlaying: NowPlaying = {
      track: currentTrack,
      startedAt,
      streamUrl: '/stream',
      listenerCount: streamer.getListenerCount(),
      isLive: streamer.isCurrentlyPlaying(),
      programMode: scheduler.getConfig().mode,
    };
    sendEvent('nowPlaying', nowPlaying);
  }, 5000);

  // Heartbeat to keep connection alive
  const heartbeatInterval = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(nowPlayingInterval);
    clearInterval(heartbeatInterval);
  });
});

// ─── ADMIN: POST /api/admin/sync ──────────────────────────────────────────────

router.post('/admin/sync', requireAuth, async (_req: Request, res: Response) => {
  logger.info('Admin triggered library sync');
  // Non-blocking
  library.sync().catch((err: Error) =>
    logger.error('Admin sync failed', { error: err.message })
  );
  ok(res, { message: 'Library sync started' });
});

// ─── ADMIN: GET /api/admin/logs ───────────────────────────────────────────────

router.get('/admin/logs', requireAuth, (req: Request, res: Response) => {
  const limit = Math.min(500, Math.max(1, parseInt((req.query.limit as string) || '100', 10)));
  ok(res, logger.getLogs(limit));
});

// ─── ADMIN: PATCH /api/admin/config ──────────────────────────────────────────

router.patch('/admin/config', requireAuth, (req: Request, res: Response) => {
  const patch = req.body as AdminConfigPatch;

  const schedulerPatch: Partial<{ mode: 'random' | 'sequential' | 'playlist'; avoidRepeatWithin: number; crossfadeSeconds: number }> = {};

  if (patch.mode !== undefined) {
    const validModes = ['random', 'sequential', 'playlist'];
    if (!validModes.includes(patch.mode)) {
      fail(res, `Invalid mode: ${patch.mode}. Must be one of: ${validModes.join(', ')}`);
      return;
    }
    schedulerPatch.mode = patch.mode;
  }

  if (patch.avoidRepeatMinutes !== undefined) {
    if (typeof patch.avoidRepeatMinutes !== 'number' || patch.avoidRepeatMinutes < 0) {
      fail(res, 'avoidRepeatMinutes must be a non-negative number');
      return;
    }
    schedulerPatch.avoidRepeatWithin = patch.avoidRepeatMinutes;
  }

  if (patch.crossfadeSeconds !== undefined) {
    if (typeof patch.crossfadeSeconds !== 'number' || patch.crossfadeSeconds < 0) {
      fail(res, 'crossfadeSeconds must be a non-negative number');
      return;
    }
    schedulerPatch.crossfadeSeconds = patch.crossfadeSeconds;
  }

  if (patch.streamBitrate !== undefined) {
    const validBitrates = [64, 96, 128, 192, 256, 320];
    if (!validBitrates.includes(patch.streamBitrate)) {
      fail(res, `Invalid bitrate: ${patch.streamBitrate}. Must be one of: ${validBitrates.join(', ')}`);
      return;
    }
    config.streamBitrate = patch.streamBitrate;
  }

  if (Object.keys(schedulerPatch).length > 0) {
    scheduler.updateConfig(schedulerPatch);
  }

  logger.info('Admin updated config', { patch });
  ok(res, { message: 'Config updated', current: scheduler.getConfig() });
});

// ─── ADMIN: POST /api/admin/skip ─────────────────────────────────────────────

router.post('/admin/skip', requireAuth, (_req: Request, res: Response) => {
  const current = streamer.getCurrentTrack();
  if (!current) {
    fail(res, 'No track is currently playing');
    return;
  }

  logger.info(`Admin skipped track: ${current.title}`);
  streamer.skip();
  ok(res, { message: `Skipped: ${current.title}` });
});

// ─── ADMIN: GET /api/admin/listeners ─────────────────────────────────────────

router.get('/admin/listeners', requireAuth, (_req: Request, res: Response) => {
  ok(res, {
    count: streamer.getListenerCount(),
    listeners: streamer.getListeners(),
  });
});

export default router;
