import { useEffect } from 'react';
import { X, Keyboard, Radio, Volume2, Tv2 } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

const shortcuts = [
  { key: 'Espaço', desc: 'Play / Pausar transmissão' },
  { key: 'M', desc: 'Silenciar / Ativar som' },
  { key: 'N', desc: 'Próxima faixa' },
  { key: 'P', desc: 'Faixa anterior' },
  { key: 'Ctrl + ↑', desc: 'Aumentar volume' },
  { key: 'Ctrl + ↓', desc: 'Diminuir volume' },
  { key: 'I', desc: 'Modo imersivo (player em tela cheia)' },
  { key: 'T', desc: 'Alternar Modo TV' },
  { key: '?', desc: 'Abrir / Fechar esta ajuda' },
  { key: 'Esc', desc: 'Fechar modais e menus' },
];

export function HelpModal({ onClose }: HelpModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Trap focus within modal
  useEffect(() => {
    const prev = document.activeElement as HTMLElement;
    return () => prev?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ajuda e atalhos de teclado"
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-animate-in w-full max-w-lg bg-[#0B0B16] border border-[#1C223A] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1C223A]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#FFC928]" />
            <h2 className="text-white font-bold text-lg">Atalhos e Ajuda</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A839E] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar ajuda"
            autoFocus
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Shortcuts */}
          <div>
            <h3 className="text-[#FFC928] font-semibold text-sm uppercase tracking-wider mb-3">
              Atalhos de teclado
            </h3>
            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-4">
                  <kbd className="shrink-0 px-2.5 py-1 rounded-lg bg-[#0E1020] border border-[#2A3050] text-[#FFC928] font-mono text-xs font-bold">
                    {s.key}
                  </kbd>
                  <span className="text-[#C9C9D4] text-sm text-right">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick info */}
          <div className="space-y-3">
            <h3 className="text-[#FFC928] font-semibold text-sm uppercase tracking-wider">
              Dicas rápidas
            </h3>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0E1020] border border-[#1C223A]">
              <Radio className="w-4 h-4 text-[#7000FF] shrink-0 mt-0.5" />
              <p className="text-[#C9C9D4] text-sm">
                A GDM Live Radio toca 24 horas sem parar com louvores autorais da Graça Digital. O áudio funciona diretamente no navegador sem precisar de aplicativo.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0E1020] border border-[#1C223A]">
              <Volume2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <p className="text-[#C9C9D4] text-sm">
                Se o som não iniciar automaticamente, clique em <strong className="text-white">Ouvir Agora</strong> no player principal. Isso ativa o áudio respeitando as políticas do navegador.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0E1020] border border-[#1C223A]">
              <Tv2 className="w-4 h-4 text-[#FFC928] shrink-0 mt-0.5" />
              <p className="text-[#C9C9D4] text-sm">
                O <strong className="text-white">Modo TV</strong> adapta a interface para Smart TVs e projetores: margens de segurança, botões maiores e navegação por controle remoto (teclas de seta).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1C223A] text-center">
          <p className="text-[#7A839E] text-xs">
            GDM Live Radio · <a href="https://gdmlr.web.app" className="text-[#7000FF] hover:underline">gdmlr.web.app</a>
          </p>
        </div>
      </div>
    </div>
  );
}

