import { useState, useEffect } from 'react';
import { Heart, Plus, Sparkles, Send, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '@/services/api';
import type { PrayerRequest } from '@/types';

export function PrayerWallSection() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [prayedIds, setPrayedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('gdm_prayed_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [requestText, setRequestText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPrayers = async () => {
    try {
      const res = await api.get<{ success: boolean; data: PrayerRequest[] }>('/api/prayers');
      if (res.data.success) {
        setPrayers(res.data.data);
      }
    } catch (err) {
      console.error('Erro ao carregar orações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
    const interval = setInterval(fetchPrayers, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  const handlePray = async (id: string) => {
    if (prayedIds.includes(id)) return;
    try {
      const res = await api.post<{ success: boolean; data: PrayerRequest }>(`/api/prayers/${id}/pray`);
      if (res.data.success) {
        const nextPrayed = [...prayedIds, id];
        setPrayedIds(nextPrayed);
        localStorage.setItem('gdm_prayed_ids', JSON.stringify(nextPrayed));
        setPrayers((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, prayerCount: (p.prayerCount ?? p.prayedCount ?? 0) + 1 } : p
          )
        );
      }
    } catch (err) {
      console.error('Erro ao registrar oração:', err);
    }
  };

  const handleSubmitPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !requestText.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post<{ success: boolean; data: PrayerRequest }>('/api/prayers', {
        name: isAnonymous ? 'Anônimo' : name.trim(),
        city: city.trim() || 'Brasil',
        request: requestText.trim(),
        isAnonymous,
      });
      if (res.data.success) {
        setPrayers((prev) => [res.data.data, ...prev]);
        setSuccessMsg('Seu pedido foi colocado no Mural de Oração! Que Deus te abençoe.');
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
          setName('');
          setCity('');
          setRequestText('');
          setIsAnonymous(false);
        }, 2200);
      }
    } catch (err) {
      console.error('Erro ao enviar pedido de oração:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gdm-purple/20 text-gdm-purple-light border border-gdm-purple/30">
              🙏
            </span>
            <h3 className="text-xl font-bold text-gdm-text-primary">Mural de Oração</h3>
          </div>
          <p className="text-gdm-text-secondary text-sm mt-1">
            Interceda pelos irmãos e coloque sua causa diante do altar do Senhor.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gdm-purple to-purple-600 hover:from-gdm-purple-light hover:to-purple-500 text-white font-semibold text-sm shadow-gdm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Pedir Oração</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-gdm-card/60 animate-pulse border border-gdm-border" />
          ))}
        </div>
      ) : prayers.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-gdm-card border border-gdm-border text-gdm-text-muted">
          Nenhum pedido de oração registrado no momento. Seja o primeiro a compartilhar!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prayers.map((prayer) => {
            const hasPrayed = prayedIds.includes(prayer.id);
            return (
              <div
                key={prayer.id}
                className="flex flex-col justify-between p-5 rounded-xl bg-gdm-card/80 border border-gdm-border hover:border-gdm-purple/40 transition-all shadow-gdm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-gdm-text-muted">
                    <span className="font-semibold text-gdm-purple-light">
                      {prayer.isAnonymous ? 'Irmão(ã) em Cristo' : prayer.name}
                    </span>
                    <span>{prayer.city}</span>
                  </div>
                  <p className="text-sm text-gdm-text-primary leading-relaxed line-clamp-4">
                    "{prayer.request}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gdm-border/60 flex items-center justify-between">
                  <span className="text-xs text-gdm-text-muted flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-gdm-gold" />
                    {(prayer.prayerCount ?? prayer.prayedCount ?? 0)}{' '}
                    {(prayer.prayerCount ?? prayer.prayedCount ?? 0) === 1 ? 'oração' : 'orações'}
                  </span>

                  <button
                    onClick={() => handlePray(prayer.id)}
                    disabled={hasPrayed}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      hasPrayed
                        ? 'bg-gdm-emerald/20 text-gdm-emerald border border-gdm-emerald/40 cursor-default'
                        : 'bg-gdm-purple/20 text-gdm-purple-light hover:bg-gdm-purple hover:text-white border border-gdm-purple/30'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasPrayed ? 'fill-current text-gdm-emerald' : ''}`} />
                    <span>{hasPrayed ? 'Orando ✓' : 'Estou Orando'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Pedir Oração */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-gdm-card border border-gdm-border p-6 md:p-8 shadow-gdm-lg text-gdm-text-primary">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gdm-text-muted hover:text-white rounded-lg hover:bg-gdm-border/50 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-gdm-purple/20 text-gdm-purple-light border border-gdm-purple/30">
                🙏
              </span>
              <h3 className="text-xl font-bold">Enviar Pedido de Oração</h3>
            </div>
            <p className="text-sm text-gdm-text-secondary mb-6">
              "A oração de um justo é poderosa e eficaz." (Tiago 5:16)
            </p>

            {successMsg ? (
              <div className="p-6 text-center space-y-3 bg-gdm-emerald/10 border border-gdm-emerald/30 rounded-xl">
                <CheckCircle className="w-10 h-10 text-gdm-emerald mx-auto" />
                <p className="font-semibold text-gdm-emerald">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPrayer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gdm-text-secondary mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Maria Santos"
                    disabled={isAnonymous}
                    className="w-full px-4 py-2.5 rounded-xl bg-gdm-bg border border-gdm-border text-sm text-gdm-text-primary focus:outline-none focus:border-gdm-purple focus:ring-1 focus:ring-gdm-purple disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gdm-text-secondary mb-1">
                    Sua Cidade / Estado
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo / SP"
                    className="w-full px-4 py-2.5 rounded-xl bg-gdm-bg border border-gdm-border text-sm text-gdm-text-primary focus:outline-none focus:border-gdm-purple focus:ring-1 focus:ring-gdm-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gdm-text-secondary mb-1">
                    Motivo da Oração *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    placeholder="Compartilhe seu pedido de saúde, família, vida espiritual ou causas em geral..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gdm-bg border border-gdm-border text-sm text-gdm-text-primary focus:outline-none focus:border-gdm-purple focus:ring-1 focus:ring-gdm-purple resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="anon-check"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded text-gdm-purple focus:ring-gdm-purple accent-gdm-purple"
                  />
                  <label htmlFor="anon-check" className="text-xs text-gdm-text-secondary cursor-pointer flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gdm-purple-light" />
                    Manter meu nome em sigilo (Publicar como anônimo)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-gdm-purple to-purple-600 hover:from-gdm-purple-light hover:to-purple-500 text-white font-semibold text-sm shadow-gdm transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Colocando no altar...' : 'Enviar Pedido de Oração'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

