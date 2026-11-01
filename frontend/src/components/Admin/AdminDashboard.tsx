import { useEffect, useState } from 'react';
import { RefreshCw, Activity, Music, AlertTriangle, Clock, Users, Wifi } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useRadioStore } from '@/store/radioStore';
import { Spinner } from '@/components/Common/Spinner';
import toast from 'react-hot-toast';

interface SystemStatus {
  status: string;
  uptime: number;
  memoryMb: number;
  library: {
    totalTracks: number;
    validTracks: number;
    invalidTracks: number;
    totalDuration: number;
    lastSync: string | null;
    syncInProgress: boolean;
  };
  stream: {
    isLive: boolean;
    listenerCount: number;
    currentTrack: string | null;
  };
  scheduler: {
    mode: string;
    avoidRepeatWithin: number;
    crossfadeSeconds: number;
  };
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function AdminDashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { getToken } = useAuthStore();
  const { nowPlaying } = useRadioStore();

  const fetchStatus = async () => {
    try {
      const res = await api.get<{ data: SystemStatus }>('/api/status');
      setStatus(res.data.data);
    } catch {
      // Status not critical for dashboard
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const token = await getToken();
      await api.post('/api/admin/sync', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Sincronização iniciada!');
      setTimeout(fetchStatus, 3000);
    } catch {
      toast.error('Erro ao iniciar sincronização.');
    } finally {
      setSyncing(false);
    }
  };

  const handleSkip = async () => {
    try {
      const token = await getToken();
      await api.post('/api/admin/skip', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Música pulada!');
    } catch {
      toast.error('Erro ao pular música.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const lib = status?.library;
  const stream = status?.stream;

  return (
    <div className="space-y-6">
      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gdm-card border border-gdm-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wifi className="w-4 h-4 text-gdm-emerald" />
            <span className="text-gdm-muted text-xs font-medium">Transmissão</span>
          </div>
          <div className={`text-lg font-bold ${stream?.isLive ? 'text-gdm-emerald' : 'text-red-400'}`}>
            {stream?.isLive ? '● AO VIVO' : '○ Inativa'}
          </div>
          {stream?.currentTrack && (
            <p className="text-gdm-muted text-xs mt-1 truncate">{stream.currentTrack}</p>
          )}
        </div>

        <div className="bg-gdm-card border border-gdm-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-4 h-4 text-gdm-purple" />
            <span className="text-gdm-muted text-xs font-medium">Biblioteca</span>
          </div>
          <div className="text-lg font-bold text-gdm-text">{lib?.validTracks ?? '—'}</div>
          <p className="text-gdm-muted text-xs mt-1">
            músicas válidas
            {lib?.invalidTracks ? ` · ${lib.invalidTracks} inválidas` : ''}
          </p>
        </div>

        <div className="bg-gdm-card border border-gdm-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gdm-purple" />
            <span className="text-gdm-muted text-xs font-medium">Ouvintes</span>
          </div>
          <div className="text-lg font-bold text-gdm-text">{stream?.listenerCount ?? 0}</div>
          <p className="text-gdm-muted text-xs mt-1">conectados agora</p>
        </div>

        <div className="bg-gdm-card border border-gdm-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-gdm-emerald" />
            <span className="text-gdm-muted text-xs font-medium">Servidor</span>
          </div>
          <div className="text-lg font-bold text-gdm-text">
            {status ? formatUptime(status.uptime) : '—'}
          </div>
          <p className="text-gdm-muted text-xs mt-1">
            {status ? `${status.memoryMb}MB RAM` : 'indisponível'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gdm-card border border-gdm-border rounded-2xl p-5">
        <h2 className="text-gdm-text font-semibold mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSync}
            disabled={syncing || lib?.syncInProgress}
            className="flex items-center gap-2 px-4 py-2.5 bg-gdm-purple hover:bg-gdm-purple/80 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar biblioteca'}
          </button>

          <button
            onClick={handleSkip}
            disabled={!stream?.isLive}
            className="flex items-center gap-2 px-4 py-2.5 bg-gdm-card border border-gdm-border hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-gdm-text text-sm font-medium rounded-xl transition-colors"
          >
            Pular música atual
          </button>
        </div>
      </div>

      {/* Library info */}
      <div className="bg-gdm-card border border-gdm-border rounded-2xl p-5">
        <h2 className="text-gdm-text font-semibold mb-4">Biblioteca musical</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gdm-muted text-xs mb-1">Total de faixas</p>
            <p className="text-gdm-text font-medium">{lib?.totalTracks ?? '—'}</p>
          </div>
          <div>
            <p className="text-gdm-muted text-xs mb-1">Válidas</p>
            <p className="text-gdm-emerald font-medium">{lib?.validTracks ?? '—'}</p>
          </div>
          <div>
            <p className="text-gdm-muted text-xs mb-1">Duração total</p>
            <p className="text-gdm-text font-medium">
              {lib?.totalDuration ? formatDuration(lib.totalDuration) : '—'}
            </p>
          </div>
          <div>
            <p className="text-gdm-muted text-xs mb-1">Última sincronização</p>
            <p className="text-gdm-text font-medium">
              {lib?.lastSync
                ? new Date(lib.lastSync).toLocaleString('pt-BR')
                : 'Nunca'}
            </p>
          </div>
        </div>

        {lib?.invalidTracks ? (
          <div className="mt-4 flex items-center gap-2 text-yellow-400 text-sm bg-yellow-400/10 rounded-xl px-3 py-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {lib.invalidTracks} arquivo(s) inválido(s) detectado(s). Verifique a biblioteca.
          </div>
        ) : null}
      </div>

      {/* Scheduler config */}
      <div className="bg-gdm-card border border-gdm-border rounded-2xl p-5">
        <h2 className="text-gdm-text font-semibold mb-4">Programação</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gdm-muted text-xs mb-1">Modo</p>
            <p className="text-gdm-text font-medium capitalize">{status?.scheduler.mode ?? '—'}</p>
          </div>
          <div>
            <p className="text-gdm-muted text-xs mb-1">Evitar repetição</p>
            <p className="text-gdm-text font-medium">{status?.scheduler.avoidRepeatWithin ?? '—'} min</p>
          </div>
          <div>
            <p className="text-gdm-muted text-xs mb-1">Crossfade</p>
            <p className="text-gdm-text font-medium">{status?.scheduler.crossfadeSeconds ?? '—'} s</p>
          </div>
        </div>
      </div>

      {/* Now playing (from store) */}
      {nowPlaying?.track && (
        <div className="bg-gdm-card border border-gdm-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gdm-purple" />
            <h2 className="text-gdm-text font-semibold">Tocando agora</h2>
          </div>
          <p className="text-gdm-text font-medium">{nowPlaying.track.title}</p>
          <p className="text-gdm-muted text-sm">{nowPlaying.track.artist}</p>
          {nowPlaying.startedAt && (
            <p className="text-gdm-muted text-xs mt-1">
              Desde {new Date(nowPlaying.startedAt).toLocaleTimeString('pt-BR')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

