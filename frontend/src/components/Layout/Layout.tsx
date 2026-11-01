import { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { BroadcastBannerBar } from '@/components/Common/BroadcastBannerBar';
import { RedesignedFooter } from './RedesignedFooter';
import { AudioPlayer } from '@/components/Player/AudioPlayer';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { useTVNavigation } from '@/hooks/useTVNavigation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { HelpModal } from '@/components/Common/HelpModal';

export default function Layout() {
  // Poll for now-playing and banner data at root level
  useNowPlaying();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // TV mode & D-pad spatial navigation
  const { isTVMode, toggleTVMode } = useTVNavigation();

  // Immersive mode state (fullscreen player, hides header/footer)
  const [isImmersive, setIsImmersive] = useState(false);
  const toggleImmersive = useCallback(() => setIsImmersive((v) => !v), []);
  const exitImmersive = useCallback(() => setIsImmersive(false), []);

  // Help modal state
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const toggleHelp = useCallback(() => setIsHelpOpen((v) => !v), []);

  // Global keyboard shortcuts
  useKeyboardShortcuts({
    onToggleImmersive: toggleImmersive,
    onToggleHelp: toggleHelp,
    onToggleTV: toggleTVMode,
  });

  return (
    <div
      className={`min-h-screen bg-[#07070D] text-white flex flex-col font-sans selection:bg-[#7000FF] selection:text-white${isImmersive ? ' immersive-mode' : ''}`}
    >
      {/* Accessibility: Skip to main content */}
      <a href="#main-content" className="skip-to-content">
        Pular para o conteúdo
      </a>

      <Header isTVMode={isTVMode} onToggleTVMode={toggleTVMode} onToggleHelp={toggleHelp} />
      <div data-broadcast-banner>
        <BroadcastBannerBar />
      </div>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        <Outlet context={{ isImmersive, toggleImmersive, exitImmersive, isTVMode }} />
      </main>

      {/* Rodapé Oficial Estilizado */}
      <RedesignedFooter />

      {/* Barra de Player Persistente apenas em páginas secundárias */}
      {!isHomePage && (
        <div data-audio-player>
          <AudioPlayer />
        </div>
      )}

      {/* Help Modal (? key or ? button) */}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}

      {/* TV Mode indicator badge */}
      {isTVMode && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-[#FFC928] text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          <span>📺</span>
          <span>Modo TV</span>
          <button
            onClick={toggleTVMode}
            className="ml-1 hover:opacity-70 transition-opacity"
            aria-label="Desativar modo TV"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
