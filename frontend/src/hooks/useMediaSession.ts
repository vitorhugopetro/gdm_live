import { useEffect } from 'react';
import { useRadioStore } from '@/store/radioStore';

const ARTWORK_SIZES = [96, 128, 192, 256, 512] as const;

function buildArtwork(coverArt?: string): MediaImage[] {
  if (!coverArt) return [];
  return ARTWORK_SIZES.map((size) => ({
    src: coverArt,
    sizes: `${size}x${size}`,
    type: 'image/jpeg',
  }));
}

export function useMediaSession() {
  const { nowPlaying, isPlayerPlaying, togglePlay } = useRadioStore();

  // Update metadata when track changes
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const track = nowPlaying?.track;
    if (track) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album ?? 'GDM Live Radio',
        artwork: buildArtwork(track.coverArt),
      });
    } else {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'GDM Live Radio',
        artist: 'Graça Digital — GDM',
        album: 'Ao Vivo',
        artwork: [],
      });
    }
  }, [nowPlaying]);

  // Update playback state
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlayerPlaying ? 'playing' : 'paused';
  }, [isPlayerPlaying]);

  // Register action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const handlePlay = () => {
      if (!isPlayerPlaying) togglePlay();
    };
    const handlePause = () => {
      if (isPlayerPlaying) togglePlay();
    };
    const handleStop = () => {
      if (isPlayerPlaying) togglePlay();
    };

    navigator.mediaSession.setActionHandler('play', handlePlay);
    navigator.mediaSession.setActionHandler('pause', handlePause);
    navigator.mediaSession.setActionHandler('stop', handleStop);

    // Live radio: disable seek actions
    try {
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    } catch {
      // Some browsers don't support all actions
    }

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('stop', null);
    };
  }, [isPlayerPlaying, togglePlay]);
}
