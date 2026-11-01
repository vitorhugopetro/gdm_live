import { useEffect, useCallback } from 'react';
import { useRadioStore } from '@/store/radioStore';
import { GDM_WEB_PLAYLIST } from '@/config/webPlaylist';
import type { NowPlaying } from '@/types';

// Global singleton audio element so playback is continuous across all routes & components
let globalAudio: HTMLAudioElement | null = null;

export function getGlobalAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!globalAudio) {
    globalAudio = new Audio();
    globalAudio.preload = 'auto';
  }
  return globalAudio;
}

function createTrackMetadata(track: typeof GDM_WEB_PLAYLIST[0]): NowPlaying {
  return {
    track: {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: 300,
      coverArt: track.coverUrl,
      coverArtDataUrl: track.coverUrl,
      fileName: track.id,
      fileSize: 5000000,
      format: 'mp3',
    },
    startedAt: new Date().toISOString(),
    elapsed: 0,
    listenerCount: 142,
    streamUrl: track.url,
  };
}

export function useRadioStream() {
  const {
    isPlayerPlaying,
    playerVolume,
    playerMuted,
    connectionState,
    currentPlaylistIndex,
    setConnectionState,
    setIsPlaying,
    setNowPlaying,
    setCurrentPlaylistIndex,
    sleepTimerEndsAt,
    setSleepTimer,
  } = useRadioStore();

  // Sleep Timer Watcher
  useEffect(() => {
    if (!sleepTimerEndsAt) return;

    const timer = setInterval(() => {
      if (Date.now() >= sleepTimerEndsAt) {
        setIsPlaying(false);
        setSleepTimer(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerEndsAt, setIsPlaying, setSleepTimer]);

  // Sync volume / mute with global audio singleton
  useEffect(() => {
    const audio = getGlobalAudio();
    if (!audio) return;
    audio.volume = playerMuted ? 0 : playerVolume;
  }, [playerVolume, playerMuted]);

  // Network online/offline recovery
  useEffect(() => {
    const handleOnline = () => {
      // If we were in error/offline state, retry playback automatically
      if (connectionState === 'offline' || connectionState === 'error') {
        const audio = getGlobalAudio();
        if (audio && isPlayerPlaying) {
          audio.play().then(() => setConnectionState('playing')).catch(() => {});
        }
      }
    };
    const handleOffline = () => {
      setConnectionState('offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connectionState, isPlayerPlaying, setConnectionState]);

  // Play specific track index
  const playTrackIndex = useCallback(
    (index: number) => {
      const audio = getGlobalAudio();
      if (!audio) return;

      const validIndex = (index + GDM_WEB_PLAYLIST.length) % GDM_WEB_PLAYLIST.length;
      const track = GDM_WEB_PLAYLIST[validIndex];
      if (!track) return;

      setCurrentPlaylistIndex(validIndex);
      setNowPlaying(createTrackMetadata(track));

      const isSameSrc = audio.src && audio.src.endsWith(track.url);
      if (!isSameSrc) {
        audio.src = track.url;
      }
      audio.volume = playerMuted ? 0 : playerVolume;
      setConnectionState('loading');

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setConnectionState('playing');
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('[Audio Engine] Playback promise error:', err);
            // In case autoplay is restricted before user gesture
            setConnectionState('paused');
            setIsPlaying(false);
          });
      }
    },
    [
      playerMuted,
      playerVolume,
      setConnectionState,
      setCurrentPlaylistIndex,
      setIsPlaying,
      setNowPlaying,
    ],
  );

  // Next Track
  const nextTrack = useCallback(() => {
    const nextIdx = (currentPlaylistIndex + 1) % GDM_WEB_PLAYLIST.length;
    playTrackIndex(nextIdx);
  }, [currentPlaylistIndex, playTrackIndex]);

  // Previous Track
  const prevTrack = useCallback(() => {
    const audio = getGlobalAudio();
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }
    const prevIdx = (currentPlaylistIndex - 1 + GDM_WEB_PLAYLIST.length) % GDM_WEB_PLAYLIST.length;
    playTrackIndex(prevIdx);
  }, [currentPlaylistIndex, playTrackIndex]);

  // Shuffle Track
  const shuffleTrack = useCallback(() => {
    if (GDM_WEB_PLAYLIST.length <= 1) {
      playTrackIndex(0);
      return;
    }
    let randIdx = currentPlaylistIndex;
    while (randIdx === currentPlaylistIndex) {
      randIdx = Math.floor(Math.random() * GDM_WEB_PLAYLIST.length);
    }
    playTrackIndex(randIdx);
  }, [currentPlaylistIndex, playTrackIndex]);

  // Audio Event Listeners (Ended, Error, Playing, Waiting)
  useEffect(() => {
    const audio = getGlobalAudio();
    if (!audio) return;

    const onEnded = () => {
      // Loop to next track continuously
      const nextIdx = (useRadioStore.getState().currentPlaylistIndex + 1) % GDM_WEB_PLAYLIST.length;
      playTrackIndex(nextIdx);
    };

    const onError = () => {
      // On error, skip to next track
      const nextIdx = (useRadioStore.getState().currentPlaylistIndex + 1) % GDM_WEB_PLAYLIST.length;
      playTrackIndex(nextIdx);
    };

    const onPlaying = () => {
      setConnectionState('playing');
    };

    const onWaiting = () => {
      if (useRadioStore.getState().connectionState !== 'loading') {
        setConnectionState('loading');
      }
    };

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
    };
  }, [playTrackIndex, setConnectionState]);

  // React to isPlayerPlaying state changes
  useEffect(() => {
    const audio = getGlobalAudio();
    if (!audio) return;

    if (isPlayerPlaying) {
      if (!audio.src || audio.src === '' || audio.src.endsWith('/stream')) {
        playTrackIndex(currentPlaylistIndex);
      } else {
        setConnectionState('loading');
        audio
          .play()
          .then(() => {
            setConnectionState('playing');
          })
          .catch(() => {
            playTrackIndex(currentPlaylistIndex);
          });
      }
    } else {
      audio.pause();
      setConnectionState('paused');
    }
  }, [isPlayerPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // System Media Session API
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    const currentTrack = GDM_WEB_PLAYLIST[currentPlaylistIndex];
    if (currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: [
          { src: '/images/player-album-art.jpg', sizes: '96x96', type: 'image/jpeg' },
          { src: '/images/player-album-art.jpg', sizes: '256x256', type: 'image/jpeg' },
        ],
      });
    }

    navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());

    return () => {
      try {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      } catch {
        // ignore
      }
    };
  }, [currentPlaylistIndex, nextTrack, prevTrack, setIsPlaying]);

  const retry = useCallback(() => {
    playTrackIndex(currentPlaylistIndex);
  }, [currentPlaylistIndex, playTrackIndex]);

  return { retry, nextTrack, prevTrack, shuffleTrack, playTrackIndex };
}
