import { Outlet } from 'react-router-dom';
import Header from './Header';
import { AudioPlayer } from '@/components/Player/AudioPlayer';
import { useNowPlaying } from '@/hooks/useNowPlaying';

export default function Layout() {
  // Poll for now-playing data at root level so it updates across all pages
  useNowPlaying();

  return (
    <div className="min-h-screen bg-gdm-dark flex flex-col">
      <Header />

      {/* Main content - bottom padding accounts for persistent player */}
      <main className="flex-1 pb-28">
        <Outlet />
      </main>

      {/* Persistent bottom player (manages its own stream + media session) */}
      <AudioPlayer />
    </div>
  );
}
