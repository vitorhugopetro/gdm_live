import { EventEmitter } from 'events';
import { library } from '../library/library';
import { config } from '../config';
import { logger } from '../config/logger';
import type { Track, ProgramSchedulerConfig } from '../types';

// ─── Scheduler Events ─────────────────────────────────────────────────────────
// 'trackStarted'   -> (track: Track)
// 'trackEnded'     -> (track: Track, reason: 'natural' | 'skipped')
// 'queueUpdated'   -> (queue: Track[])
// 'schedulerError' -> (error: Error)

// ─── Fisher-Yates Shuffle ─────────────────────────────────────────────────────

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Scheduler ────────────────────────────────────────────────────────────────

class MusicScheduler extends EventEmitter {
  private schedulerConfig: ProgramSchedulerConfig;
  private queue: Track[] = [];
  private currentTrack: Track | null = null;
  private currentTrackStartedAt: Date | null = null;
  private sequentialIndex = 0;
  private shuffledPool: Track[] = [];

  constructor(initialConfig: ProgramSchedulerConfig) {
    super();
    this.schedulerConfig = { ...initialConfig };

    // React to library events
    library.on('synced', () => this.handleLibraryResync());
    library.on('trackAdded', () => this.ensureQueueFilled());
    library.on('trackRemoved', ({ id }: { id: string }) => this.handleTrackRemoved(id));
  }

  // ── Config ─────────────────────────────────────────────────────────────────

  getConfig(): ProgramSchedulerConfig {
    return { ...this.schedulerConfig };
  }

  updateConfig(patch: Partial<ProgramSchedulerConfig>): void {
    this.schedulerConfig = { ...this.schedulerConfig, ...patch };
    logger.info('Scheduler config updated', { config: this.schedulerConfig });

    // Rebuild queue with new config
    this.queue = [];
    this.shuffledPool = [];
    this.ensureQueueFilled();
  }

  // ── Current Track Access ───────────────────────────────────────────────────

  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  getCurrentTrackStartedAt(): Date | null {
    return this.currentTrackStartedAt;
  }

  getQueue(): Track[] {
    return [...this.queue];
  }

  // ── Track Selection ────────────────────────────────────────────────────────

  selectNextTrack(): Track | undefined {
    const { mode } = this.schedulerConfig;

    if (mode === 'sequential') {
      return this.selectSequential();
    }
    // Default: random with recency bias
    return this.selectRandom();
  }

  private selectRandom(): Track | undefined {
    const recentIds = library.getRecentlyPlayedIds(this.schedulerConfig.avoidRepeatWithin);

    // If the pool is exhausted or empty, rebuild
    if (this.shuffledPool.length === 0) {
      const allTracks = library.getAll();
      if (allTracks.length === 0) return undefined;

      // Prefer tracks not recently played
      const preferred = allTracks.filter((t) => !recentIds.includes(t.id));
      this.shuffledPool = fisherYatesShuffle(preferred.length > 0 ? preferred : allTracks);
    }

    return this.shuffledPool.shift();
  }

  private selectSequential(): Track | undefined {
    const all = library.getAll();
    if (all.length === 0) return undefined;

    if (this.sequentialIndex >= all.length) {
      this.sequentialIndex = 0;
    }

    const track = all[this.sequentialIndex];
    this.sequentialIndex++;
    return track;
  }

  // ── Queue Management ───────────────────────────────────────────────────────

  private ensureQueueFilled(): void {
    const lookahead = config.queueLookaheadSize;
    while (this.queue.length < lookahead) {
      const next = this.selectNextTrack();
      if (!next) break;
      // Avoid adding duplicates to the queue
      if (!this.queue.find((t) => t.id === next.id)) {
        this.queue.push(next);
      } else {
        break; // tiny library - stop to avoid infinite loop
      }
    }

    if (this.queue.length > 0) {
      this.emit('queueUpdated', this.getQueue());
    }
  }

  dequeueNext(): Track | undefined {
    this.ensureQueueFilled();
    return this.queue.shift();
  }

  // ── Track Lifecycle ────────────────────────────────────────────────────────

  notifyTrackStarted(track: Track): void {
    this.currentTrack = track;
    this.currentTrackStartedAt = new Date();
    logger.info(`▶ Now playing: ${track.artist} - ${track.title} [${track.duration}s]`);
    this.emit('trackStarted', track);
    this.ensureQueueFilled();
  }

  notifyTrackEnded(track: Track, reason: 'natural' | 'skipped' = 'natural'): void {
    const durationPlayed = this.currentTrackStartedAt
      ? Math.round((Date.now() - this.currentTrackStartedAt.getTime()) / 1000)
      : track.duration;

    library.addToHistory(track, durationPlayed);

    this.currentTrack = null;
    this.currentTrackStartedAt = null;

    logger.info(`■ Track ended (${reason}): ${track.artist} - ${track.title}`);
    this.emit('trackEnded', track, reason);
  }

  skip(): void {
    if (this.currentTrack) {
      this.notifyTrackEnded(this.currentTrack, 'skipped');
    }
  }

  // ── Library Resync Handler ─────────────────────────────────────────────────

  private handleLibraryResync(): void {
    logger.info('Scheduler: library resynced, rebuilding queue');

    // Reset sequential index if out of bounds
    if (this.sequentialIndex >= library.size) {
      this.sequentialIndex = 0;
    }

    // Rebuild shuffled pool
    this.shuffledPool = [];

    // Remove queued tracks that are no longer in library
    this.queue = this.queue.filter((t) => !!library.getById(t.id));

    this.ensureQueueFilled();
  }

  private handleTrackRemoved(removedId: string): void {
    // Remove from queue if present
    this.queue = this.queue.filter((t) => t.id !== removedId);
    this.ensureQueueFilled();
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  initialize(): void {
    logger.info('Scheduler initialized', { config: this.schedulerConfig });
    this.ensureQueueFilled();
  }
}

// Singleton
export const scheduler = new MusicScheduler({
  mode: config.schedulerMode,
  avoidRepeatWithin: config.avoidRepeatMinutes,
  crossfadeSeconds: config.crossfadeSeconds,
});
