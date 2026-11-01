import { useRadioStore } from '@/store/radioStore';
import { AlbumArt } from '@/components/NowPlaying/AlbumArt';
import { Clock } from 'lucide-react';

interface Props {
  limit?: number;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function RecentlyPlayed({ limit = 10 }: Props) {
  const { history } = useRadioStore();
  const displayHistory = history.slice(0, limit);

  if (displayHistory.length === 0) {
    return (
      <div className="bg-gdm-card border border-gdm-border rounded-2xl p-8 text-center">
        <Clock className="w-8 h-8 text-gdm-muted mx-auto mb-3 opacity-50" />
        <p className="text-gdm-muted text-sm">
          Nenhuma música tocada ainda. Aguardando a transmissão iniciar.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2" aria-label="Músicas tocadas recentemente">
      {displayHistory.map((item) => (
        <li
          key={item.id}
          className="bg-gdm-card border border-gdm-border rounded-xl px-3 py-2.5 flex items-center gap-3 hover:bg-white/2 transition-colors"
        >
          <AlbumArt src={item.track.coverArt} alt={item.track.title} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-gdm-text text-sm font-medium truncate">{item.track.title}</p>
            <p className="text-gdm-muted text-xs truncate">{item.track.artist}</p>
          </div>
          <time
            className="text-gdm-muted text-xs tabular-nums flex-shrink-0"
            dateTime={item.playedAt}
            title={new Date(item.playedAt).toLocaleString('pt-BR')}
          >
            {formatTime(item.playedAt)}
          </time>
        </li>
      ))}
    </ul>
  );
}
