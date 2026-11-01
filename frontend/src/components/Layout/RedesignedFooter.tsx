import { Heart, Activity, Youtube, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RedesignedFooter() {
  return (
    <footer className="bg-[#05050A] border-t border-[#1C223A] pt-8 pb-12 text-xs text-[#7A839E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Linha Principal da Imagem de Referência */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-4 border-b border-[#1C223A]/80">
          {/* Lado Esquerdo: Identificação Rádio GDM */}
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Activity className="w-4 h-4 text-[#FFC928]" />
            <span>Rádio GDM — Graça Digital</span>
          </div>

          {/* Centro: Frase de Fé + Ícones de Redes Sociais */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-[#C9C9D4]">
              <Heart className="w-4 h-4 text-[#FFC928] fill-current" />
              <span>Uma rádio feita com fé, para você!</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0E1020] border border-[#1C223A] flex items-center justify-center text-[#C9C9D4] hover:text-[#FFC928] hover:border-[#FFC928] transition-all"
                aria-label="YouTube da Graça Digital"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0E1020] border border-[#1C223A] flex items-center justify-center text-[#C9C9D4] hover:text-[#FFC928] hover:border-[#FFC928] transition-all"
                aria-label="Instagram da Graça Digital"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0E1020] border border-[#1C223A] flex items-center justify-center text-[#C9C9D4] hover:text-[#FFC928] hover:border-[#FFC928] transition-all"
                aria-label="Facebook da Graça Digital"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Lado Direito: Saudação Dourada Cursiva */}
          <div className="text-center md:text-right">
            <span className="font-serif italic text-2xl text-[#FFC928] drop-shadow-[0_2px_8px_rgba(255,201,40,0.4)]">
              Deus abençoe você!
            </span>
          </div>
        </div>

        {/* Linha Secundária: Links e Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Graça Digital (GDM). Todos os direitos reservados. Músicas autorais independentes.</p>
          <div className="flex items-center gap-4">
            <Link to="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link>
            <Link to="/programacao" className="hover:text-white transition-colors">Grade 402 Músicas</Link>
            <Link to="/comunidade" className="hover:text-white transition-colors">Mural de Oração</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

