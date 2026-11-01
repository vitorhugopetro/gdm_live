import { useMemo, useState } from 'react';
import { Search, Music, Play, ListMusic, X } from 'lucide-react';
import { GDM_WEB_PLAYLIST } from '@/config/webPlaylist';
import { useRadioStore } from '@/store/radioStore';

const PAGE_SIZE = 50;

export default function AdminLibrary() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { nowPlaying } = useRadioStore();

  const currentTrackId = nowPlaying?.track?.id ?? '';

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return GDM_WEB_PLAYLIST;
    return GDM_WEB_PLAYLIST.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const globalOffset = (safePage - 1) * PAGE_SIZE;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-gdm-card border border-gdm-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ListMusic className="w-4 h-4 text-gdm-purple" />
            <span className="text-gdm-muted text-xs font-medium">Total de músicas</span>
          </div>
          <p className="text-2xl font-bold text-gdm-text">{GDM_WEB_PLAYLIST.length}</p>
        </div>
        <div className="bg-gdm-card border border-gdm-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-gdm-purple" />
            <span className="text-gdm-muted text-xs font-medium">Resultado da busca</span>
          </div>
          <p className="text-2xl font-bold text-gdm-text">{filtered.length}</p>
        </div>
        <div className="bg-gdm-card border border-gdm-border rounded-2xl p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-gdm-emerald" />
            <span className="text-gdm-muted text-xs font-medium">Tocando agora</span>
          </div>
          <p className="text-sm font-semibold text-gdm-text truncate">
            {nowPlaying?.track?.title ?? '—'}
          </p>
          {nowPlaying?.track?.artist && (
            <p className="text-xs text-gdm-muted truncate">{nowPlaying.track.artist}</p>
          )}
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gdm-muted pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por título ou artista..."
            className="w-full bg-gdm-card border border-gdm-border rounded-xl pl-9 pr-10 py-2.5 text-gdm-text text-sm placeholder:text-gdm-muted focus:outline-none focus:ring-2 focus:ring-gdm-purple/50 focus:border-gdm-purple"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gdm-muted hover:text-gdm-text"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-gdm-purple hover:bg-gdm-purple/80 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Result count */}
      <p className="text-gdm-muted text-sm">
        {filtered.length === GDM_WEB_PLAYLIST.length
          ? `${GDM_WEB_PLAYLIST.length} músicas na biblioteca`
          : `${filtered.length} resultado(s) para "${search}"`}
        {totalPages > 1 && ` · Página ${safePage} de ${totalPages}`}
      </p>

      {/* Track list */}
      {pageItems.length === 0 ? (
        <div className="bg-gdm-card border border-gdm-border rounded-2xl p-12 text-center">
          <Music className="w-10 h-10 text-gdm-muted mx-auto mb-3" />
          <p className="text-gdm-muted">Nenhuma música encontrada para "{search}".</p>
          <button
            onClick={clearSearch}
            className="mt-3 text-gdm-purple text-sm hover:underline"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="bg-gdm-card border border-gdm-border rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[2.5rem_1fr_1fr_6rem] gap-3 px-4 py-2.5 border-b border-gdm-border bg-white/[0.02]">
            <span className="text-gdm-muted text-xs font-medium text-center">#</span>
            <span className="text-gdm-muted text-xs font-medium">Título</span>
            <span className="text-gdm-muted text-xs font-medium">Artista / Álbum</span>
            <span className="text-gdm-muted text-xs font-medium">Arquivo</span>
          </div>

          <ul className="divide-y divide-gdm-border">
            {pageItems.map((track, idx) => {
              const globalIdx = globalOffset + idx + 1;
              const isPlaying = track.id === currentTrackId || track.url === nowPlaying?.streamUrl;
              return (
                <li
                  key={track.id}
                  className={`grid grid-cols-[2.5rem_1fr] sm:grid-cols-[2.5rem_1fr_1fr_6rem] gap-3 items-center px-4 py-3 transition-colors ${
                    isPlaying
                      ? 'bg-gdm-purple/10 border-l-2 border-gdm-purple'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Number / Playing indicator */}
                  <div className="flex items-center justify-center">
                    {isPlaying ? (
                      <span className="flex gap-0.5 items-end h-4">
                        <span className="w-0.5 bg-gdm-purple rounded-full animate-[bounce_0.8s_ease-in-out_infinite]" style={{ height: '60%' }} />
                        <span className="w-0.5 bg-gdm-purple rounded-full animate-[bounce_0.8s_ease-in-out_0.2s_infinite]" style={{ height: '100%' }} />
                        <span className="w-0.5 bg-gdm-purple rounded-full animate-[bounce_0.8s_ease-in-out_0.4s_infinite]" style={{ height: '40%' }} />
                      </span>
                    ) : (
                      <span className="text-gdm-muted text-xs tabular-nums">{globalIdx}</span>
                    )}
                  </div>

                  {/* Title */}
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isPlaying ? 'text-gdm-purple' : 'text-gdm-text'}`}>
                      {track.title}
                    </p>
                    {/* Mobile: show artist below title */}
                    <p className="sm:hidden text-gdm-muted text-xs truncate mt-0.5">{track.artist}</p>
                  </div>

                  {/* Artist / Album (desktop) */}
                  <div className="hidden sm:block min-w-0">
                    <p className="text-gdm-muted text-xs truncate">{track.artist}</p>
                    {track.album && track.album !== 'GDM Live Radio' && (
                      <p className="text-gdm-muted/60 text-xs truncate">{track.album}</p>
                    )}
                  </div>

                  {/* File slug (desktop) */}
                  <div className="hidden sm:block min-w-0">
                    <p className="text-gdm-muted/50 text-[10px] font-mono truncate">{track.id.replace('.mp3', '')}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setPage(1)}
            disabled={safePage === 1}
            className="px-3 py-1.5 bg-gdm-card border border-gdm-border rounded-lg text-gdm-text text-sm disabled:opacity-40 hover:bg-white/5 transition-colors"
          >
            «
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="px-3 py-1.5 bg-gdm-card border border-gdm-border rounded-lg text-gdm-text text-sm disabled:opacity-40 hover:bg-white/5 transition-colors"
          >
            ← Anterior
          </button>

          {/* Page numbers around current */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
            .reduce<(number | '...')[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="text-gdm-muted px-1">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    safePage === p
                      ? 'bg-gdm-purple text-white'
                      : 'bg-gdm-card border border-gdm-border text-gdm-text hover:bg-white/5'
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 bg-gdm-card border border-gdm-border rounded-lg text-gdm-text text-sm disabled:opacity-40 hover:bg-white/5 transition-colors"
          >
            Próxima →
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 bg-gdm-card border border-gdm-border rounded-lg text-gdm-text text-sm disabled:opacity-40 hover:bg-white/5 transition-colors"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}
