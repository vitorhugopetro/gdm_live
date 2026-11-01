import { useEffect } from 'react';
import { useRadioStore } from '@/store/radioStore';
import { useRadioStream } from '@/hooks/useRadioStream';

interface ShortcutOptions {
  onToggleImmersive?: () => void;
  onToggleHelp?: () => void;
  onToggleTV?: () => void;
}

export function useKeyboardShortcuts(options?: ShortcutOptions) {
  const { isPlayerPlaying, playerVolume, togglePlay, setVolume, toggleMute } = useRadioStore();
  const { nextTrack, prevTrack } = useRadioStream();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable);

      if (isInputFocused) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;

        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;

        case 'KeyI':
          e.preventDefault();
          options?.onToggleImmersive?.();
          break;

        case 'KeyT':
          e.preventDefault();
          options?.onToggleTV?.();
          break;

        case 'Slash':
          if (e.shiftKey) {
            // '?' key
            e.preventDefault();
            options?.onToggleHelp?.();
          }
          break;

        case 'KeyN':
          e.preventDefault();
          nextTrack();
          break;

        case 'KeyP':
          e.preventDefault();
          prevTrack();
          break;

        case 'ArrowUp':
          if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            setVolume(Math.min(1, playerVolume + 0.05));
          }
          break;

        case 'ArrowDown':
          if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            setVolume(Math.max(0, playerVolume - 0.05));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayerPlaying, playerVolume, togglePlay, setVolume, toggleMute, nextTrack, prevTrack, options]);
}

