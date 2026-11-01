import * as fs from 'fs';
import * as http from 'http';
import { PassThrough, Readable } from 'stream';
import { EventEmitter } from 'events';
import ffmpeg from 'fluent-ffmpeg';
// @ts-ignore
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { scheduler } from '../scheduler/scheduler';
import { logger } from '../config/logger';
import { config } from '../config';
import type { Track, StreamListener, StreamMetadata } from '../types';
import { v4 as uuidv4 } from 'uuid';

if (ffmpegInstaller && ffmpegInstaller.path) {
  ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  logger.info(`FFmpeg path configured from installer: ${ffmpegInstaller.path}`);
}

// ─── Broadcast Stream Manager ─────────────────────────────────────────────────
// One FFmpeg process transcodes audio -> multiple PassThrough streams (listeners)

interface ListenerEntry {
  info: StreamListener;
  pass: PassThrough;
  response: http.ServerResponse;
}

class FFmpegStreamer extends EventEmitter {
  private activeListeners: Map<string, ListenerEntry> = new Map();
  private currentTrack: Track | null = null;
  private currentProcess: ReturnType<typeof ffmpeg> | null = null;
  private isPlaying = false;
  private transitionTimer: NodeJS.Timeout | null = null;

  // ── Listener Management ────────────────────────────────────────────────────

  addStreamListener(req: http.IncomingMessage, res: http.ServerResponse): string {
    const id = uuidv4();
    const pass = new PassThrough();

    // ICY metadata headers for Icecast-compatible players
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache, no-store',
      'X-Accel-Buffering': 'no',
      'icy-name': 'GDM Live Radio',
      'icy-genre': 'Gospel',
      'icy-url': 'https://gdmlive.web.app',
      'icy-pub': '1',
      'icy-br': String(config.streamBitrate),
      'icy-metaint': '0',
    });

    const entry: ListenerEntry = {
      info: {
        id,
        connectedAt: new Date().toISOString(),
        remoteAddress: req.socket.remoteAddress || 'unknown',
      },
      pass,
      response: res,
    };

    this.activeListeners.set(id, entry);
    pass.pipe(res);

    logger.info(`Listener connected: ${id} (${entry.info.remoteAddress}) — total: ${this.activeListeners.size}`);

    req.on('close', () => this.removeStreamListener(id));
    req.on('error', () => this.removeStreamListener(id));
    res.on('error', () => this.removeStreamListener(id));

    this.emit('listenerJoined', entry.info);
    return id;
  }

  removeStreamListener(id: string): void {
    const entry = this.activeListeners.get(id);
    if (!entry) return;

    try {
      entry.pass.end();
    } catch { /* ignore */ }

    this.activeListeners.delete(id);
    logger.info(`Listener disconnected: ${id} — remaining: ${this.activeListeners.size}`);
    this.emit('listenerLeft', entry.info);
  }

  getListenerCount(): number {
    return this.activeListeners.size;
  }

  getListeners(): StreamListener[] {
    return Array.from(this.activeListeners.values()).map((e) => e.info);
  }

  // ── Audio Broadcasting ─────────────────────────────────────────────────────

  private broadcast(chunk: Buffer): void {
    for (const [id, entry] of this.activeListeners) {
      if (!entry.pass.writableEnded) {
        try {
          entry.pass.write(chunk);
        } catch (err) {
          logger.warn(`Error writing to listener ${id}: ${(err as Error).message}`);
          this.removeStreamListener(id);
        }
      } else {
        this.removeStreamListener(id);
      }
    }
  }

  // ── Playback ───────────────────────────────────────────────────────────────

  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentMetadata(): StreamMetadata | null {
    if (!this.currentTrack) return null;
    return {
      title: this.currentTrack.title,
      artist: this.currentTrack.artist,
      trackId: this.currentTrack.id,
      startedAt: scheduler.getCurrentTrackStartedAt()?.toISOString() || new Date().toISOString(),
    };
  }

  async playTrack(track: Track): Promise<void> {
    // Stop any current track
    this.stopCurrent();

    // Verify file exists
    try {
      await fs.promises.access(track.filePath, fs.constants.R_OK);
    } catch {
      logger.error(`Cannot access audio file: ${track.filePath}`);
      scheduler.notifyTrackEnded(track, 'skipped');
      this.scheduleNext(0);
      return;
    }

    this.currentTrack = track;
    this.isPlaying = true;

    logger.info(`Starting FFmpeg stream: ${track.title}`, {
      file: track.fileName,
      duration: track.duration,
    });

    scheduler.notifyTrackStarted(track);

    try {
      const proc = ffmpeg(track.filePath)
        .audioCodec('libmp3lame')
        .audioBitrate(config.streamBitrate)
        .audioFrequency(config.streamSampleRate)
        .audioChannels(2)
        .format('mp3')
        .on('start', (cmd: string) => {
          logger.debug('FFmpeg started', { cmd });
        })
        .on('error', (err: Error) => {
          logger.error(`FFmpeg error for ${track.title}: ${err.message}`);
          this.isPlaying = false;
          scheduler.notifyTrackEnded(track, 'natural');
          this.scheduleNext(0);
        })
        .on('end', () => {
          logger.info(`FFmpeg finished: ${track.title}`);
          this.isPlaying = false;
          scheduler.notifyTrackEnded(track, 'natural');
          this.scheduleNext(config.crossfadeSeconds * 1000);
        });

      this.currentProcess = proc;

      const stream = proc.pipe() as Readable;

      stream.on('data', (chunk: Buffer) => {
        this.broadcast(chunk);
      });

      stream.on('error', (err: Error) => {
        logger.error(`Stream error: ${err.message}`);
        this.isPlaying = false;
        scheduler.notifyTrackEnded(track, 'natural');
        this.scheduleNext(1000);
      });
    } catch (err) {
      logger.error(`Failed to start FFmpeg: ${(err as Error).message}`);
      this.isPlaying = false;
      scheduler.notifyTrackEnded(track, 'skipped');
      this.scheduleNext(1000);
    }
  }

  stopCurrent(): void {
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = null;
    }

    if (this.currentProcess) {
      try {
        this.currentProcess.kill('SIGTERM');
      } catch { /* ignore */ }
      this.currentProcess = null;
    }

    this.isPlaying = false;
  }

  skip(): void {
    const current = this.currentTrack;
    this.stopCurrent();

    if (current) {
      scheduler.notifyTrackEnded(current, 'skipped');
    }

    this.scheduleNext(0);
  }

  private scheduleNext(delayMs: number): void {
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
    }

    this.transitionTimer = setTimeout(async () => {
      this.transitionTimer = null;
      const next = scheduler.dequeueNext();
      if (next) {
        await this.playTrack(next);
      } else {
        logger.warn('No tracks available in queue. Retrying in 10s...');
        this.transitionTimer = setTimeout(() => {
          const retryNext = scheduler.dequeueNext();
          if (retryNext) {
            void this.playTrack(retryNext);
          }
        }, 10000);
      }
    }, delayMs);
  }

  // ── Auto-start ─────────────────────────────────────────────────────────────

  async start(): Promise<void> {
    if (this.isPlaying) return;

    const first = scheduler.dequeueNext();
    if (!first) {
      logger.warn('Cannot start streamer: no tracks in queue');
      // Try again in 5 seconds
      setTimeout(() => void this.start(), 5000);
      return;
    }

    await this.playTrack(first);
  }
}

// Singleton
export const streamer = new FFmpegStreamer();
