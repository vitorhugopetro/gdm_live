import * as path from 'path';
import chokidar, { FSWatcher } from 'chokidar';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { scanLibrary, scanSingleFile } from './scanner';
import { config } from '../config';
import { logger } from '../config/logger';
import type { Track, LibraryStats, PlaybackHistory } from '../types';

// ─── Library Manager ──────────────────────────────────────────────────────────

class LibraryManager extends EventEmitter {
  private tracks: Map<string, Track> = new Map();
  private tracksByPath: Map<string, string> = new Map(); // filePath -> id
  private playbackHistory: PlaybackHistory[] = [];
  private lastSync: string | null = null;
  private syncInProgress = false;
  private watcher: FSWatcher | null = null;

  // ── Sync ───────────────────────────────────────────────────────────────────

  async sync(): Promise<void> {
    if (this.syncInProgress) {
      logger.warn('Library sync already in progress, skipping');
      return;
    }

    this.syncInProgress = true;
    this.emit('syncStart');

    try {
      const result = await scanLibrary(config.musicLibraryPath);

      // Rebuild maps
      const newTracks = new Map<string, Track>();
      const newByPath = new Map<string, string>();

      for (const track of result.tracks) {
        // Preserve existing ID if we already know this file path
        const existingId = this.tracksByPath.get(track.filePath);
        const id = existingId || track.id;
        const finalTrack = { ...track, id };

        newTracks.set(id, finalTrack);
        newByPath.set(track.filePath, id);
      }

      this.tracks = newTracks;
      this.tracksByPath = newByPath;
      this.lastSync = new Date().toISOString();

      logger.info(`Library synced: ${this.tracks.size} tracks loaded`);
      this.emit('synced', { count: this.tracks.size, errors: result.errors.length });
    } catch (err) {
      logger.error('Library sync failed', { error: (err as Error).message });
      this.emit('syncError', err);
    } finally {
      this.syncInProgress = false;
    }
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  getAll(): Track[] {
    return Array.from(this.tracks.values()).filter((t) => t.availableForPlayback);
  }

  getAllIncludingInvalid(): Track[] {
    return Array.from(this.tracks.values());
  }

  getById(id: string): Track | undefined {
    return this.tracks.get(id);
  }

  getByPath(filePath: string): Track | undefined {
    const id = this.tracksByPath.get(filePath);
    return id ? this.tracks.get(id) : undefined;
  }

  getRandom(excludeIds: string[] = []): Track | undefined {
    const available = this.getAll().filter((t) => !excludeIds.includes(t.id));
    if (available.length === 0) {
      // Fallback: ignore exclusions if nothing available
      const all = this.getAll();
      if (all.length === 0) return undefined;
      return all[Math.floor(Math.random() * all.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  getSequential(afterId?: string): Track | undefined {
    const tracks = this.getAll();
    if (tracks.length === 0) return undefined;

    if (!afterId) return tracks[0];

    const idx = tracks.findIndex((t) => t.id === afterId);
    if (idx === -1) return tracks[0];

    // Wrap around
    return tracks[(idx + 1) % tracks.length];
  }

  getStats(): LibraryStats {
    const all = this.getAllIncludingInvalid();
    const valid = all.filter((t) => t.validationStatus === 'valid');
    const invalid = all.filter((t) => t.validationStatus === 'invalid');
    const totalDuration = valid.reduce((sum, t) => sum + t.duration, 0);

    return {
      totalTracks: all.length,
      validTracks: valid.length,
      invalidTracks: invalid.length,
      totalDuration,
      lastSync: this.lastSync,
      syncInProgress: this.syncInProgress,
    };
  }

  get size(): number {
    return this.tracks.size;
  }

  // ── Playback History ───────────────────────────────────────────────────────

  addToHistory(track: Track, durationPlayed: number): void {
    const entry: PlaybackHistory = {
      id: uuidv4(),
      track,
      playedAt: new Date().toISOString(),
      duration: durationPlayed,
    };

    this.playbackHistory.unshift(entry);

    // Cap history size
    if (this.playbackHistory.length > config.maxHistoryEntries) {
      this.playbackHistory = this.playbackHistory.slice(0, config.maxHistoryEntries);
    }

    this.emit('historyUpdated', entry);
  }

  getHistory(limit = 50): PlaybackHistory[] {
    return this.playbackHistory.slice(0, limit);
  }

  getRecentlyPlayedIds(withinMinutes: number): string[] {
    const cutoff = Date.now() - withinMinutes * 60 * 1000;
    return this.playbackHistory
      .filter((h) => new Date(h.playedAt).getTime() > cutoff)
      .map((h) => h.track.id);
  }

  // ── File Watcher ───────────────────────────────────────────────────────────

  watchDirectory(): void {
    if (this.watcher) {
      logger.warn('File watcher already running');
      return;
    }

    const watchPath = config.musicLibraryPath;
    logger.info(`Starting file watcher on: ${watchPath}`);

    this.watcher = chokidar.watch(watchPath, {
      ignored: /(^|[/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    });

    this.watcher
      .on('add', async (filePath: string) => {
        logger.info(`New file detected: ${path.basename(filePath)}`);
        const track = await scanSingleFile(filePath);
        if (track) {
          // Preserve any existing id
          const existingId = this.tracksByPath.get(filePath);
          const id = existingId || track.id;
          const finalTrack = { ...track, id };
          this.tracks.set(id, finalTrack);
          this.tracksByPath.set(filePath, id);
          this.emit('trackAdded', finalTrack);
          logger.info(`Track added to library: ${finalTrack.title}`);
        }
      })
      .on('change', async (filePath: string) => {
        logger.info(`File changed: ${path.basename(filePath)}`);
        const track = await scanSingleFile(filePath);
        if (track) {
          const existingId = this.tracksByPath.get(filePath);
          const id = existingId || track.id;
          const finalTrack = { ...track, id };
          this.tracks.set(id, finalTrack);
          this.tracksByPath.set(filePath, id);
          this.emit('trackUpdated', finalTrack);
        }
      })
      .on('unlink', (filePath: string) => {
        const id = this.tracksByPath.get(filePath);
        if (id) {
          const track = this.tracks.get(id);
          this.tracks.delete(id);
          this.tracksByPath.delete(filePath);
          logger.info(`Track removed from library: ${path.basename(filePath)}`);
          this.emit('trackRemoved', { id, filePath, track });
        }
      })
      .on('error', (error: Error) => {
        logger.error('File watcher error', { error: error.message });
      });
  }

  async stopWatcher(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
      logger.info('File watcher stopped');
    }
  }

  // ── Internal Mutations (used by watcher/admin) ─────────────────────────────

  toggleTrackAvailability(id: string): boolean {
    const track = this.tracks.get(id);
    if (!track) return false;
    track.availableForPlayback = !track.availableForPlayback;
    this.emit('trackUpdated', track);
    return true;
  }

  removeTrack(id: string): boolean {
    const track = this.tracks.get(id);
    if (!track) return false;
    this.tracks.delete(id);
    this.tracksByPath.delete(track.filePath);
    return true;
  }
}

// Singleton export
export const library = new LibraryManager();
