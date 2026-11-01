import { useOutletContext } from 'react-router-dom';
import { RedesignedHero } from '@/components/Home/RedesignedHero';
import { RedesignedMasterPlayer } from '@/components/Home/RedesignedMasterPlayer';
import { FeatureHighlightRow } from '@/components/Home/FeatureHighlightRow';
import { LowerActionCards } from '@/components/Home/LowerActionCards';
import { DailyVerseCard } from '@/components/Spiritual/DailyVerseCard';
import RecentlyPlayed from '@/components/History/RecentlyPlayed';
import { SEO } from '@/components/Common/SEO';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface LayoutContext {
  isImmersive?: boolean;
  toggleImmersive?: () => void;
  exitImmersive?: () => void;
  isTVMode?: boolean;
}

export default function HomePage() {
  const ctx = useOutletContext<LayoutContext | null>() ?? {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10 lg:space-y-12">
      <SEO />

      {/* 1. Hero Section */}
      <RedesignedHero onToggleImmersive={ctx.toggleImmersive} />

      {/* 2. Player Principal Central */}
      <RedesignedMasterPlayer />

      {/* 3. Feature highlights */}
      <FeatureHighlightRow />

      {/* 4. Action Cards */}
      <LowerActionCards />

      {/* 5. Palavra Diária */}
      <DailyVerseCard />

      {/* 6. Tocadas Recentemente */}
      <section aria-labelledby="recent-heading" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1C223A]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FFC928]" />
            <h2 id="recent-heading" className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Tocadas Recentemente na Rádio
            </h2>
          </div>
          <Link
            to="/programacao"
            className="text-xs text-[#9B4DFF] hover:text-white transition-colors font-bold"
          >
            Ver catálogo completo (402 louvores) →
          </Link>
        </div>
        <RecentlyPlayed limit={8} />
      </section>
    </div>
  );
}
