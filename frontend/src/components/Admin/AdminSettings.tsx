import { useState, FormEvent } from 'react';
import { Save } from 'lucide-react';
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
  const { getToken } = useAuthStore();

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

  return (
    <div className="max-w-2xl space-y-6">
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
          <p className="text-gdm-muted text-xs mt-1.5">
            {mode === 'random'
              ? 'Músicas selecionadas aleatoriamente, evitando repetições recentes.'
              : mode === 'sequential'
              ? 'Músicas reproduzidas em sequência, na ordem da biblioteca.'
              : 'Músicas reproduzidas em uma lista definida.'}
          </p>
        </div>

        {/* Avoid repeat */}
        <div>
          <label className="block text-gdm-text text-sm font-medium mb-2">
            Evitar repetição por (minutos)
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
          <li>• Configurações não são persistidas após reinicialização do servidor nesta versão.</li>
          <li>• Para configurações permanentes, edite o arquivo <code className="text-gdm-purple">.env</code> do servidor.</li>
        </ul>
      </div>
    </div>
  );
}

