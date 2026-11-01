import { useState } from 'react';
import { Share2, X, Copy, Check, MessageCircle, Sparkles } from 'lucide-react';
import type { Track } from '@/types';

interface ShareSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  track?: Track | null;
}

export function ShareSongModal({ isOpen, onClose, track }: ShareSongModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appUrl = 'https://gdmlr.web.app/';

  // Mensagem oficial exigida pelo briefing
  const officialRadioMessage = `🎧 Já conhece a GDM Live Radio?

Uma rádio cristã com músicas autorais da Graça Digital, criadas para inspirar sua fé, fortalecer a esperança e acompanhar seus momentos com Deus.

💜 Dê o play, conheça nossas canções e compartilhe essa experiência!

🔊 Ouça agora: ${appUrl}`;

  // Se estiver com música específica
  const shareText = track
    ? `🎧 Estou ouvindo "${track.title}" na GDM Live Radio!

Uma rádio cristã com músicas autorais da Graça Digital, criadas para inspirar sua fé, fortalecer a esperança e acompanhar seus momentos com Deus.

💜 Ouça agora: ${appUrl}`
    : officialRadioMessage;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GDM Live Radio | Música, Fé e Propósito',
          text: shareText,
          url: appUrl,
        });
      } catch {
        // Usuário cancelou ou navegador não completou
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0B0D17] border border-[#1C223A] p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1C223A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7000FF] to-[#FFC928] flex items-center justify-center shadow-lg shadow-[#7000FF]/30">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Compartilhar a Rádio</h3>
              <p className="text-xs text-[#7A839E]">Espalhe essa mensagem de fé e propósito</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A839E] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Visual de Prévia Social */}
        <div className="my-4 rounded-xl overflow-hidden border border-[#1C223A] bg-[#07070D]">
          <div className="relative aspect-[1.91/1] w-full bg-[#05050A] overflow-hidden">
            <img
              src="/images/og-share-preview.jpg"
              alt="GDM Live Radio - Prévia Oficial"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <div>
                <p className="text-[11px] font-bold text-[#FFC928] uppercase tracking-wider">Prévia no WhatsApp & Redes</p>
                <p className="text-xs font-semibold text-white">GDM Live Radio | Música, Fé e Propósito</p>
              </div>
            </div>
          </div>
          <div className="p-3 text-xs space-y-1">
            <p className="text-[#C9C9D4] leading-relaxed line-clamp-3">
              "🎧 Uma rádio cristã com músicas autorais da Graça Digital, criadas para inspirar sua fé, fortalecer a esperança..."
            </p>
            <p className="text-[11px] text-[#7000FF] font-medium pt-1">https://gdmlr.web.app/</p>
          </div>
        </div>

        {/* Sharing Options */}
        <div className="space-y-2.5">
          {/* Botão de Destaque WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm transition-all shadow-lg shadow-[#25D366]/20 active:scale-[0.99]"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Compartilhar no WhatsApp</span>
          </button>

          {/* Web Share API (se suportado no celular) ou Copiar */}
          <div className="grid grid-cols-2 gap-2">
            {'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#1C223A] text-white font-medium text-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#FFC928]" />
                <span>Outros Apps</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-medium text-xs transition-all ${
                'share' in navigator ? '' : 'col-span-2 py-3'
              } ${
                copied
                  ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]'
                  : 'bg-white/5 hover:bg-white/10 border-[#1C223A] text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Copiado com sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#7A839E]" />
                  <span>Copiar Mensagem</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-[#7A839E]">
          Músicas autorais independentes • Graça Digital (GDM)
        </p>
      </div>
    </div>
  );
}
