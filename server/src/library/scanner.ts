import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as mm from 'music-metadata';
import { config } from '../config';
import { logger } from '../config/logger';
import type { Track, ScanResult, ScanError } from '../types';

// Supported audio extensions
const AUDIO_EXTENSIONS = new Set(['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac']);

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
  logger.info(`Found ${files.length} audio files, reading metadata...`);

  // Process files with bounded concurrency (16 at a time)
  const CONCURRENCY = 16;
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
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

    if (i % (CONCURRENCY * 4) === 0 && i > 0) {
      logger.info(`Scanned ${Math.min(i + CONCURRENCY, files.length)}/${files.length} files...`);
    }
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
