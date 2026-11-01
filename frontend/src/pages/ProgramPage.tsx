import { useRadioStore } from '@/store/radioStore';
import RecentlyPlayed from '@/components/History/RecentlyPlayed';
import { AlbumArt } from '@/components/NowPlaying/AlbumArt';
import { Clock, ListMusic } from 'lucide-react';

export default function ProgramPage() {
  const { upcomingTracks, nowPlaying } = useRadioStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-gdm-text text-2xl font-bold">Programação</h1>

      {/* Upcoming */}
      <section aria-labelledby="upcoming-heading">
        <div className="flex items-center gap-2 mb-4">
          <ListMusic className="w-5 h-5 text-gdm-purple" />
          <h2 id="upcoming-heading" className="text-gdm-text font-semibold text-lg">
            Próximas músicas
          </h2>
        </div>

        {upcomingTracks.length === 0 ? (
          <div className="bg-gdm-card rounded-2xl border border-gdm-border p-8 text-center">
            {nowPlaying?.programMode === 'random' ? (
              <p className="text-gdm-muted text-sm">
                Modo aleatório ativo — as próximas músicas são selecionadas dinamicamente.
              </p>
            ) : (
              <p className="text-gdm-muted text-sm">
                Nenhuma música na fila no momento.
              </p>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {upcomingTracks.map((track, index) => (
              <li
                key={track.id}
                className="bg-gdm-card border border-gdm-border rounded-xl p-3 flex items-center gap-3"
              >
                <span className="text-gdm-muted text-sm w-5 text-right">{index + 1}</span>
                <AlbumArt track={track} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-gdm-text text-sm font-medium truncate">{track.title}</p>
                  <p className="text-gdm-muted text-xs truncate">{track.artist}</p>
                </div>
                <span className="text-gdm-muted text-xs tabular-nums">
                  {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* History */}
      <section aria-labelledby="history-heading">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gdm-emerald" />
          <h2 id="history-heading" className="text-gdm-text font-semibold text-lg">
            Histórico completo
          </h2>
        </div>
        <RecentlyPlayed limit={50} />
      </section>
    </div>
  );
}
