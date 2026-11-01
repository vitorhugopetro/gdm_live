import AboutSection from '@/components/About/AboutSection';
import { ContributionCard } from '@/components/Common/ContributionCard';
import { SEO } from '@/components/Common/SEO';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <SEO
        title="Sobre a Rádio & Graça Digital"
        description="Conheça a história e o propósito da Graça Digital (GDM), uma produção independente feita com fé para propagar louvores autorais e a mensagem de Cristo."
        image="https://gdmlr.web.app/images/card-bible-realistic.jpg"
      />
      <div>
        <h1 className="text-white text-3xl font-extrabold mb-8 tracking-tight">Sobre a GDM Live Radio</h1>
        <AboutSection />
      </div>

      {/* Seção Harmoniosa de Contribuição */}
      <ContributionCard />
    </div>
  );
}
