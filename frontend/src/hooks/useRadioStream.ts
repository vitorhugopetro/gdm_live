import { useEffect, useRef, useCallback } from 'react';
import { useRadioStore } from '@/store/radioStore';

const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 2000;

export function useRadioStream() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  const {
    isPlayerPlaying,
    playerVolume,
    playerMuted,
    streamUrl,
    connectionState,
    setConnectionState,
    setIsPlaying,
    setReconnectAttempt,
  } = useRadioStore();

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Sync volume / mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = playerMuted ? 0 : playerVolume;
  }, [playerVolume, playerMuted]);

  const stopAndClear = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = '';
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    retryCountRef.current = 0;
    setReconnectAttempt(0);
  }, [setReconnectAttempt]);

  const connectStream = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // For live radio: re-set src to force reload from live edge
    audio.src = '';
    audio.src = streamUrl;
    audio.volume = playerMuted ? 0 : playerVolume;
    audio.load();

    setConnectionState('connecting');

    const onCanPlay = () => {
      setConnectionState('loading');
      audio.play().catch(() => {
        setConnectionState('error');
        setIsPlaying(false);
      });
    };

    const onPlaying = () => {
      setConnectionState('playing');
      retryCountRef.current = 0;
      setReconnectAttempt(0);
    };

    const onWaiting = () => {
      if (connectionState !== 'reconnecting') {
        setConnectionState('loading');
      }
    };

    const onError = () => {
      const attempt = retryCountRef.current;

      if (attempt >= MAX_RETRIES) {
        setConnectionState('offline');
        setIsPlaying(false);
        stopAndClear();
        return;
      }

      retryCountRef.current = attempt + 1;
      setReconnectAttempt(attempt + 1);
      setConnectionState('reconnecting');

      const delay = BASE_BACKOFF_MS * Math.pow(2, attempt);
      retryTimerRef.current = setTimeout(() => {
        connectStream();
      }, delay);
    };

    const onEnded = () => {
      // Live streams shouldn't "end" — treat as error
      onError();
    };

    // Attach listeners (remove old ones first)
    audio.removeEventListener('canplay', onCanPlay);
    audio.removeEventListener('playing', onPlaying);
    audio.removeEventListener('waiting', onWaiting);
    audio.removeEventListener('error', onError);
    audio.removeEventListener('ended', onEnded);

    audio.addEventListener('canplay', onCanPlay, { once: true });
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);
  }, [
    streamUrl,
    playerVolume,
    playerMuted,
    connectionState,
    setConnectionState,
    setIsPlaying,
    setReconnectAttempt,
    stopAndClear,
  ]);

  // React to play/pause intent
  useEffect(() => {
    if (isPlayerPlaying) {
      connectStream();
    } else {
      stopAndClear();
      setConnectionState('paused');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerPlaying]);

  const retry = useCallback(() => {
    retryCountRef.current = 0;
    setReconnectAttempt(0);
    setIsPlaying(true);
  }, [setReconnectAttempt, setIsPlaying]);

  return { retry };
}
