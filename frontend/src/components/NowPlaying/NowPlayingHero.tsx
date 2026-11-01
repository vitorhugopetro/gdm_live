import { useState } from 'react';
import { Music2, Heart, Share2, Moon, Sparkles, Send } from 'lucide-react';
import { AlbumArt } from './AlbumArt';
import { AnimatedBars } from '@/components/Common/AnimatedBars';
import { Badge } from '@/components/Common/Badge';
import { Spinner } from '@/components/Common/Spinner';
import { VisualizerCanvas } from '@/components/Player/VisualizerCanvas';
import { FloatingReactions } from '@/components/Player/FloatingReactions';
import { SleepTimerModal } from '@/components/Player/SleepTimerModal';
import { ShareSongModal } from '@/components/Player/ShareSongModal';
import { SongRequestModal } from '@/components/Community/SongRequestModal';
import { useRadioStore } from '@/store/radioStore';

export function NowPlayingHero() {
  const {
    nowPlaying,
    isPlayerPlaying,
    connectionState,
    favorites,
    toggleFavorite,
    sleepTimerEndsAt,
  } = useRadioStore();

  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const track = nowPlaying?.track;
  const isUnavailable = !nowPlaying && connectionState !== 'connecting' && connectionState !== 'loading';
  const isFav = track ? favorites.includes(track.id) : false;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gdm-card border border-gdm-border/80 shadow-gdm-lg transition-all">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gdm-gradient pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-glow opacity-30 pointer-events-none blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-gdm-emerald/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 md:p-10">
        {/* Top bar inside hero: Live Badge + Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            {isPlayerPlaying && connectionState === 'playing' ? (
              <Badge variant="live" dot>Ao Vivo</Badge>
            ) : (
              <Badge variant="default" dot={false}>
                <Music2 className="w-3 h-3 mr-1" />
                GDM Live Radio
              </Badge>
            )}
            <span className="text-gdm-text-muted text-xs hidden sm:inline">
              Graça Digital — 24h Louvor Contínuo
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sleep Timer Indicator/Button */}
            <button
              onClick={() => setIsSleepModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                sleepTimerEndsAt
                  ? 'bg-gdm-purple/30 border-gdm-purple text-gdm-purple-light animate-pulse'
                  : 'bg-gdm-border/40 border-gdm-border text-gdm-text-secondary hover:text-white hover:bg-gdm-border'
              }`}
              title="Temporizador de Sono (Sleep Timer)"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {sleepTimerEndsAt ? 'Timer Ativo' : 'Dormir'}
              </span>
            </button>

            {/* Pedir Música Button */}
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gdm-purple/20 border border-gdm-purple/40 text-gdm-purple-light hover:bg-gdm-purple hover:text-white transition-all shadow-gdm"
              title="Pedir um louvor para tocar na rádio"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pedir Louvor</span>
            </button>
          </div>
        </div>

        {/* Center: Album Art + Track Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
          {/* Album Art with decorative spinning disc on playback */}
          <div className="relative flex-shrink-0">
            <AlbumArt
              src={track?.coverArt}
              alt={track ? `${track.title} — ${track.artist}` : 'GDM Live Radio'}
              size="xl"
              rounded="xl"
              className="shadow-2xl ring-1 ring-white/10"
            />
            {isPlayerPlaying && connectionState === 'playing' && (
              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-gdm-card border-2 border-gdm-purple flex items-center justify-center shadow-gdm">
                <div className="w-2.5 h-2.5 rounded-full bg-gdm-purple animate-ping" />
              </div>
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 text-center sm:text-left min-w-0 flex flex-col justify-center">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <p className="text-gdm-text-secondary text-xs font-semibold uppercase tracking-widest">
                Tocando Agora
              </p>
              {nowPlaying?.requestedBy && (
                <span className="px-2 py-0.5 rounded-full bg-gdm-gold/20 border border-gdm-gold/40 text-gdm-gold text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Pedido por {nowPlaying.requestedBy.name}
                </span>
              )}
            </div>

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
                <h1 className="text-2xl md:text-4xl font-black text-gdm-text-primary leading-tight truncate-multiline">
                  {track.title}
                </h1>
                <p className="text-gdm-purple-light text-lg md:text-xl font-semibold mt-1 truncate">
                  {track.artist}
                </p>
                {track.album && (
                  <p className="text-gdm-text-muted text-sm mt-0.5">{track.album}</p>
                )}
              </>
            )}

            {/* Quick action buttons for the current track */}
            {track && (
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={() => toggleFavorite(track.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isFav
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                      : 'bg-gdm-border/40 border-gdm-border text-gdm-text-secondary hover:text-rose-400 hover:bg-gdm-border/80'
                  }`}
                  title={isFav ? 'Remover dos favoritos' : 'Favoritar este louvor'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-rose-400' : ''}`} />
                  <span>{isFav ? 'Favoritado' : 'Favoritar'}</span>
                </button>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gdm-border/40 border border-gdm-border text-gdm-text-secondary hover:text-white hover:bg-gdm-border/80 transition-all"
                  title="Compartilhar este louvor"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar</span>
                </button>
              </div>
            )}

            {/* Live Indicator bars */}
            {isPlayerPlaying && connectionState === 'playing' && (
              <div className="mt-4 flex items-center gap-3 justify-center sm:justify-start">
                <AnimatedBars size="md" color="emerald" />
                <span className="text-gdm-emerald text-xs font-semibold tracking-wider uppercase">
                  Ao vivo agora
                </span>
              </div>
            )}

            {/* Loading state */}
            {(connectionState === 'connecting' || connectionState === 'loading') && (
              <div className="mt-4 flex items-center gap-3 justify-center sm:justify-start">
                <Spinner size="sm" color="purple" />
                <span className="text-gdm-text-secondary text-sm">
                  {connectionState === 'connecting' ? 'Conectando...' : 'Carregando...'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modern Live Audio Visualizer Spectrum */}
        <div className="mt-6 pt-6 border-t border-gdm-border/50">
          <VisualizerCanvas isPlaying={isPlayerPlaying && connectionState === 'playing'} />
        </div>

        {/* Floating Faith Reactions Bar */}
        <div className="mt-4 pt-4 border-t border-gdm-border/30 flex items-center justify-between flex-wrap gap-3">
          <FloatingReactions />
        </div>
      </div>

      {/* Modals */}
      <SleepTimerModal isOpen={isSleepModalOpen} onClose={() => setIsSleepModalOpen(false)} />
      <ShareSongModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} track={track} />
      <SongRequestModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </section>
  );
}
