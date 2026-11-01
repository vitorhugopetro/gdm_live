import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Shuffle,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  RefreshCw,
} from 'lucide-react';
import { useRadioStore } from '@/store/radioStore';
import { useRadioStream } from '@/hooks/useRadioStream';
import { Spinner } from '@/components/Common/Spinner';

export function RedesignedMasterPlayer() {
  const {
    nowPlaying,
    isPlayerPlaying,
    playerVolume,
    playerMuted,
    connectionState,
    togglePlay,
    setVolume,
    toggleMute,
  } = useRadioStore();

  const { retry, nextTrack, prevTrack, shuffleTrack } = useRadioStream();

  const track = nowPlaying?.track;
  const isLoading = connectionState === 'loading' || connectionState === 'connecting';
  const isReconnecting = connectionState === 'reconnecting';
  const isError = connectionState === 'offline' || connectionState === 'error';
  const isLive = connectionState === 'playing';

  const handlePlayPause = () => {
    if (isError) {
      retry();
      return;
    }
    togglePlay();
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#0E1020]/95 via-[#0B0B16]/95 to-[#120B24]/95 border-2 border-[#1C223A] hover:border-[#7000FF]/50 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-4 sm:p-5 transition-all duration-300">
      {/* Barra de Progresso / Pulso no Topo */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#7000FF] to-transparent opacity-80" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Lado Esquerdo: Capa do Álbum + Título da Música em Reprodução */}
        <div className="flex items-center gap-4 min-w-0 w-full md:w-auto flex-1">
          {/* Capa com Emblema Dourado da GDM */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#1C1133] to-[#0B0B16] border border-[#7000FF]/40 flex-shrink-0 flex items-center justify-center shadow-lg overflow-hidden group">
            <img
              src={track?.coverArt || track?.coverArtDataUrl || '/images/player-album-art.jpg'}
              alt={track ? track.title : 'Graça Digital'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Efeito de brilho quando tocando */}
            {isLive && isPlayerPlaying && (
              <div className="absolute inset-0 bg-[#7000FF]/15 pointer-events-none animate-pulse" />
            )}
          </div>

          {/* Dados da Faixa */}
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-[#FFC928] uppercase tracking-wider block">
              Agora Tocando:
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-white truncate leading-tight mt-0.5">
              {track ? track.title : 'Esperança Viva'}
            </h2>
            <p className="text-xs sm:text-sm text-[#C9C9D4] truncate font-medium">
              {track ? track.artist : 'Graça Digital (GDM)'}
            </p>
          </div>
        </div>

        {/* Centro: Controles de Áudio (Shuffle, Prev, Big Play, Next, Repeat) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-shrink-0">
          {/* Botão Aleatório / Program Mode */}
          <button
            type="button"
            onClick={shuffleTrack}
            className="p-2 text-[#7A839E] hover:text-[#FFC928] transition-colors rounded-full hover:bg-white/5 active:scale-95"
            title="Tocar louvor aleatório"
          >
            <Shuffle className="w-4 h-4 text-[#7000FF] hover:text-[#FFC928]" />
          </button>

          {/* Botão Anterior */}
          <button
            type="button"
            onClick={prevTrack}
            className="p-2 text-[#C9C9D4] hover:text-[#FFC928] transition-colors rounded-full hover:bg-white/5 active:scale-95"
            title="Louvor anterior"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Botão Central Gigante Play / Pause em Roxo Neon (#7000FF) */}
          <button
            onClick={handlePlayPause}
            disabled={isReconnecting}
            aria-label={isPlayerPlaying ? 'Pausar transmissão' : 'Iniciar transmissão'}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#5200BA] via-[#7000FF] to-[#9B4DFF] hover:from-[#6000D6] hover:to-[#A65BFF] text-white flex items-center justify-center shadow-[0_0_24px_rgba(112,0,255,0.7)] hover:shadow-[0_0_36px_rgba(112,0,255,0.95)] transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 focus:outline-none"
          >
            {isLoading || isReconnecting ? (
              <Spinner size="md" color="white" />
            ) : isError ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : isPlayerPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          {/* Botão Próximo */}
          <button
            type="button"
            onClick={nextTrack}
            className="p-2 text-[#C9C9D4] hover:text-[#FFC928] transition-colors rounded-full hover:bg-white/5 active:scale-95"
            title="Próximo louvor"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Botão Loop / Contínuo */}
          <button
            type="button"
            onClick={nextTrack}
            className="p-2 text-[#7A839E] hover:text-[#FFC928] transition-colors rounded-full hover:bg-white/5 active:scale-95"
            title="Transmissão contínua 24h"
          >
            <Repeat className="w-4 h-4 text-[#7000FF] hover:text-[#FFC928]" />
          </button>
        </div>

        {/* Lado Direito: Controle de Volume + Botão "Ver Programação" */}
        <div className="flex items-center justify-end gap-3 w-full md:w-auto flex-1">
          {/* Mute + Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              aria-label={playerMuted ? 'Ativar som' : 'Silenciar'}
              className="p-2 text-[#C9C9D4] hover:text-[#FFC928] transition-colors rounded-full hover:bg-white/5"
            >
              {playerMuted || playerVolume === 0 ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-[#9B4DFF]" />
              )}
            </button>

            <div className="relative w-20 sm:w-24 flex items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={playerMuted ? 0 : playerVolume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                }}
                className="w-full h-1.5 bg-[#1C223A] rounded-lg appearance-none cursor-pointer accent-[#7000FF] hover:accent-[#9B4DFF]"
                aria-label="Volume do áudio"
              />
            </div>
          </div>

          {/* Botão Ver Programação */}
          <Link
            to="/programacao"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1C223A] hover:bg-[#7000FF] hover:text-white text-[#C9C9D4] text-xs font-bold transition-all duration-200 border border-[#2E3654] hover:border-[#7000FF]"
          >
            <ListMusic className="w-4 h-4 text-[#FFC928]" />
            <span>Ver Programação</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
