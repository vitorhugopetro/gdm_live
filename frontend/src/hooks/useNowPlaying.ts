import { useEffect, useRef, useCallback } from 'react';
import { api } from '@/services/api';
import { useRadioStore } from '@/store/radioStore';
import type { NowPlaying, PlaybackHistory, BroadcastBanner } from '@/types';

const POLL_INTERVAL_MS = 15_000;

export function useNowPlaying() {
  const { setNowPlaying, setHistory, setBanner } = useRadioStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const [nowRes, histRes, bannerRes] = await Promise.allSettled([
        api.get<{ data: NowPlaying }>('/api/now-playing'),
        api.get<{ data: PlaybackHistory[] }>('/api/history?limit=10'),
        api.get<{ data: BroadcastBanner }>('/api/banner'),
      ]);

      if (nowRes.status === 'fulfilled' && nowRes.value.data) {
        const payload = nowRes.value.data;
        const nowPlaying: NowPlaying =
          (payload as { data?: NowPlaying }).data ?? (payload as unknown as NowPlaying);
        if (nowPlaying?.track) {
          if (nowPlaying.track.coverArtDataUrl && !nowPlaying.track.coverArt) {
            nowPlaying.track.coverArt = nowPlaying.track.coverArtDataUrl;
          }
          setNowPlaying(nowPlaying);
          if (nowPlaying?.streamUrl) {
            useRadioStore.getState().setStreamUrl(nowPlaying.streamUrl);
          }
        }
      }
      // If nowRes fails, do NOT set nowPlaying to null: keep existing active track from webPlaylist!

      if (histRes.status === 'fulfilled' && histRes.value.data) {
        const payload = histRes.value.data;
        const history: PlaybackHistory[] =
          (payload as { data?: PlaybackHistory[] }).data ?? (payload as unknown as PlaybackHistory[]);
        if (Array.isArray(history) && history.length > 0) {
          setHistory(history);
        }
      }

      if (bannerRes.status === 'fulfilled' && bannerRes.value.data) {
        const payload = bannerRes.value.data;
        const banner: BroadcastBanner =
          (payload as { data?: BroadcastBanner }).data ?? (payload as unknown as BroadcastBanner);
        if (banner?.active) {
          setBanner(banner);
        }
      }
    } catch {
      // Graceful offline fallback: preserve current player state
    }
  }, [setNowPlaying, setHistory, setBanner]);

  useEffect(() => {
    // Initial fetch
    void fetchNowPlaying();

    // Then poll
    timerRef.current = setInterval(() => {
      void fetchNowPlaying();
    }, POLL_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [fetchNowPlaying]);

  return { refresh: fetchNowPlaying };
}
