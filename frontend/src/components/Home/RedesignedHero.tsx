import { Play, Pause, Radio } from 'lucide-react';
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
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B0B16] via-[#07070D] to-[#120B24] border border-[#1C223A] shadow-2xl p-6 sm:p-8 lg:p-10">
      {/* Luz e Gradientes Atmosféricos de Fundo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#7000FF]/25 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-[32rem] h-[32rem] rounded-full bg-[#FFC928]/15 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-[#7000FF]/20 blur-[100px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Coluna Esquerda: Mensagem Institucional + Chamada Principal */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
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
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
              GDM Live Radio
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-[#FFC928] leading-snug drop-shadow-[0_2px_12px_rgba(255,201,40,0.35)]">
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
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#181105] via-[#2E2003] to-[#181105] hover:from-[#3D2B05] hover:to-[#2E2003] text-[#FFC928] border-2 border-[#FFC928] shadow-[0_0_24px_rgba(255,201,40,0.45)] hover:shadow-[0_0_36px_rgba(255,201,40,0.75)] text-base font-bold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
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
              <span className="hidden sm:inline">Stream Contínuo 24h</span>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Obra de Arte Hiper-Realista Oficial (Emblema Dourado 3D + Cruz Radiante + Adorador) */}
        <div className="lg:col-span-7 relative flex items-center justify-center">
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#FFC928]/30 shadow-[0_0_50px_rgba(255,201,40,0.2)] bg-[#07070D] group">
            {/* Imagem Oficial Hiper-Realista */}
            <img
              src="/images/hero-art-hyperrealistic.jpg"
              alt="GDM Live Radio - Emblema Dourado 3D, Adorador na Colina e Cruz Radiante ao Pôr do Sol"
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
            />

            {/* Brilho Sutil de Vinheta Dourada e Violeta nas Bordas */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07070D]/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 border border-[#FFC928]/20 rounded-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
