import { useState, useEffect, FormEvent } from 'react';
import { Save, Megaphone } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

type SchedulerMode = 'random' | 'sequential' | 'playlist';

export default function AdminSettings() {
  const [mode, setMode] = useState<SchedulerMode>('random');
  const [avoidRepeat, setAvoidRepeat] = useState(60);
  const [crossfade, setCrossfade] = useState(3);
  const [bitrate, setBitrate] = useState(128);
  const [saving, setSaving] = useState(false);

  // Banner State
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [savingBanner, setSavingBanner] = useState(false);

  const { getToken } = useAuthStore();

  useEffect(() => {
    // Load current banner
    api.get('/api/banner').then((res) => {
      if (res.data?.data) {
        setBannerMessage(res.data.data.message || '');
        setBannerEnabled(res.data.data.enabled ?? true);
      }
    }).catch(() => {});
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      await api.patch(
        '/api/admin/config',
        {
          mode,
          avoidRepeatMinutes: avoidRepeat,
          crossfadeSeconds: crossfade,
          streamBitrate: bitrate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Configurações salvas!');
    } catch {
      toast.error('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBanner = async (e: FormEvent) => {
    e.preventDefault();
    setSavingBanner(true);
    try {
      const token = await getToken();
      await api.post(
        '/api/banner',
        { message: bannerMessage, enabled: bannerEnabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Faixa de avisos atualizada na rádio!');
    } catch {
      toast.error('Erro ao atualizar aviso.');
    } finally {
      setSavingBanner(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Broadcast Banner Manager */}
      <form onSubmit={handleSaveBanner} className="bg-gdm-card border border-gdm-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-gdm-purple" />
          <h2 className="text-gdm-text font-semibold text-lg">Faixa de Avisos e Recados Ao Vivo</h2>
        </div>
        <p className="text-gdm-muted text-xs">
          Esta mensagem é exibida no topo do site para todos os ouvintes em tempo real.
        </p>

        <div>
          <label className="block text-gdm-text text-sm font-medium mb-1">
            Mensagem do Aviso
          </label>
          <input
            type="text"
            value={bannerMessage}
            onChange={(e) => setBannerMessage(e.target.value)}
            placeholder="Ex: 🙏 Culto de Louvor e Adoração hoje às 19h30! Ouça e compartilhe."
            className="w-full bg-gdm-dark border border-gdm-border rounded-xl px-4 py-2 text-gdm-text text-sm focus:outline-none focus:ring-2 focus:ring-gdm-purple/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="banner-enabled"
            checked={bannerEnabled}
            onChange={(e) => setBannerEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-gdm-purple accent-gdm-purple"
          />
          <label htmlFor="banner-enabled" className="text-xs text-gdm-text-secondary cursor-pointer">
            Ativar exibição da faixa no topo
          </label>
        </div>

        <button
          type="submit"
          disabled={savingBanner}
          className="flex items-center gap-2 px-5 py-2 bg-gdm-purple hover:bg-gdm-purple/80 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-gdm"
        >
          <Save className="w-4 h-4" />
          {savingBanner ? 'Salvando...' : 'Atualizar Faixa de Avisos'}
        </button>
      </form>

      {/* Scheduler Configuration */}
      <form onSubmit={handleSave} className="bg-gdm-card border border-gdm-border rounded-2xl p-6 space-y-6">
        <h2 className="text-gdm-text font-semibold text-lg">Configurações da programação</h2>

        {/* Mode */}
        <div>
          <label className="block text-gdm-text text-sm font-medium mb-2">Modo de programação</label>
          <div className="grid grid-cols-3 gap-2">
            {(['random', 'sequential', 'playlist'] as SchedulerMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors ${
                  mode === m
                    ? 'bg-gdm-purple/20 border-gdm-purple text-gdm-purple'
                    : 'bg-gdm-dark border-gdm-border text-gdm-muted hover:text-gdm-text'
                }`}
              >
                {m === 'random' ? 'Aleatório' : m === 'sequential' ? 'Sequencial' : 'Playlist'}
              </button>
            ))}
          </div>
        </div>

        {/* Avoid repeat */}
        <div>
          <label className="block text-gdm-text text-sm font-medium mb-2">
            Evitar repetição (minutos)
          </label>
          <input
            type="number"
            min={0}
            max={1440}
            value={avoidRepeat}
            onChange={(e) => setAvoidRepeat(parseInt(e.target.value) || 0)}
            className="w-32 bg-gdm-dark border border-gdm-border rounded-xl px-3 py-2 text-gdm-text text-sm focus:outline-none focus:ring-2 focus:ring-gdm-purple/50"
          />
          <p className="text-gdm-muted text-xs mt-1">
            Uma música não será repetida neste intervalo (0 = sem restrição).
          </p>
        </div>

        {/* Crossfade */}
        <div>
          <label className="block text-gdm-text text-sm font-medium mb-2">
            Crossfade (segundos)
          </label>
          <input
            type="number"
            min={0}
            max={10}
            value={crossfade}
            onChange={(e) => setCrossfade(parseInt(e.target.value) || 0)}
            className="w-32 bg-gdm-dark border border-gdm-border rounded-xl px-3 py-2 text-gdm-text text-sm focus:outline-none focus:ring-2 focus:ring-gdm-purple/50"
          />
          <p className="text-gdm-muted text-xs mt-1">Pausa entre as músicas (0 = sem pausa).</p>
        </div>

        {/* Bitrate */}
        <div>
          <label className="block text-gdm-text text-sm font-medium mb-2">
            Bitrate do stream (kbps)
          </label>
          <select
            value={bitrate}
            onChange={(e) => setBitrate(parseInt(e.target.value))}
            className="bg-gdm-dark border border-gdm-border rounded-xl px-3 py-2 text-gdm-text text-sm focus:outline-none focus:ring-2 focus:ring-gdm-purple/50"
          >
            {[64, 96, 128, 192, 256, 320].map((b) => (
              <option key={b} value={b}>{b} kbps</option>
            ))}
          </select>
          <p className="text-gdm-muted text-xs mt-1">
            128 kbps é adequado para a maioria das conexões. Maior bitrate = melhor qualidade, mais banda.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gdm-purple hover:bg-gdm-purple/80 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </form>

      <div className="bg-gdm-card border border-gdm-border rounded-2xl p-5">
        <h3 className="text-gdm-text font-semibold mb-3">Informações importantes</h3>
        <ul className="space-y-2 text-gdm-muted text-sm">
          <li>• As configurações são aplicadas imediatamente ao motor de programação.</li>
          <li>• A mudança de bitrate afeta novos streams — ouvintes conectados precisarão reconectar.</li>
          <li>• Configurações são sincronizadas com o servidor de transmissão da GDM Live Radio.</li>
        </ul>
      </div>
    </div>
  );
}
