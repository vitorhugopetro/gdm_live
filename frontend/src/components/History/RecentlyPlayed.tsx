import { useRadioStore } from '@/store/radioStore';
import { AlbumArt } from '@/components/NowPlaying/AlbumArt';
import { Clock } from 'lucide-react';
import { GDM_WEB_PLAYLIST } from '@/config/webPlaylist';

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

  const fallbackHistory = GDM_WEB_PLAYLIST.slice(1, 6).map((t, idx) => ({
    id: t.id,
    track: {
      id: t.id,
      title: t.title,
      artist: t.artist,
      album: t.album,
      duration: 280,
      coverArt: t.coverUrl,
      coverArtDataUrl: t.coverUrl,
      filename: t.id,
      fileSize: 5000000,
      bitrate: 128,
      format: 'mp3',
      playCount: 1,
      lastPlayed: new Date(Date.now() - (idx + 1) * 320000).toISOString(),
      addedAt: new Date().toISOString(),
      path: t.url,
    },
    playedAt: new Date(Date.now() - (idx + 1) * 320000).toISOString(),
    listenersCount: 120 - idx * 5,
  }));

  const items = history.length > 0 ? history.slice(0, limit) : fallbackHistory.slice(0, limit);

  return (
    <ul className="space-y-2.5" aria-label="Músicas tocadas recentemente">
      {items.map((item) => (
        <li
          key={item.id}
          className="bg-gradient-to-r from-[#0E1020] to-[#07070D] border border-[#1C223A] hover:border-[#7000FF]/40 rounded-xl px-3.5 py-2.5 flex items-center gap-3.5 hover:bg-[#120B24] transition-all group"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-[#2E3654]">
            <img
              src={item.track.coverArt || '/images/player-album-art.jpg'}
              alt={item.track.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate group-hover:text-[#FFC928] transition-colors">
              {item.track.title}
            </p>
            <p className="text-[#C9C9D4] text-xs truncate">{item.track.artist}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[#7A839E] text-xs tabular-nums flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#FFC928]" />
            <time dateTime={item.playedAt}>{formatTime(item.playedAt)}</time>
          </div>
        </li>
      ))}
    </ul>
  );
}
