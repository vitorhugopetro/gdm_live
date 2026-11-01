import { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { useRadioStore } from '@/store/radioStore';

export function BroadcastBannerBar() {
  const { banner } = useRadioStore();
  const [dismissed, setDismissed] = useState(false);

  const isVisible = banner ? (banner.active ?? banner.enabled ?? true) : false;
  if (!banner || !isVisible || !banner.message || dismissed) {
    return null;
  }

  return (
    <aside aria-label="Aviso da rádio" className="relative bg-gradient-to-r from-gdm-purple/90 via-purple-800/90 to-gdm-emerald/90 text-white shadow-gdm border-b border-gdm-purple-light/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex items-center justify-between gap-4 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0 inline-flex items-center justify-center p-1 rounded-full bg-white/20 text-white">
            <Megaphone className="w-3.5 h-3.5" />
          </span>
          <span className="truncate">{banner.message}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors"
          aria-label="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

