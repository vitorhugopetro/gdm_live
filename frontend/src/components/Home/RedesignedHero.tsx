import { Play, Pause, Radio, Sparkles } from 'lucide-react';
import { useRadioStore } from '@/store/radioStore';
import { useRadioStream } from '@/hooks/useRadioStream';

export function RedesignedHero() {
  const { isPlayerPlaying, connectionState, togglePlay } = useRadioStore();
  const { retry } = useRadioStream();

  const isLive = connectionState === 'playing';
  const isConnecting = connectionState === 'connecting' || connectionState === 'loading';
  const isError = connectionState === 'offline' || connectionState === 'error';

  const handlePlayAction = () => {
    if (isError) {
      retry();
      return;
    }
    togglePlay();
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B0B16] via-[#07070D] to-[#120B24] border border-[#1C223A] shadow-2xl p-6 sm:p-10 lg:p-14">
      {/* Luz e Gradientes Atmosféricos de Fundo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#7000FF]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-[32rem] h-[32rem] rounded-full bg-[#FFC928]/10 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-[#7000FF]/15 blur-[100px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Coluna Esquerda: Mensagem Institucional + Chamada Principal */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          {/* Tag de Transmissão */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1020] border border-[#1C223A] shadow-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-[#10B981] animate-ping' : 'bg-[#FFC928]'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9C9D4]">
              {isLive ? 'Transmissão Ao Vivo' : 'Rádio 24 Horas'}
            </span>
            <span className="text-xs text-[#7A839E] hidden sm:inline">• 402 Louvores</span>
          </div>

          {/* Título & Headline Inspiracional */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
              GDM Live Radio
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FFC928] leading-snug drop-shadow-[0_2px_12px_rgba(255,201,40,0.3)]">
              A rádio cristã que toca sua fé o tempo todo!
            </p>
          </div>

          {/* Descrição */}
          <p className="text-sm sm:text-base text-[#C9C9D4] leading-relaxed max-w-xl mx-auto lg:mx-0">
            Músicas autorais da <strong>Graça Digital (GDM)</strong>, criadas com fé, criatividade e propósito para levar esperança e renovação até o seu coração.
          </p>

          {/* Botões de Destaque: Ouvir Agora + Pulso Ao Vivo */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button
              onClick={handlePlayAction}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#181105] via-[#2E2003] to-[#181105] hover:from-[#3D2B05] hover:to-[#2E2003] text-[#FFC928] border-2 border-[#FFC928] shadow-[0_0_24px_rgba(255,201,40,0.45)] hover:shadow-[0_0_36px_rgba(255,201,40,0.7)] text-base font-bold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {isPlayerPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pausar Rádio</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                  <span>{isConnecting ? 'Conectando...' : 'Ouvir Agora'}</span>
                </>
              )}
            </button>

            {/* Pulso Indicador de Frequência */}
            <div className="flex items-center gap-2 px-4 py-3.5 rounded-full bg-[#0E1020]/90 border border-[#1C223A] text-xs font-semibold text-[#C9C9D4]">
              <Radio className={`w-4 h-4 ${isLive ? 'text-[#10B981] animate-pulse' : 'text-[#7000FF]'}`} />
              <span className="hidden sm:inline">Stream Contínuo</span>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Emblema Celestial 3D + Adorador na Colina + Cruz Luminosa */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
          {/* Círculo de Brilho Divino de Fundo */}
          <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center">
            {/* Anéis de Luz Celestial */}
            <div className="absolute inset-0 rounded-full border border-[#7000FF]/30 animate-pulse-slow" />
            <div className="absolute inset-8 rounded-full border border-[#FFC928]/25" />
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-[#7000FF]/25 via-[#FFC928]/20 to-transparent blur-3xl" />

            {/* Cena Ilustrada em SVG: Montanha, Cruz Radiante e Adorador */}
            <svg
              viewBox="0 0 500 360"
              className="w-full h-full drop-shadow-[0_0_40px_rgba(255,201,40,0.5)] select-none pointer-events-none"
            >
              <defs>
                <linearGradient id="hero-gold-play" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFF7D6" />
                  <stop offset="30%" stopColor="#FFC928" />
                  <stop offset="75%" stopColor="#D49A00" />
                  <stop offset="100%" stopColor="#805C00" />
                </linearGradient>

                <radialGradient id="cross-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.9" />
                  <stop offset="30%" stopColor="#FFC928" stopOpacity="0.6" />
                  <stop offset="70%" stopColor="#7000FF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Raios de Luz Dourada ao Fundo da Cruz */}
              <circle cx="410" cy="140" r="90" fill="url(#cross-glow)" />
              <line x1="410" y1="50" x2="410" y2="230" stroke="#FFE58F" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="320" y1="140" x2="500" y2="140" stroke="#FFE58F" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="346" y1="76" x2="474" y2="204" stroke="#FFE58F" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="346" y1="204" x2="474" y2="76" stroke="#FFE58F" strokeWidth="1" strokeOpacity="0.3" />

              {/* Silhueta da Colina ao Fundo */}
              <path
                d="M 280 280 Q 360 220, 410 215 Q 460 215, 500 250 L 500 360 L 280 360 Z"
                fill="#0E1020"
                opacity="0.95"
              />

              {/* Cruz Iluminada na Colina */}
              <g transform="translate(406, 110)">
                <rect x="2" y="0" width="4" height="48" rx="2" fill="#FFE58F" filter="drop-shadow(0 0 8px #FFC928)" />
                <rect x="-10" y="12" width="28" height="4" rx="2" fill="#FFE58F" filter="drop-shadow(0 0 8px #FFC928)" />
              </g>

              {/* Silhueta do Adorador de Braços Abertos */}
              <g transform="translate(345, 175) scale(0.9)" fill="#07070D" stroke="#0B0B16" strokeWidth="0.5">
                {/* Cabeça */}
                <circle cx="20" cy="10" r="5.5" />
                {/* Tronco */}
                <path d="M 16 16 L 24 16 L 23 48 L 17 48 Z" />
                {/* Braço Esquerdo Erguido em Adoração */}
                <path d="M 16 19 L 0 5 L 2 2 L 18 16 Z" />
                {/* Braço Direito Erguido em Adoração */}
                <path d="M 24 19 L 40 5 L 38 2 L 22 16 Z" />
                {/* Pernas */}
                <path d="M 17 48 L 12 75 L 16 76 L 19 48 Z" />
                <path d="M 23 48 L 28 75 L 24 76 L 21 48 Z" />
              </g>

              {/* Ondas Sonoras Esquerda do Emblema */}
              <g transform="translate(30, 95)">
                <rect x="0" y="32" width="5" height="24" rx="2.5" fill="#FFC928" />
                <rect x="10" y="18" width="5" height="52" rx="2.5" fill="#FFC928" />
                <rect x="20" y="4" width="5" height="80" rx="2.5" fill="#FFC928" />

                {/* Triângulo Play Dourado 3D */}
                <path
                  d="M 36 6 C 36 1, 43 -2, 48 1 L 115 42 C 120 45, 120 53, 115 56 L 48 97 C 43 100, 36 97, 36 92 Z"
                  fill="url(#hero-gold-play)"
                  stroke="#FFE58F"
                  strokeWidth="2.5"
                />

                {/* Cruz Branca Luminosa no Centro do Play */}
                <rect x="62" y="24" width="6.5" height="50" rx="3" fill="#FFFFFF" />
                <rect x="50" y="38" width="30.5" height="6.5" rx="3" fill="#FFFFFF" />
              </g>
            </svg>

            {/* Texto de Marca Oficial sobreposto com tipografia idêntica ao mockup */}
            <div className="absolute -bottom-2 left-6 right-6 flex flex-col items-start z-20">
              <div className="flex items-baseline gap-2">
                <span className="font-black text-2xl sm:text-3xl text-white tracking-wide drop-shadow-lg">
                  GDM <span className="text-[#FFC928]">LIVE RADIO</span>
                </span>
                <span className="text-sm font-semibold text-[#FFC928] italic font-serif">
                  Graça Digital!
                </span>
              </div>

              {/* Tagline Oficial Espaçada */}
              <div className="mt-1 text-xs font-black tracking-[0.35em] uppercase text-[#FFC928] flex items-center gap-2">
                <span>FÉ</span>
                <span className="text-[#7000FF]">•</span>
                <span>MÚSICA</span>
                <span className="text-[#7000FF]">•</span>
                <span>PROPÓSITO</span>
              </div>
            </div>
          </div>

          {/* Caligrafia Cursiva Inspiracional posicionada exatamente como no mockup */}
          <div className="mt-4 text-center lg:text-right w-full pr-4">
            <p className="font-serif italic text-lg sm:text-xl text-[#FFE58F] drop-shadow-[0_2px_8px_rgba(255,201,40,0.4)]">
              "Conectando você a Deus através da música!"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

