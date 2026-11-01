interface GdmBrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function GdmBrandLogo({ className = '', size = 'md' }: GdmBrandLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-7',
    md: 'w-10 h-8',
    lg: 'w-14 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Símbolo Oficial: Ondas Sonoras + Triângulo Dourado com Cruz Branca */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${iconSizes[size]} drop-shadow-[0_0_12px_rgba(255,201,40,0.5)]`}>
        <svg viewBox="0 0 100 80" className="w-full h-full fill-none">
          {/* Ondas Sonoras Verticais em Dourado */}
          <rect x="6" y="32" width="3.5" height="16" rx="1.75" fill="#FFC928" />
          <rect x="13" y="22" width="3.5" height="36" rx="1.75" fill="#FFC928" />
          <rect x="20" y="12" width="3.5" height="56" rx="1.75" fill="#FFC928" />

          {/* Triângulo Play 3D em Degradê Ouro Metálico */}
          <path
            d="M32 14 C32 10, 37 7.5, 41 9.8 L86 36.8 C90 39.2, 90 44.8, 86 47.2 L41 74.2 C37 76.5, 32 74, 32 70 Z"
            fill="url(#gold-play-gradient)"
            stroke="#FFE58F"
            strokeWidth="1.8"
          />

          {/* Cruz Sagrada Central em Branco Puro */}
          <rect x="49" y="24" width="4.5" height="34" rx="2" fill="#FFFFFF" />
          <rect x="41" y="33" width="20.5" height="4.5" rx="2" fill="#FFFFFF" />

          {/* Definições de Gradiente Ouro Metálico */}
          <defs>
            <linearGradient id="gold-play-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="35%" stopColor="#FFC928" />
              <stop offset="80%" stopColor="#D49A00" />
              <stop offset="100%" stopColor="#8A6300" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Tipografia da Marca */}
      <div className="flex flex-col justify-center">
        <div className={`font-black tracking-tight leading-none text-white ${textSizes[size]} flex items-center gap-1.5`}>
          <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">GDM</span>
          <span className="text-[#FFC928] drop-shadow-[0_0_8px_rgba(255,201,40,0.4)]">LIVE RADIO</span>
        </div>
        <div className="text-[10px] md:text-xs text-[#C9C9D4] font-medium tracking-wider uppercase mt-0.5">
          Graça Digital
        </div>
      </div>
    </div>
  );
}
