import { Music2 } from 'lucide-react';
import { AlbumArt } from './AlbumArt';
import { AnimatedBars } from '@/components/Common/AnimatedBars';
import { Badge } from '@/components/Common/Badge';
import { Spinner } from '@/components/Common/Spinner';
import { useRadioStore } from '@/store/radioStore';

export function NowPlayingHero() {
  const { nowPlaying, isPlayerPlaying, connectionState } = useRadioStore();
  const track = nowPlaying?.track;
  const isUnavailable = !nowPlaying && connectionState !== 'connecting' && connectionState !== 'loading';

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gdm-card border border-gdm-border shadow-gdm-lg">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 bg-gdm-gradient pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-purple-glow opacity-30 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-gdm-emerald/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 md:p-10">
        {/* Live badge */}
        <div className="flex items-center gap-3 mb-6">
          {isPlayerPlaying && connectionState === 'playing' ? (
            <Badge variant="live" dot>Ao Vivo</Badge>
          ) : (
            <Badge variant="default" dot={false}>
              <Music2 className="w-3 h-3 mr-1" />
              GDM Live Radio
            </Badge>
          )}
          <span className="text-gdm-text-muted text-xs">Graça Digital — GDM</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
          {/* Album Art */}
          <div className="relative flex-shrink-0">
            <AlbumArt
              src={track?.coverArt}
              alt={track ? `${track.title} — ${track.artist}` : 'GDM Live Radio'}
              size="xl"
              rounded="xl"
              className="shadow-gdm-lg"
            />
            {/* Spinning vinyl effect when playing */}
            {isPlayerPlaying && connectionState === 'playing' && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gdm-card border-2 border-gdm-purple/50 flex items-center justify-center shadow-gdm">
                <div className="w-2 h-2 rounded-full bg-gdm-purple animate-spin-slow" />
              </div>
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 text-center sm:text-left min-w-0 flex flex-col justify-center">
            <p className="text-gdm-text-secondary text-sm font-medium uppercase tracking-widest mb-2">
              Tocando Agora
            </p>

            {isUnavailable ? (
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gdm-text-secondary">
                  Transmissão indisponível
                </h1>
                <p className="text-gdm-text-muted text-sm">
                  Estamos preparando algo especial. Volte em breve.
                </p>
              </div>
            ) : !track ? (
              <div className="space-y-3">
                <div className="h-8 bg-gdm-border/60 rounded animate-pulse w-3/4 mx-auto sm:mx-0" />
                <div className="h-5 bg-gdm-border/40 rounded animate-pulse w-1/2 mx-auto sm:mx-0" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-4xl font-extrabold text-gdm-text-primary leading-tight truncate-multiline">
                  {track.title}
                </h1>
                <p className="text-gdm-purple-light text-lg md:text-xl font-semibold mt-1 truncate">
                  {track.artist}
                </p>
                {track.album && (
                  <p className="text-gdm-text-muted text-sm mt-1">{track.album}</p>
                )}
              </>
            )}

            {/* Animated bars when playing */}
            {isPlayerPlaying && connectionState === 'playing' && (
              <div className="mt-5 flex items-center gap-3 justify-center sm:justify-start">
                <AnimatedBars size="lg" color="emerald" />
                <span className="text-gdm-emerald text-xs font-semibold tracking-wider uppercase">
                  Ao vivo agora
                </span>
              </div>
            )}

            {/* Loading state */}
            {(connectionState === 'connecting' || connectionState === 'loading') && (
              <div className="mt-5 flex items-center gap-3 justify-center sm:justify-start">
                <Spinner size="sm" color="purple" />
                <span className="text-gdm-text-secondary text-sm">
                  {connectionState === 'connecting' ? 'Conectando...' : 'Carregando...'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
