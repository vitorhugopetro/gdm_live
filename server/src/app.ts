import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import admin from 'firebase-admin';
import * as fs from 'fs';
import apiRouter from './api/routes';
import { streamer } from './streaming/ffmpeg-stream';
import { config } from './config';
import { logger } from './config/logger';

// ─── Firebase Admin Initialization ───────────────────────────────────────────

function initFirebase(): void {
  if (admin.apps.length > 0) return;

  try {
    if (config.firebaseServiceAccountPath && fs.existsSync(config.firebaseServiceAccountPath)) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(config.firebaseServiceAccountPath, 'utf8')
      ) as admin.ServiceAccount;

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: config.firebaseProjectId,
        storageBucket: config.cloudStorageBucket,
      });

      logger.info('Firebase initialized with service account file');
    } else {
      // Use Application Default Credentials (Cloud Run, etc.)
      admin.initializeApp({
        projectId: config.firebaseProjectId,
        storageBucket: config.cloudStorageBucket,
      });

      logger.info('Firebase initialized with Application Default Credentials');
    }
  } catch (err) {
    logger.warn(`Firebase initialization failed: ${(err as Error).message}. Auth middleware will be disabled.`);
  }
}

// ─── Express App Factory ──────────────────────────────────────────────────────

export function createApp(): express.Application {
  initFirebase();

  const app = express();

  // ── Security Headers ──────────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // clients handle their own CSP
    })
  );

  // ── CORS ──────────────────────────────────────────────────────────────────
  const corsOrigins = config.corsOrigins;
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (corsOrigins.includes(origin) || !config.isProduction) {
          return callback(null, true);
        }
        callback(new Error(`CORS: Origin not allowed: ${origin}`));
      },
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // ── Body Parser ───────────────────────────────────────────────────────────
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ── HTTP Request Logging ──────────────────────────────────────────────────
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.http(`${req.method} ${req.url}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // ── Audio Stream Endpoint ─────────────────────────────────────────────────
  app.get('/stream', (req: Request, res: Response) => {
    logger.info(`New stream connection from ${req.ip}`);
    streamer.addStreamListener(req as unknown as import('http').IncomingMessage, res as unknown as import('http').ServerResponse);
  });

  // ── API Routes ────────────────────────────────────────────────────────────
  app.use('/api', apiRouter);

  // ── Root Health Check ─────────────────────────────────────────────────────
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'GDM Live Radio',
      description: 'Graça Digital Music Streaming Server',
      version: process.env.npm_package_version || '1.0.0',
      status: 'running',
      endpoints: {
        stream: '/stream',
        nowPlaying: '/api/now-playing',
        library: '/api/library',
        stats: '/api/library/stats',
        history: '/api/history',
        upcoming: '/api/upcoming',
        status: '/api/status',
        events: '/api/events',
      },
    });
  });

  // ── 404 Handler ───────────────────────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      timestamp: new Date().toISOString(),
    });
  });

  // ── Global Error Handler ──────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
    res.status(500).json({
      success: false,
      error: config.isProduction ? 'Internal server error' : err.message,
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
