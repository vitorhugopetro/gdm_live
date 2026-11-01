import { useState, useEffect } from 'react';
import { useRadioStore } from '@/store/radioStore';
import RecentlyPlayed from '@/components/History/RecentlyPlayed';
import { AlbumArt } from '@/components/NowPlaying/AlbumArt';
import { SongRequestModal } from '@/components/Community/SongRequestModal';
import { api } from '@/services/api';
import type { Track, ApiResponse, PaginatedResponse } from '@/types';
import {
  ListMusic,
  Clock,
  Music,
  Heart,
  Search,
  Send,
  Sparkles,
} from 'lucide-react';

export default function ProgramPage() {
  const { upcomingTracks, nowPlaying, favorites, toggleFavorite } = useRadioStore();

  const [activeTab, setActiveTab] = useState<'catalog' | 'favorites' | 'upcoming' | 'history'>('catalog');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTracks, setTotalTracks] = useState(402);

  // Selected track for song request modal
  const [requestTrack, setRequestTrack] = useState<Track | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Fetch catalog tracks
  useEffect(() => {
    let isCancelled = false;
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await api.get<ApiResponse<PaginatedResponse<Track>>>('/api/library', {
          params: { page, pageSize: 24, search: search.trim() },
        });
        if (!isCancelled && res.data?.data) {
          setTracks(res.data.data.items);
          setTotalPages(res.data.data.totalPages);
          setTotalTracks(res.data.data.total);
        }
      } catch (err) {
        console.error('Erro ao buscar acervo:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      isCancelled = true;
    };
  }, [page, search]);

  const handleOpenRequest = (track: Track) => {
    setRequestTrack(track);
    setIsRequestModalOpen(true);
  };

  const favoriteTracks = tracks.filter((t) => favorites.includes(t.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gdm-text-primary flex items-center gap-2">
            <Music className="w-8 h-8 text-gdm-purple" />
            Louvores & Programação
          </h1>
          <p className="text-gdm-text-secondary text-sm mt-1">
            Explore os 402 louvores originais, salve seus favoritos e peça sua música na transmissão.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 rounded-xl bg-gdm-card border border-gdm-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'catalog'
                ? 'bg-gdm-purple text-white shadow-gdm'
                : 'text-gdm-text-muted hover:text-white'
            }`}
          >
            Acervo ({totalTracks})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'favorites'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'text-gdm-text-muted hover:text-rose-400'
            }`}
          >
            <Heart className="w-3 h-3 fill-current" />
            <span>Favoritos ({favorites.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-gdm-emerald/20 text-gdm-emerald border border-gdm-emerald/30'
                : 'text-gdm-text-muted hover:text-white'
            }`}
          >
            Fila Ao Vivo
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-gdm-card border border-gdm-border text-white'
                : 'text-gdm-text-muted hover:text-white'
            }`}
          >
            Histórico
          </button>
        </div>
      </div>

      {/* TAB 1: ACERVO COMPLETO */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-gdm-text-muted" />
            <input
              type="text"
              placeholder="Buscar por título do louvor ou artista..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gdm-card border border-gdm-border text-sm text-gdm-text-primary focus:outline-none focus:border-gdm-purple focus:ring-1 focus:ring-gdm-purple shadow-gdm"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-gdm-card/60 animate-pulse border border-gdm-border" />
              ))}
            </div>
          ) : tracks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-gdm-card border border-gdm-border text-gdm-text-muted">
              Nenhum louvor encontrado para "{search}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map((track) => {
                const isFav = favorites.includes(track.id);
                return (
                  <div
                    key={track.id}
                    className="p-4 rounded-2xl bg-gdm-card/80 border border-gdm-border hover:border-gdm-purple/40 transition-all flex items-center justify-between gap-3 shadow-gdm group"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-gdm-text-primary truncate group-hover:text-gdm-purple-light transition-colors">
                        {track.title}
                      </h4>
                      <p className="text-xs text-gdm-text-muted truncate mt-0.5">{track.artist}</p>
                      <span className="text-[10px] text-gdm-text-muted tabular-nums mt-1 block">
                        {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')} min
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleFavorite(track.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isFav
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                            : 'bg-gdm-bg/80 border-gdm-border text-gdm-text-muted hover:text-rose-400'
                        }`}
                        title={isFav ? 'Remover dos favoritos' : 'Favoritar'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleOpenRequest(track)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gdm-purple/20 hover:bg-gdm-purple hover:text-white text-gdm-purple-light border border-gdm-purple/30 text-xs font-semibold transition-all"
                        title="Pedir este louvor na rádio"
                      >
                        <Send className="w-3 h-3" />
                        <span>Pedir</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl bg-gdm-card border border-gdm-border text-xs font-semibold text-gdm-text-secondary hover:text-white disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-xs text-gdm-text-muted">
                Página {page} de {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl bg-gdm-card border border-gdm-border text-xs font-semibold text-gdm-text-secondary hover:text-white disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEUS FAVORITOS */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <Heart className="w-4 h-4 fill-current text-rose-400 flex-shrink-0" />
            <span>
              Você tem <strong>{favorites.length}</strong> louvor(es) marcado(s) como favorito(s). Eles são guardados no seu navegador.
            </span>
          </div>

          {favorites.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-gdm-card border border-gdm-border text-gdm-text-muted space-y-2">
              <Heart className="w-8 h-8 text-gdm-text-muted mx-auto opacity-50" />
              <p>Você ainda não favoritou nenhum louvor.</p>
              <p className="text-xs">Clique no coração de qualquer música no acervo para salvar aqui!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteTracks.map((track) => (
                <div
                  key={track.id}
                  className="p-4 rounded-2xl bg-gdm-card/80 border border-rose-500/30 flex items-center justify-between gap-3 shadow-gdm"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-gdm-text-primary truncate">{track.title}</h4>
                    <p className="text-xs text-gdm-text-muted truncate mt-0.5">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => toggleFavorite(track.id)}
                      className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400"
                      title="Remover dos favoritos"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => handleOpenRequest(track)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gdm-purple/20 hover:bg-gdm-purple hover:text-white text-gdm-purple-light border border-gdm-purple/30 text-xs font-semibold transition-all"
                    >
                      <Send className="w-3 h-3" />
                      <span>Pedir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FILA AO VIVO */}
      {activeTab === 'upcoming' && (
        <section aria-labelledby="upcoming-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-gdm-purple" />
            <h2 id="upcoming-heading" className="text-gdm-text font-semibold text-lg">
              Próximas músicas programadas
            </h2>
          </div>

          {upcomingTracks.length === 0 ? (
            <div className="bg-gdm-card rounded-2xl border border-gdm-border p-8 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-gdm-gold mx-auto" />
              <p className="text-gdm-text-primary text-sm font-semibold">
                Modo Aleatório Inteligente Ativo
              </p>
              <p className="text-gdm-muted text-xs max-w-md mx-auto">
                A rádio seleciona os louvores dinamicamente entre os 402 títulos do acervo para manter uma transmissão rica e sem repetições.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {upcomingTracks.map((track, index) => (
                <li
                  key={track.id}
                  className="bg-gdm-card border border-gdm-border rounded-xl p-3.5 flex items-center gap-3 shadow-gdm"
                >
                  <span className="text-gdm-muted text-sm w-5 text-right font-bold">{index + 1}</span>
                  <AlbumArt track={track} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gdm-text text-sm font-semibold truncate">{track.title}</p>
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
      )}

      {/* TAB 4: HISTÓRICO COMPLETO */}
      {activeTab === 'history' && (
        <section aria-labelledby="history-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gdm-emerald" />
            <h2 id="history-heading" className="text-gdm-text font-semibold text-lg">
              Histórico das últimas faixas tocadas
            </h2>
          </div>
          <RecentlyPlayed limit={50} />
        </section>
      )}

      {/* Modal de Pedido de Louvor */}
      <SongRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        track={requestTrack}
      />
    </div>
  );
}
