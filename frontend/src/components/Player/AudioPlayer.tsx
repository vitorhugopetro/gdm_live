import { Play, Pause, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { useRadioStore } from '@/store/radioStore';
import { useRadioStream } from '@/hooks/useRadioStream';
import { useMediaSession } from '@/hooks/useMediaSession';
import { AlbumArt } from '@/components/NowPlaying/AlbumArt';
import { PlayerConnectionBadge } from './PlayerConnectionBadge';
import { Spinner } from '@/components/Common/Spinner';

export function AudioPlayer() {
  const {
    nowPlaying,
    isPlayerPlaying,
    playerVolume,
    playerMuted,
    connectionState,
    reconnectAttempt,
    togglePlay,
    setVolume,
    toggleMute,
  } = useRadioStore();

  const { retry } = useRadioStream();
  useMediaSession();

  const track = nowPlaying?.track;
  const isLoading = connectionState === 'connecting' || connectionState === 'loading';
  const isReconnecting = connectionState === 'reconnecting';
  const isError = connectionState === 'offline' || connectionState === 'error';

  const handlePlayPause = () => {
    if (isError) {
      retry();
      return;
    }
    togglePlay();
  };

  return (
    <div
      role="region"
      aria-label="Reprodutor de rádio"
      className="glass-strong fixed bottom-0 left-0 right-0 z-50 border-t border-gdm-border/70 shadow-gdm-lg"
    >
      {/* Progress bar accent line (decorative) */}
      <div className="h-[2px] w-full bg-gdm-border">
        {connectionState === 'playing' && (
          <div className="h-full bg-gradient-to-r from-gdm-purple to-gdm-emerald animate-pulse" />
        )}
        {isLoading && (
          <div className="h-full bg-gdm-purple/60 animate-pulse w-1/2 rounded-full" />
        )}
      </div>

      <div className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 max-w-7xl mx-auto">
        {/* Track info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlbumArt
            src={track?.coverArt}
            alt={track?.title}
            size="sm"
            rounded="md"
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            {track ? (
              <>
                <p className="text-gdm-text-primary font-semibold text-sm truncate leading-tight">
                  {track.title}
                </p>
                <p className="text-gdm-text-secondary text-xs truncate">{track.artist}</p>
              </>
            ) : (
              <>
                <p className="text-gdm-text-primary font-semibold text-sm">GDM Live Radio</p>
                <p className="text-gdm-text-muted text-xs">Graça Digital — GDM</p>
              </>
            )}
            {/* Connection badge (mobile only, inline) */}
            <div className="mt-0.5 md:hidden">
              <PlayerConnectionBadge
                state={connectionState}
                reconnectAttempt={reconnectAttempt}
                compact
              />
            </div>
          </div>
        </div>

        {/* Center: Connection badge (desktop) + Play button */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Connection badge — desktop */}
          <div className="hidden md:block">
            <PlayerConnectionBadge
              state={connectionState}
              reconnectAttempt={reconnectAttempt}
            />
          </div>

          {/* Play / Pause button */}
          <button
            onClick={handlePlayPause}
            disabled={isReconnecting}
            aria-label={isPlayerPlaying ? 'Pausar transmissão' : 'Iniciar transmissão'}
            className={clsx(
              'flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-200 flex-shrink-0',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gdm-purple focus-visible:ring-offset-2 focus-visible:ring-offset-gdm-bg',
              isError
                ? 'bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 text-red-400'
                : 'bg-gdm-purple hover:bg-gdm-purple-light shadow-gdm text-white',
              isReconnecting && 'opacity-60 cursor-not-allowed',
            )}
          >
            {isLoading || isReconnecting ? (
              <Spinner size="sm" color="white" />
            ) : isError ? (
              <RefreshCw className="w-5 h-5 md:w-6 md:h-6" />
            ) : isPlayerPlaying ? (
              <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            ) : (
              <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Right: Volume controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mute button (always visible) */}
          <button
            onClick={toggleMute}
            aria-label={playerMuted ? 'Ativar som' : 'Silenciar'}
            className="w-10 h-10 flex items-center justify-center text-gdm-text-secondary hover:text-gdm-text-primary transition-colors rounded-lg hover:bg-gdm-card/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gdm-purple"
          >
            {playerMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {/* Volume slider — desktop only */}
          <div className="hidden md:flex items-center w-28">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={playerMuted ? 0 : playerVolume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (v > 0 && playerMuted) {
                  useRadioStore.getState().setMuted(false);
                }
              }}
              aria-label="Volume"
              className="volume-slider w-full accent-gdm-purple"
              style={{
                background: `linear-gradient(to right, #7C3AED ${(playerMuted ? 0 : playerVolume) * 100}%, #1E2D45 ${(playerMuted ? 0 : playerVolume) * 100}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
