import { useEffect, useState } from 'react';
import { Search, RefreshCw, Music, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/Common/Spinner';
import { AlbumArt } from '@/components/NowPlaying/AlbumArt';
import toast from 'react-hot-toast';
import type { Track, PaginatedResponse } from '@/types';

export default function AdminLibrary() {
  const [data, setData] = useState<PaginatedResponse<Track> | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { getToken } = useAuthStore();

  const fetchLibrary = async (searchTerm = search, currentPage = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: '50',
        ...(searchTerm ? { search: searchTerm } : {}),
      });
      const res = await api.get<{ data: PaginatedResponse<Track> }>(`/api/library?${params}`);
      setData(res.data.data);
    } catch {
      toast.error('Erro ao carregar biblioteca.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLibrary(search, 1);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const token = await getToken();
      await api.post('/api/admin/sync', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Sincronização iniciada! Atualizando em 5s...');
      setTimeout(() => fetchLibrary(), 5000);
    } catch {
      toast.error('Erro ao iniciar sincronização.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gdm-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, artista..."
              className="w-full bg-gdm-card border border-gdm-border rounded-xl pl-9 pr-4 py-2.5 text-gdm-text text-sm placeholder:text-gdm-muted focus:outline-none focus:ring-2 focus:ring-gdm-purple/50 focus:border-gdm-purple"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-gdm-purple hover:bg-gdm-purple/80 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Buscar
          </button>
        </form>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-gdm-card border border-gdm-border hover:bg-white/5 text-gdm-text text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          Sincronizar
        </button>
      </div>

      {/* Stats */}
      {data && (
        <p className="text-gdm-muted text-sm">
          {data.total} música(s) encontrada(s)
          {data.totalPages > 1 && ` · Página ${data.page} de ${data.totalPages}`}
        </p>
      )}

      {/* Track list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="bg-gdm-card border border-gdm-border rounded-2xl p-12 text-center">
          <Music className="w-10 h-10 text-gdm-muted mx-auto mb-3" />
          <p className="text-gdm-muted">
            {search ? 'Nenhuma música encontrada para esta busca.' : 'Biblioteca vazia. Sincronize para indexar suas músicas.'}
          </p>
        </div>
      ) : (
        <div className="bg-gdm-card border border-gdm-border rounded-2xl overflow-hidden">
          <ul className="divide-y divide-gdm-border">
            {data.items.map((track) => (
              <li key={track.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/2 transition-colors">
                <AlbumArt src={track.coverArt} alt={track.title} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-gdm-text text-sm font-medium truncate">{track.title}</p>
                  <p className="text-gdm-muted text-xs truncate">
                    {track.artist} {track.album !== 'Unknown Album' ? `· ${track.album}` : ''}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-xs text-gdm-muted">
                  <span className="uppercase font-mono">{track.format}</span>
                  <span className="tabular-nums">
                    {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                  </span>
                  {track.validationStatus === 'valid' ? (
                    <CheckCircle className="w-3.5 h-3.5 text-gdm-emerald" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 bg-gdm-card border border-gdm-border rounded-lg text-gdm-text text-sm disabled:opacity-50 hover:bg-white/5 transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-gdm-muted text-sm">
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="px-3 py-1.5 bg-gdm-card border border-gdm-border rounded-lg text-gdm-text text-sm disabled:opacity-50 hover:bg-white/5 transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
