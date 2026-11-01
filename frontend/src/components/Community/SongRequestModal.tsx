import { useState, useEffect } from 'react';
import { Music, X, Send, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { api } from '@/services/api';
import type { Track, ApiResponse, PaginatedResponse } from '@/types';

interface SongRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  track?: Track | null;
  onSuccess?: () => void;
}

export function SongRequestModal({
  isOpen,
  onClose,
  track: initialTrack,
  onSuccess,
}: SongRequestModalProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(initialTrack || null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    if (initialTrack) {
      setSelectedTrack(initialTrack);
    }
  }, [initialTrack]);

  // Search tracks if none selected or searching
  useEffect(() => {
    if (selectedTrack) return;
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await api.get<ApiResponse<PaginatedResponse<Track>>>('/api/library', {
          params: { search: searchQuery, pageSize: 20 },
        });
        if (res.data?.data?.items) {
          setSearchResults(res.data.data.items);
        }
      } catch {
        // ignore
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedTrack]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrack) {
      setMessage({ text: 'Por favor, selecione um louvor.', error: true });
      return;
    }
    if (!name.trim()) {
      setMessage({ text: 'Por favor, informe seu nome.', error: true });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post<ApiResponse<{ message: string }>>('/api/requests', {
        trackId: selectedTrack.id,
        requesterName: name.trim(),
        requesterCity: city.trim() || 'Brasil',
      });

      const resData = res.data;
      const successMsg = resData?.data?.message || 'Pedido de louvor registrado com sucesso!';
      setMessage({ text: successMsg, error: false });
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setName('');
        setCity('');
        setMessage(null);
        if (!initialTrack) setSelectedTrack(null);
      }, 2500);
    } catch (err: any) {
      const errText = err.response?.data?.error || 'Não foi possível registrar seu pedido agora.';
      setMessage({ text: errText, error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="song-request-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-gdm-card border border-gdm-border p-6 shadow-gdm-lg text-gdm-text-primary">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gdm-text-muted hover:text-white rounded-lg hover:bg-gdm-border/50 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-gdm-purple/20 text-gdm-purple-light border border-gdm-purple/30">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h2 id="song-request-modal-title" className="text-xl font-bold">
              Pedir um Louvor
            </h2>
            <p className="text-xs text-gdm-text-muted">
              Sua música entrará na programação da rádio com sua dedicatória!
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
              message.error
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                : 'bg-gdm-emerald/10 border border-gdm-emerald/30 text-gdm-emerald'
            }`}
          >
            {message.error ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Selected Track or Selector */}
          <div>
            <label className="block text-xs font-semibold text-gdm-text-secondary mb-1">
              Louvor Escolhido *
            </label>
            {selectedTrack ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-gdm-bg border border-gdm-purple/40">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{selectedTrack.title}</p>
                  <p className="text-xs text-gdm-purple-light truncate">{selectedTrack.artist}</p>
                </div>
                {!initialTrack && (
                  <button
                    type="button"
                    onClick={() => setSelectedTrack(null)}
                    className="text-xs text-gdm-text-muted hover:text-white px-2 py-1 rounded bg-gdm-card border border-gdm-border"
                  >
                    Trocar
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gdm-text-muted" />
                  <input
                    type="text"
                    placeholder="Pesquisar entre os 402 louvores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-gdm-bg border border-gdm-border text-white focus:outline-none focus:border-gdm-purple"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 rounded-xl border border-gdm-border p-1 bg-gdm-bg/50">
                  {searchLoading ? (
                    <p className="text-xs text-gdm-text-muted p-2 text-center">Buscando louvores...</p>
                  ) : searchResults.length === 0 ? (
                    <p className="text-xs text-gdm-text-muted p-2 text-center">Nenhum louvor encontrado</p>
                  ) : (
                    searchResults.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTrack(t)}
                        className="w-full text-left p-2 rounded-lg hover:bg-gdm-purple/20 text-xs flex justify-between items-center transition-colors"
                      >
                        <span className="font-semibold text-white truncate">{t.title}</span>
                        <span className="text-gdm-text-muted text-[11px] ml-2 flex-shrink-0">{t.artist}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gdm-text-secondary mb-1">
                Seu Nome *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Gabriel Souza"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gdm-bg border border-gdm-border text-white focus:outline-none focus:border-gdm-purple"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gdm-text-secondary mb-1">
                Sua Cidade / UF
              </label>
              <input
                type="text"
                placeholder="Ex: Rio de Janeiro / RJ"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gdm-bg border border-gdm-border text-white focus:outline-none focus:border-gdm-purple"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedTrack}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-gdm-purple to-purple-600 hover:from-gdm-purple-light hover:to-purple-500 text-white font-semibold text-sm shadow-gdm transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Enviando Pedido...' : 'Confirmar Pedido de Louvor'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
