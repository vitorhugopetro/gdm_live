import { Activity, Headphones, Smartphone, Monitor, Tv, Music, Globe, CheckCircle2 } from 'lucide-react';
import { useRadioStore } from '@/store/radioStore';

export function LivePresenceRadar() {
  const { nowPlaying, isPlayerPlaying } = useRadioStore();

  const currentTrack = nowPlaying?.track?.title || 'Esperança Viva';
  const currentArtist = nowPlaying?.track?.artist || 'Graça Digital (GDM)';

  return (
    <div className="bg-[#0E1020] border border-[#1C223A] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Luz ambiente de fundo */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#10B981]/10 blur-[80px] pointer-events-none" />

      {/* Header do Radar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1C223A]">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30">
            <Activity className="w-5 h-5 text-[#10B981] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              Radar de Presença & Transmissão
            </h2>
            <p className="text-[#7A839E] text-xs">
              Monitoramento ao vivo de ouvintes conectados e status do streaming
            </p>
          </div>
        </div>

        {/* Badges de Contagem */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#07070D] border border-[#1C223A] flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs text-[#C9C9D4]">Ouvindo Agora:</span>
            <span className="text-sm font-black text-[#10B981]">{isPlayerPlaying ? '1+' : '0'}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-[#07070D] border border-[#1C223A] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#7000FF]" />
            <span className="text-xs text-[#C9C9D4]">Status do Stream:</span>
            <span className="text-sm font-black text-white">Online 24h</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="pt-6 space-y-4">
        <div className="p-4 rounded-xl bg-[#07070D] border border-[#1C223A] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#7000FF]/15 border border-[#7000FF]/30">
              <Music className="w-5 h-5 text-[#FFC928]" />
            </div>
            <div>
              <p className="text-xs text-[#7A839E]">Faixa Ativa no Stream Global</p>
              <p className="text-white font-bold text-sm">{currentTrack}</p>
              <p className="text-[#C9C9D4] text-xs">{currentArtist}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/20 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Transmissão Estável (Edge CDN)</span>
          </div>
        </div>

        {/* Dicas de Acompanhamento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#07070D]/70 border border-[#1C223A] flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-[#7000FF]" />
            <span className="text-[#C9C9D4]">Mobile & Tablets (PWA)</span>
          </div>
          <div className="p-3 rounded-xl bg-[#07070D]/70 border border-[#1C223A] flex items-center gap-2.5">
            <Monitor className="w-4 h-4 text-[#10B981]" />
            <span className="text-[#C9C9D4]">Navegadores Desktop</span>
          </div>
          <div className="p-3 rounded-xl bg-[#07070D]/70 border border-[#1C223A] flex items-center gap-2.5">
            <Tv className="w-4 h-4 text-[#FFC928]" />
            <span className="text-[#C9C9D4]">Smart TVs (Controle D-Pad)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
