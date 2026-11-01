import { useState, useEffect, useCallback } from 'react';

// Detect if user agent indicates a Smart TV, Android TV, Google TV, Apple TV, or console
export function detectSmartTV(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes('smart-tv') ||
    ua.includes('smarttv') ||
    ua.includes('googletv') ||
    ua.includes('android tv') ||
    ua.includes('appletv') ||
    ua.includes('tizen') ||
    ua.includes('webos') ||
    ua.includes('hbbtv') ||
    ua.includes('netcast') ||
    ua.includes('viera') ||
    ua.includes('bravia') ||
    ua.includes('playstation') ||
    ua.includes('xbox') ||
    window.location.search.includes('tv=1')
  );
}

const TV_STORAGE_KEY = 'gdm_tv_mode_active';

export function useTVNavigation() {
  const [isTVMode, setIsTVMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(TV_STORAGE_KEY);
      if (stored !== null) return stored === 'true';
      return detectSmartTV();
    } catch {
      return detectSmartTV();
    }
  });

  const toggleTVMode = useCallback(() => {
    setIsTVMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(TV_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Set class on document body when TV mode is active for global high-contrast styling and safe margins
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isTVMode) {
      document.body.classList.add('tv-mode');
    } else {
      document.body.classList.remove('tv-mode');
    }
  }, [isTVMode]);

  // Handle D-Pad (Arrow keys, Enter, Back) spatial navigation across focusable elements
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getFocusableElements = (): HTMLElement[] => {
      const selector =
        'button:not([disabled]):not([aria-hidden="true"]), ' +
        'a[href]:not([aria-hidden="true"]), ' +
        'input:not([disabled]):not([type="hidden"]), ' +
        'select:not([disabled]), ' +
        'textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])';
      return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => el.offsetParent !== null && window.getComputedStyle(el).visibility !== 'hidden',
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Auto-enable TV mode if user uses D-Pad/remote on large screen
      if (!isTVMode && (e.key === 'ArrowUp' || e.key === 'ArrowDown') && window.innerWidth >= 1280) {
        setIsTVMode(true);
      }

      const activeEl = document.activeElement as HTMLElement | null;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable);

      if (isInputFocused && e.key !== 'Escape') {
        return;
      }

      const focusables = getFocusableElements();
      if (focusables.length === 0) return;

      const currentIndex = activeEl ? focusables.indexOf(activeEl) : -1;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentIndex === -1 || currentIndex >= focusables.length - 1 ? 0 : currentIndex + 1;
        const target = focusables[nextIndex];
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
        const target = focusables[prevIndex];
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
      } else if (e.key === 'Escape' || e.key === 'GoBack' || e.key === 'Back') {
        // Return focus to main play button if trapped
        const playBtn = document.querySelector<HTMLElement>('button[aria-label*="transmissão"], button[aria-label*="Ouvir"]');
        if (playBtn) {
          playBtn.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTVMode]);

  return { isTVMode, toggleTVMode };
}

