import 'dotenv/config';
import * as http from 'http';
import * as cron from 'node-cron';
import { createApp } from './app';
import { library } from './library/library';
import { scheduler } from './scheduler/scheduler';
import { streamer } from './streaming/ffmpeg-stream';
import { config } from './config';
import { logger } from './config/logger';

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

let server: http.Server | null = null;

async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Shutting down gracefully...`);

  // Stop file watcher
  await library.stopWatcher();

  // Stop streamer
  streamer.stopCurrent();

  // Close HTTP server
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server!.close((err) => (err ? reject(err) : resolve()));
    });
  }

  logger.info('Server shut down cleanly');
  process.exit(0);
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error(`Unhandled promise rejection: ${String(reason)}`);
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('  GDM Live Radio Server starting...');
  logger.info(`  Environment : ${config.nodeEnv}`);
  logger.info(`  Port        : ${config.port}`);
  logger.info(`  Music Path  : ${config.musicLibraryPath}`);
  logger.info(`  Bitrate     : ${config.streamBitrate}kbps`);
  logger.info(`  Scheduler   : ${config.schedulerMode}`);
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 1. Scan library
  if (config.syncOnStartup) {
    logger.info('Performing initial library scan...');
    await library.sync();
  }

  const stats = library.getStats();
  logger.info(`Library ready: ${stats.validTracks} tracks (${Math.round(stats.totalDuration / 3600)}h total)`);

  if (stats.validTracks === 0) {
    logger.warn('⚠ No valid tracks found! Check MUSIC_LIBRARY_PATH. Streaming will start when tracks are available.');
  }

  // 2. Initialize scheduler
  scheduler.initialize();

  // 3. Start file watcher
  if (config.watchDirectory) {
    library.watchDirectory();
  }

  // 4. Schedule periodic re-sync via cron
  const cronExpression = `*/${config.scanIntervalMinutes} * * * *`;
  cron.schedule(cronExpression, async () => {
    logger.info('Cron: triggering scheduled library sync');
    await library.sync().catch((err: Error) =>
      logger.error('Cron sync failed', { error: err.message })
    );
  });
  logger.info(`Library sync scheduled every ${config.scanIntervalMinutes} minutes`);

  // 5. Start HTTP server
  const app = createApp();
  server = http.createServer(app);

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${config.port} is already in use`);
    } else {
      logger.error(`Server error: ${err.message}`);
    }
    process.exit(1);
  });

  await new Promise<void>((resolve) => {
    server!.listen(config.port, config.host, () => {
      logger.info(`✔ HTTP server listening on ${config.host}:${config.port}`);
      resolve();
    });
  });

  // 6. Start streaming (after server is up)
  if (stats.validTracks > 0) {
    logger.info('Starting audio stream...');
    await streamer.start();
  } else {
    logger.warn('Streaming deferred until tracks are available');
    // Watch for library sync completing with tracks
    library.once('synced', async ({ count }: { count: number }) => {
      if (count > 0 && !streamer.isCurrentlyPlaying()) {
        logger.info('Tracks now available, starting stream...');
        await streamer.start();
      }
    });
  }

  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('  GDM Live Radio is LIVE 🎵');
  logger.info(`  Stream: http://${config.host}:${config.port}/stream`);
  logger.info(`  API:    http://${config.host}:${config.port}/api`);
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

bootstrap().catch((err: Error) => {
  logger.error(`Fatal bootstrap error: ${err.message}`, { stack: err.stack });
  process.exit(1);
});
