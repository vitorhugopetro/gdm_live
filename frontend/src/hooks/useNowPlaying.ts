import { useEffect, useRef, useCallback } from 'react';
import { api } from '@/services/api';
import { useRadioStore } from '@/store/radioStore';
import type { NowPlaying, PlaybackHistory } from '@/types';

const POLL_INTERVAL_MS = 10_000;

export function useNowPlaying() {
  const { setNowPlaying, setHistory } = useRadioStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const [nowRes, histRes] = await Promise.allSettled([
        api.get<{ data: NowPlaying }>('/api/now-playing'),
        api.get<{ data: PlaybackHistory[] }>('/api/history?limit=10'),
      ]);

      if (nowRes.status === 'fulfilled') {
        const payload = nowRes.value.data;
        // Support both { data: ... } wrapper and direct response
        const nowPlaying: NowPlaying =
          (payload as { data?: NowPlaying }).data ?? (payload as unknown as NowPlaying);
        if (nowPlaying?.track && nowPlaying.track.coverArtDataUrl && !nowPlaying.track.coverArt) {
          nowPlaying.track.coverArt = nowPlaying.track.coverArtDataUrl;
        }
        setNowPlaying(nowPlaying);
      } else {
        // API unavailable — clear now playing so UI shows unavailable state
        setNowPlaying(null);
      }

      if (histRes.status === 'fulfilled') {
        const payload = histRes.value.data;
        const history: PlaybackHistory[] =
          (payload as { data?: PlaybackHistory[] }).data ?? (payload as unknown as PlaybackHistory[]);
        setHistory(Array.isArray(history) ? history : []);
      }
    } catch {
      setNowPlaying(null);
    }
  }, [setNowPlaying, setHistory]);

  useEffect(() => {
    // Initial fetch immediately
    void fetchNowPlaying();

    // Then poll
    timerRef.current = setInterval(() => {
      void fetchNowPlaying();
    }, POLL_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchNowPlaying]);

  return { refetch: fetchNowPlaying };
}
