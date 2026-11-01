import { NowPlayingHero } from '@/components/NowPlaying/NowPlayingHero';
import RecentlyPlayed from '@/components/History/RecentlyPlayed';
import AboutSection from '@/components/About/AboutSection';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero — música atual */}
      <NowPlayingHero />

      {/* Histórico */}
      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-gdm-text font-semibold text-lg mb-4">
          Tocadas recentemente
        </h2>
        <RecentlyPlayed />
      </section>

      {/* Sobre */}
      <AboutSection compact />
    </div>
  );
}
