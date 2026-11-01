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

        {/* Coluna Direita: Emblema Celestial 3D + Cruz Dourada + Adoração */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
          {/* Círculo de Brilho Divino de Fundo */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            {/* Anéis de Luz Celestial */}
            <div className="absolute inset-0 rounded-full border border-[#7000FF]/30 animate-pulse-slow" />
            <div className="absolute inset-8 rounded-full border border-[#FFC928]/25" />
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-[#7000FF]/20 via-[#FFC928]/15 to-transparent blur-2xl" />

            {/* Emblema Central Dourado com Cruz Luminosa */}
            <div className="relative z-10 flex flex-col items-center text-center p-6">
              <div className="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center drop-shadow-[0_0_35px_rgba(255,201,40,0.6)]">
                <svg viewBox="0 0 100 80" className="w-full h-full fill-none">
                  {/* Ondas Sonoras Esquerda */}
                  <rect x="6" y="32" width="3.5" height="16" rx="1.75" fill="#FFC928" />
                  <rect x="13" y="22" width="3.5" height="36" rx="1.75" fill="#FFC928" />
                  <rect x="20" y="12" width="3.5" height="56" rx="1.75" fill="#FFC928" />

                  {/* Triângulo Play 3D */}
                  <path
                    d="M32 14 C32 10, 37 7.5, 41 9.8 L86 36.8 C90 39.2, 90 44.8, 86 47.2 L41 74.2 C37 76.5, 32 74, 32 70 Z"
                    fill="url(#hero-gold-play)"
                    stroke="#FFE58F"
                    strokeWidth="2"
                  />

                  {/* Cruz Central Luminosa */}
                  <rect x="49" y="24" width="4.5" height="34" rx="2" fill="#FFFFFF" />
                  <rect x="41" y="33" width="20.5" height="4.5" rx="2" fill="#FFFFFF" />

                  <defs>
                    <linearGradient id="hero-gold-play" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFF5CC" />
                      <stop offset="30%" stopColor="#FFC928" />
                      <stop offset="75%" stopColor="#D49A00" />
                      <stop offset="100%" stopColor="#805C00" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Título de Marca no Emblema */}
              <div className="mt-2 font-black text-2xl sm:text-3xl text-white tracking-wide">
                GDM <span className="text-[#FFC928]">LIVE RADIO</span>
              </div>
              <div className="text-sm font-semibold text-[#FFC928] italic font-serif mt-0.5">
                Graça Digital!
              </div>

              {/* Tagline Oficial Espaçada */}
              <div className="mt-4 pt-3 border-t border-[#FFC928]/30 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#FFC928] flex items-center justify-center gap-2">
                <span>FÉ</span>
                <span className="text-[#7000FF]">•</span>
                <span>MÚSICA</span>
                <span className="text-[#7000FF]">•</span>
                <span>PROPÓSITO</span>
              </div>
            </div>
          </div>

          {/* Caligrafia Cursiva Inspiracional */}
          <div className="mt-2 text-center lg:text-right w-full pr-4">
            <p className="font-serif italic text-lg sm:text-xl text-[#FFE58F] drop-shadow-[0_2px_8px_rgba(255,201,40,0.4)]">
              "Conectando você a Deus através da música!"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
