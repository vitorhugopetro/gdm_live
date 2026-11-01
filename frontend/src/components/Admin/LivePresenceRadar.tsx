import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Activity, Headphones, Smartphone, Monitor, Tv, Music, Globe, RefreshCw } from 'lucide-react';

interface ActiveListenerData {
  id: string;
  isPlaying: boolean;
  trackTitle: string;
  trackArtist: string;
  device: string;
  lastSeenMs?: number;
  page?: string;
  connectionState?: string;
}

export function LivePresenceRadar() {
  const [listeners, setListeners] = useState<ActiveListenerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta em tempo real da coleção active_listeners do Firestore
    const q = query(collection(db, 'active_listeners'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const now = Date.now();
        // Consideramos ativo quem enviou sinal nos últimos 60 segundos
        const activeList: ActiveListenerData[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as ActiveListenerData;
          if (data.lastSeenMs && now - data.lastSeenMs < 60000) {
            activeList.push(data);
          }
        });
        setListeners(activeList);
        setLoading(false);
      },
      (error) => {
        console.warn('Erro ao conectar ao radar em tempo real:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const currentlyPlayingCount = listeners.filter((l) => l.isPlaying).length;

  const getDeviceIcon = (device: string) => {
    const d = device.toLowerCase();
    if (d.includes('tv')) return <Tv className="w-4 h-4 text-[#FFC928]" />;
    if (d.includes('android') || d.includes('ios') || d.includes('apple')) {
      return <Smartphone className="w-4 h-4 text-[#7000FF]" />;
    }
    return <Monitor className="w-4 h-4 text-[#10B981]" />;
  };

  return (
    <div className="bg-[#0E1020] border border-[#1C223A] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Luz ambiente de fundo */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#10B981]/10 blur-[80px] pointer-events-none" />

      {/* Header do Radar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1C223A]">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30">
            <Activity className="w-5 h-5 text-[#10B981] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              Radar de Presença em Tempo Real
            </h2>
            <p className="text-[#7A839E] text-xs">
              Conexões ativas detectadas via satélite/stream Firestore
            </p>
          </div>
        </div>

        {/* Badges de Contagem */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#07070D] border border-[#1C223A] flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs text-[#C9C9D4]">Ouvindo Agora:</span>
            <span className="text-sm font-black text-white">{currentlyPlayingCount}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-[#07070D] border border-[#1C223A] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#7000FF]" />
            <span className="text-xs text-[#C9C9D4]">No Site:</span>
            <span className="text-sm font-black text-white">{listeners.length}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="pt-6">
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-3 text-[#7A839E] text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#7000FF]" />
            <span>Sintonizando radar ao vivo...</span>
          </div>
        ) : listeners.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl bg-[#07070D]/50 border border-[#1C223A]">
            <p className="text-[#C9C9D4] font-medium text-sm">
              Nenhum ouvinte conectado neste exato segundo.
            </p>
            <p className="text-[#7A839E] text-xs mt-1">
              Assim que alguém abrir o site ou der Play em qualquer lugar do mundo, aparecerá aqui instantaneamente!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-bold text-[#FFC928] uppercase tracking-wider mb-2">
              Ouvintes ao Vivo ({listeners.length})
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {listeners.map((listener) => (
                <div
                  key={listener.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#07070D] border border-[#1C223A] hover:border-[#7000FF]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#121626] border border-[#1C223A] flex-shrink-0">
                      {getDeviceIcon(listener.device)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-xs font-bold truncate">
                          {listener.device}
                        </span>
                        <span className="text-[10px] text-[#7A839E]">
                          • {listener.page === '/' ? 'Página Principal' : listener.page}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#C9C9D4] truncate mt-0.5">
                        <Music className="w-3 h-3 text-[#FFC928] flex-shrink-0" />
                        <span className="truncate">{listener.trackTitle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex-shrink-0 ml-3">
                    {listener.isPlaying ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                        Ouvindo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7A839E]/15 border border-[#7A839E]/30 text-[#7A839E] text-[10px]">
                        Navegando
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

