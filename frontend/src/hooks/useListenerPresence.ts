import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useRadioStore } from '@/store/radioStore';

const SESSION_KEY = 'gdm_listener_session_id';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'unknown';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'ls_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function detectDevice(): string {
  if (typeof window === 'undefined') return 'Desconhecido';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('smart-tv') || ua.includes('googletv') || ua.includes('tizen') || ua.includes('webos')) {
    return 'Smart TV';
  }
  if (/android/.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/.test(ua)) return 'iOS (Apple)';
  if (/windows/.test(ua)) return 'Windows PC';
  if (/macintosh|mac os x/.test(ua)) return 'Mac';
  if (/linux/.test(ua)) return 'Linux';
  return 'Navegador Web';
}

export function useListenerPresence() {
  const { isPlayerPlaying, nowPlaying, connectionState } = useRadioStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const listenerId = getSessionId();
    const device = detectDevice();
    const docRef = doc(db, 'active_listeners', listenerId);

    const sendHeartbeat = async (activePlaying: boolean) => {
      try {
        await setDoc(
          docRef,
          {
            id: listenerId,
            isPlaying: activePlaying,
            trackTitle: nowPlaying?.track?.title || 'Esperança Viva',
            trackArtist: nowPlaying?.track?.artist || 'Graça Digital (GDM)',
            device,
            lastSeen: serverTimestamp(),
            lastSeenMs: Date.now(),
            page: window.location.pathname,
            connectionState,
          },
          { merge: true }
        );
      } catch (err) {
        // Ignora erros de rede temporários
      }
    };

    // Pulso inicial imediato
    sendHeartbeat(isPlayerPlaying);

    // Enviar pulso a cada 20 segundos para manter status de presença quente
    const interval = setInterval(() => {
      sendHeartbeat(isPlayerPlaying);
    }, 20000);

    // Eventos de saída ou fechamento de aba
    const handleUnload = () => {
      sendHeartbeat(false);
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [isPlayerPlaying, nowPlaying?.track?.title, nowPlaying?.track?.artist, connectionState]);
}

