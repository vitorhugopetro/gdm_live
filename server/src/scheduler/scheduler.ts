import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { library } from '../library/library';
import { community } from '../community/community';
import { config } from '../config';
import { logger } from '../config/logger';
import type { Track, ProgramSchedulerConfig, SongRequest } from '../types';

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

  // Song Requests
  private requests: SongRequest[] = [];
  private currentRequestedBy: { name: string; city?: string } | null = null;

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

  getCurrentRequestedBy(): { name: string; city?: string } | null {
    return this.currentRequestedBy;
  }

  getQueue(): Track[] {
    return [...this.queue];
  }

  // ── Song Requests ──────────────────────────────────────────────────────────

  requestTrack(
    trackId: string,
    requesterName: string,
    requesterCity?: string
  ): { success: boolean; message: string; position?: number } {
    const track = library.getById(trackId);
    if (!track) {
      return { success: false, message: 'Louvor não encontrado no acervo da rádio.' };
    }

    if (!track.availableForPlayback) {
      return { success: false, message: 'Este louvor está temporariamente indisponível para programação.' };
    }

    // Check if recently played
    const recentIds = library.getRecentlyPlayedIds(this.schedulerConfig.avoidRepeatWithin);
    if (recentIds.includes(track.id)) {
      return {
        success: false,
        message: `Este louvor tocou recentemente. Para abençoar a grade, aguarde alguns minutos antes de pedir novamente.`,
      };
    }

    // Check if already in queue or pending requests
    const alreadyRequested = this.requests.find(
      (r) => r.trackId === track.id && r.status === 'pending'
    );
    if (alreadyRequested) {
      return {
        success: true,
        message: `O louvor "${track.title}" já está na fila de pedidos e tocará em breve!`,
      };
    }

    const songReq: SongRequest = {
      id: uuidv4(),
      trackId: track.id,
      trackTitle: track.title,
      trackArtist: track.artist,
      requesterName: requesterName.trim() || 'Ouvinte da Fé',
      requesterCity: requesterCity?.trim() || undefined,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    this.requests.push(songReq);

    // Insert track at position 1 or 2 in queue for fast turnaround
    const insertIndex = Math.min(1, this.queue.length);
    this.queue.splice(insertIndex, 0, track);

    logger.info(`✨ Pedido de louvor recebido: "${track.title}" por ${songReq.requesterName}`);
    this.emit('queueUpdated', this.getQueue());

    return {
      success: true,
      message: `Louvor "${track.title}" agendado com sucesso! Tocará em breve na GDM Live.`,
      position: insertIndex + 1,
    };
  }

  getRequests(limit = 20): SongRequest[] {
    return [...this.requests].slice(-limit).reverse();
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
      const allTracks = library.getAll().filter((t) => t.availableForPlayback !== false);
      if (allTracks.length === 0) return undefined;

      // Prefer tracks not recently played
      const preferred = allTracks.filter((t) => !recentIds.includes(t.id));
      this.shuffledPool = fisherYatesShuffle(preferred.length > 0 ? preferred : allTracks);
    }

    return this.shuffledPool.shift();
  }

  private selectSequential(): Track | undefined {
    const all = library.getAll().filter((t) => t.availableForPlayback !== false);
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
    const nextTrack = this.queue.shift();

    // Check if nextTrack was a requested song
    if (nextTrack) {
      const req = this.requests.find(
        (r) => r.trackId === nextTrack.id && r.status === 'pending'
      );
      if (req) {
        req.status = 'playing';
        this.currentRequestedBy = {
          name: req.requesterName,
          city: req.requesterCity,
        };
      } else {
        this.currentRequestedBy = null;
      }
    }

    return nextTrack;
  }

  // ── Track Lifecycle ────────────────────────────────────────────────────────

  notifyTrackStarted(track: Track): void {
    this.currentTrack = track;
    this.currentTrackStartedAt = new Date();

    // Record in community analytics
    community.recordPlay(track.id);

    const reqInfo = this.currentRequestedBy ? ` [Pedido por ${this.currentRequestedBy.name}]` : '';
    logger.info(`▶ Now playing: ${track.artist} - ${track.title} [${track.duration}s]${reqInfo}`);
    this.emit('trackStarted', track);
    this.ensureQueueFilled();
  }

  notifyTrackEnded(track: Track, reason: 'natural' | 'skipped' = 'natural'): void {
    const durationPlayed = this.currentTrackStartedAt
      ? Math.round((Date.now() - this.currentTrackStartedAt.getTime()) / 1000)
      : track.duration;

    library.addToHistory(track, durationPlayed);

    // Mark request as played
    const req = this.requests.find(
      (r) => r.trackId === track.id && r.status === 'playing'
    );
    if (req) {
      req.status = 'played';
    }

    this.currentTrack = null;
    this.currentTrackStartedAt = null;
    this.currentRequestedBy = null;

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

    if (this.sequentialIndex >= library.size) {
      this.sequentialIndex = 0;
    }

    this.shuffledPool = [];
    this.queue = this.queue.filter((t) => !!library.getById(t.id));
    this.ensureQueueFilled();
  }

  private handleTrackRemoved(removedId: string): void {
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
