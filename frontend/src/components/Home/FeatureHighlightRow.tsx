import { Music, Heart, Headphones, Smartphone, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeatureHighlightRow() {
  const cards = [
    {
      icon: Music,
      title: 'Músicas Autorais',
      subtitle: 'Exclusivas da GDM',
      iconColor: 'text-[#FFC928]',
      to: '/programacao',
    },
    {
      icon: Heart,
      title: 'Mensagens de',
      subtitle: 'Esperança e Fé',
      iconColor: 'text-[#FFC928]',
      to: '/comunidade',
    },
    {
      icon: Headphones,
      title: 'Qualidade de Som',
      subtitle: 'Premium 128k',
      iconColor: 'text-[#FFC928]',
      to: '/sobre',
    },
    {
      icon: Smartphone,
      title: 'Ouça em Qualquer',
      subtitle: 'Dispositivo',
      iconColor: 'text-[#7000FF]',
      to: '/sobre',
    },
    {
      icon: Zap,
      title: 'Transmissão 24h',
      subtitle: 'Sem Interrupções',
      iconColor: 'text-[#FFC928]',
      to: '/programacao',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Link
            key={i}
            to={c.to}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0E1020]/90 to-[#07070D]/90 border border-[#1C223A] hover:border-[#7000FF]/60 hover:shadow-[0_4px_24px_rgba(112,0,255,0.3)] p-4 sm:p-5 flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Ícone com Fundo Suave */}
            <div className="p-2.5 rounded-xl bg-[#1C1635] border border-[#7000FF]/30 group-hover:bg-[#7000FF] group-hover:border-[#7000FF] transition-all flex-shrink-0">
              <Icon className={`w-5 h-5 ${c.iconColor} group-hover:text-white transition-colors`} />
            </div>

            {/* Texto */}
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FFC928] transition-colors leading-tight truncate">
                {c.title}
              </p>
              <p className="text-[11px] text-[#C9C9D4] truncate font-medium mt-0.5">
                {c.subtitle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
