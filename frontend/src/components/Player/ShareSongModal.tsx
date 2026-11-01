import { useState } from 'react';
import { Share2, X, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';
import type { Track } from '@/types';

interface ShareSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
}

export function ShareSongModal({ isOpen, onClose, track }: ShareSongModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !track) return null;

  const appUrl = 'https://gdmlr.web.app';
  const shareText = `Estou ouvindo "${track.title}" de ${track.artist} na GDM Live Radio — 24 horas de louvores abençoados! 🎶✨ Ouça você também: ${appUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0f1423] border border-white/10 p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gdm-purple/20 text-gdm-purple">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Compartilhar Louvor</h3>
              <p className="text-xs text-gdm-text-muted">Espalhe a bênção com seus amigos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gdm-text-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Preview */}
        <div className="my-4 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gdm-purple/30 flex-shrink-0 flex items-center justify-center font-bold text-sm text-gdm-emerald">
            GDM
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm text-white truncate">{track.title}</h4>
            <p className="text-xs text-gdm-text-muted truncate">{track.artist}</p>
          </div>
        </div>

        {/* Sharing Options */}
        <div className="space-y-2.5">
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 font-medium text-sm transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Compartilhar no WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-gdm-emerald" />
                <span className="text-gdm-emerald">Mensagem copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gdm-text-muted" />
                <span>Copiar Mensagem e Link</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gdm-text-muted">
          "Ide por todo o mundo e pregai o evangelho a toda criatura." — Mc 16:15
        </p>
      </div>
    </div>
  );
}

