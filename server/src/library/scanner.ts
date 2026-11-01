import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as mm from 'music-metadata';
import { config } from '../config';
import { logger } from '../config/logger';
import type { Track, ScanResult, ScanError } from '../types';

// Supported audio extensions
const AUDIO_EXTENSIONS = new Set(['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac']);
const CACHE_PATH = path.join(process.cwd(), 'data', 'library-cache.json');

interface CacheEntry {
  mtime: string;
  size: number;
  track: Track;
}

function loadCache(): Map<string, CacheEntry> {
  const map = new Map<string, CacheEntry>();
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
      for (const item of data) {
        if (item && item.track && item.track.filePath) {
          map.set(item.track.filePath, item);
        }
      }
      logger.info(`Loaded ${map.size} cached tracks from ${CACHE_PATH}`);
    }
  } catch (e) {
    logger.warn('Failed to load library cache, will rescan full library');
  }
  return map;
}

function saveCache(tracks: Track[]): void {
  try {
    const data: CacheEntry[] = tracks.map((t) => ({
      mtime: t.lastModified,
      size: t.fileSize,
      track: t,
    }));
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(data), 'utf-8');
    logger.info(`Saved ${tracks.length} tracks to library cache`);
  } catch (e) {
    logger.warn(`Could not save library cache: ${(e as Error).message}`);
  }
}

// ─── Filename Parsing ─────────────────────────────────────────────────────────

/**
 * Attempts to extract artist and title from a filename like "Artist - Title.mp3"
 * or falls back to using the filename itself as the title.
 */
function parseFilename(filename: string): { artist: string; title: string } {
  const base = path.basename(filename, path.extname(filename));
  const separatorIndex = base.indexOf(' - ');
  if (separatorIndex !== -1) {
    return {
      artist: base.substring(0, separatorIndex).trim(),
      title: base.substring(separatorIndex + 3).trim(),
    };
  }
  return { artist: 'Unknown Artist', title: base.trim() };
}

// ─── Cover Art Extraction ─────────────────────────────────────────────────────

function extractCoverArtDataUrl(pictures: mm.IPicture[] | undefined): string | undefined {
  if (!pictures || pictures.length === 0) return undefined;
  const pic = pictures[0];
  if (!pic.data || pic.data.length === 0) return undefined;
  const b64 = pic.data.toString('base64');
  const mime = pic.format || 'image/jpeg';
  return `data:${mime};base64,${b64}`;
}

// ─── Single File Scanner ──────────────────────────────────────────────────────

async function scanFile(filePath: string): Promise<Track> {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const stat = await fs.promises.stat(filePath);

  let title = '';
  let artist = '';
  let album = '';
  let duration = 0;
  let coverArtDataUrl: string | undefined;

  try {
    const metadata = await mm.parseFile(filePath, { duration: true, skipPostHeaders: true });
    const common = metadata.common;
    const fmt = metadata.format;

    title = common.title?.trim() || '';
    artist = (common.artist || common.albumartist || '').trim();
    album = (common.album || '').trim();
    duration = fmt.duration || 0;
    coverArtDataUrl = extractCoverArtDataUrl(common.picture);
  } catch (parseErr) {
    logger.warn(`Could not parse metadata for ${fileName}: ${(parseErr as Error).message}`);
  }

  // Fallback to filename parsing if tags are missing
  if (!title || !artist) {
    const parsed = parseFilename(fileName);
    if (!title) title = parsed.title;
    if (!artist) artist = parsed.artist;
  }

  return {
    id: uuidv4(),
    filePath,
    fileName,
    title,
    artist,
    album: album || 'Unknown Album',
    duration: Math.round(duration),
    format: ext.replace('.', ''),
    fileSize: stat.size,
    coverArtDataUrl,
    discoveredAt: new Date().toISOString(),
    validationStatus: 'valid',
    availableForPlayback: true,
    lastModified: stat.mtime.toISOString(),
  };
}

// ─── Directory Walker ─────────────────────────────────────────────────────────

async function walkDirectory(dir: string): Promise<string[]> {
  const results: string[] = [];

  async function recurse(currentDir: string): Promise<void> {
    let entries: fs.Dirent[];
    try {
      entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    } catch (err) {
      logger.error(`Cannot read directory: ${currentDir}`, { error: (err as Error).message });
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await recurse(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (AUDIO_EXTENSIONS.has(ext)) {
          results.push(fullPath);
        }
      }
    }
  }

  await recurse(dir);
  return results;
}

// ─── Main Scanner Function ────────────────────────────────────────────────────

export async function scanLibrary(
  libraryPath: string = config.musicLibraryPath
): Promise<ScanResult> {
  const startTime = Date.now();
  const tracks: Track[] = [];
  const errors: ScanError[] = [];

  logger.info(`Starting library scan: ${libraryPath}`);

  // Verify directory exists
  try {
    const stat = await fs.promises.stat(libraryPath);
    if (!stat.isDirectory()) {
      throw new Error(`${libraryPath} is not a directory`);
    }
  } catch (err) {
    const message = `Music library path not accessible: ${(err as Error).message}`;
    logger.error(message);
    return { tracks: [], errors: [{ filePath: libraryPath, error: message }], scannedFiles: 0, durationMs: Date.now() - startTime };
  }

  const files = await walkDirectory(libraryPath);
  logger.info(`Found ${files.length} audio files in directory...`);

  const cache = loadCache();
  const filesToScan: string[] = [];

  for (const filePath of files) {
    try {
      const stat = await fs.promises.stat(filePath);
      const cached = cache.get(filePath);
      if (cached && cached.mtime === stat.mtime.toISOString() && cached.size === stat.size) {
        tracks.push(cached.track);
      } else {
        filesToScan.push(filePath);
      }
    } catch {
      filesToScan.push(filePath);
    }
  }

  if (filesToScan.length > 0) {
    logger.info(`Scanning ${filesToScan.length} files (cached ${tracks.length})...`);
    // Process files with bounded concurrency (16 at a time)
    const CONCURRENCY = 16;
    for (let i = 0; i < filesToScan.length; i += CONCURRENCY) {
      const batch = filesToScan.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(batch.map((f) => scanFile(f)));

      for (let j = 0; j < results.length; j++) {
        const result = results[j];
        if (result.status === 'fulfilled') {
          tracks.push(result.value);
        } else {
          const filePath = batch[j];
          const errorMessage = result.reason instanceof Error ? result.reason.message : String(result.reason);
          logger.warn(`Failed to scan file: ${filePath}`, { error: errorMessage });
          errors.push({ filePath, error: errorMessage });
        }
      }
    }
    saveCache(tracks);
  } else {
    logger.info(`All ${tracks.length} tracks loaded from cache instantly!`);
  }

  const durationMs = Date.now() - startTime;
  logger.info(
    `Library scan complete: ${tracks.length} valid tracks, ${errors.length} errors in ${durationMs}ms`
  );

  return {
    tracks,
    errors,
    scannedFiles: files.length,
    durationMs,
  };
}

/**
 * Scans a single file and returns a Track or null on failure.
 * Used by the file watcher when a new file is detected.
 */
export async function scanSingleFile(filePath: string): Promise<Track | null> {
  const ext = path.extname(filePath).toLowerCase();
  if (!AUDIO_EXTENSIONS.has(ext)) return null;

  try {
    const track = await scanFile(filePath);
    logger.info(`Scanned new file: ${track.fileName}`);
    return track;
  } catch (err) {
    logger.error(`Failed to scan file: ${filePath}`, { error: (err as Error).message });
    return null;
  }
}
