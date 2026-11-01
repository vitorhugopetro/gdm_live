import { RedesignedHero } from '@/components/Home/RedesignedHero';
import { RedesignedMasterPlayer } from '@/components/Home/RedesignedMasterPlayer';
import { FeatureHighlightRow } from '@/components/Home/FeatureHighlightRow';
import { LowerActionCards } from '@/components/Home/LowerActionCards';
import { DailyVerseCard } from '@/components/Spiritual/DailyVerseCard';
import RecentlyPlayed from '@/components/History/RecentlyPlayed';
import { SEO } from '@/components/Common/SEO';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10 sm:space-y-12">
      <SEO />
      {/* 1. Hero Section: Marca, Mensagem, Ouvir Agora, Emblema Dourado com Cruz e Fé • Música • Propósito */}
      <RedesignedHero />

      {/* 2. Player Principal Central: Imersivo, controles reais, volume roxo, agora tocando */}
      <RedesignedMasterPlayer />

      {/* 3. Linha de 5 Cards de Destaque: Músicas Autorais, Mensagens de Fé, Som Premium, Em Qualquer Dispositivo, Transmissão 24h */}
      <FeatureHighlightRow />

      {/* 4. 3 Cards de Ação Inferiores: Programação com Spectrum Ao Vivo, Sobre a GDM com Bíblia Aberta, Faça Seu Pedido com Fones */}
      <LowerActionCards />

      {/* 5. Palavra de Fé Diária: Inspiracional com Compartilhamento */}
      <DailyVerseCard />

      {/* 6. Histórico das Músicas Tocadas Recentemente */}
      <section aria-labelledby="recent-heading" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1C223A]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FFC928]" />
            <h2 id="recent-heading" className="text-xl font-bold text-white tracking-tight">
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
