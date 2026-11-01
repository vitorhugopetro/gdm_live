import { Outlet } from 'react-router-dom';
import Header from './Header';
import { BroadcastBannerBar } from '@/components/Common/BroadcastBannerBar';
import { RedesignedFooter } from './RedesignedFooter';
import { AudioPlayer } from '@/components/Player/AudioPlayer';
import { useNowPlaying } from '@/hooks/useNowPlaying';

export default function Layout() {
  // Poll for now-playing and banner data at root level
  useNowPlaying();

  return (
    <div className="min-h-screen bg-[#07070D] text-white flex flex-col font-sans selection:bg-[#7000FF] selection:text-white">
      <Header />
      <BroadcastBannerBar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Rodapé Oficial Estilizado */}
      <RedesignedFooter />

      {/* Barra de Player Persistente */}
      <AudioPlayer />
    </div>
  );
}
