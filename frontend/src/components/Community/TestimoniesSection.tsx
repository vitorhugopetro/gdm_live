import { useState, useEffect } from 'react';
import { Award, Plus, Send, X, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import type { Testimony } from '@/types';

export function TestimoniesSection() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [story, setStory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchTestimonies = async () => {
    try {
      const res = await api.get<{ success: boolean; data: Testimony[] }>('/api/testimonies');
      if (res.data.success) {
        setTestimonies(res.data.data);
      }
    } catch (err) {
      console.error('Erro ao buscar testemunhos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonies();
    const interval = setInterval(fetchTestimonies, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmitTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !story.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post<{ success: boolean; data: Testimony }>('/api/testimonies', {
        name: name.trim(),
        city: city.trim() || 'Brasil',
        story: story.trim(),
      });
      if (res.data.success) {
        setTestimonies((prev) => [res.data.data, ...prev]);
        setSuccessMsg('Glória a Deus! Seu testemunho edifica muitas vidas.');
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
          setName('');
          setCity('');
          setStory('');
        }, 2200);
      }
    } catch (err) {
      console.error('Erro ao enviar testemunho:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gdm-gold/20 text-gdm-gold border border-gdm-gold/30">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-bold text-gdm-text-primary">Mural de Testemunhos</h3>
          </div>
          <p className="text-gdm-text-secondary text-sm mt-1">
            "Contai entre as nações a sua glória, entre todos os povos as suas maravilhas." (Salmos 96:3)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gdm-gold to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold text-sm shadow-gdm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Contar Testemunho</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-gdm-card/60 animate-pulse border border-gdm-border" />
          ))}
        </div>
      ) : testimonies.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-gdm-card border border-gdm-border text-gdm-text-muted">
          Nenhum testemunho compartilhado ainda. Conte o que o Senhor fez por você!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonies.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-gradient-to-br from-gdm-card via-[#0F172A] to-[#0A0F1D] border border-gdm-border hover:border-gdm-gold/40 transition-all shadow-gdm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-gdm-gold">{item.name}</h4>
                    <p className="text-xs text-gdm-text-muted">{item.city}</p>
                  </div>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-gdm-gold/10 text-gdm-gold border border-gdm-gold/20">
                    Milagre & Vitória
                  </span>
                </div>
                <blockquote className="text-sm text-gdm-text-primary italic leading-relaxed">
                  "{item.testimony || item.story}"
                </blockquote>
              </div>

              <div className="mt-4 pt-3 border-t border-gdm-border/40 text-right">
                <span className="text-xs text-gdm-text-muted">
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Contar Testemunho */}
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
              <span className="p-2 rounded-xl bg-gdm-gold/20 text-gdm-gold border border-gdm-gold/30">
                ✨
              </span>
              <h3 className="text-xl font-bold">Compartilhar Testemunho</h3>
            </div>
            <p className="text-sm text-gdm-text-secondary mb-6">
              Conte a bênção, a cura ou o livramento que Deus concedeu à sua vida.
            </p>

            {successMsg ? (
              <div className="p-6 text-center space-y-3 bg-gdm-emerald/10 border border-gdm-emerald/30 rounded-xl">
                <CheckCircle className="w-10 h-10 text-gdm-emerald mx-auto" />
                <p className="font-semibold text-gdm-emerald">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTestimony} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gdm-text-secondary mb-1">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Pastor Marcos ou Irmã Débora"
                    className="w-full px-4 py-2.5 rounded-xl bg-gdm-bg border border-gdm-border text-sm text-gdm-text-primary focus:outline-none focus:border-gdm-gold focus:ring-1 focus:ring-gdm-gold"
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
                    placeholder="Ex: Belo Horizonte / MG"
                    className="w-full px-4 py-2.5 rounded-xl bg-gdm-bg border border-gdm-border text-sm text-gdm-text-primary focus:outline-none focus:border-gdm-gold focus:ring-1 focus:ring-gdm-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gdm-text-secondary mb-1">
                    O que Deus fez na sua vida? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Conte como Deus agiu, respondeu à sua oração e transformou a situação..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gdm-bg border border-gdm-border text-sm text-gdm-text-primary focus:outline-none focus:border-gdm-gold focus:ring-1 focus:ring-gdm-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-gdm-gold to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold text-sm shadow-gdm transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Publicando...' : 'Publicar Testemunho'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

