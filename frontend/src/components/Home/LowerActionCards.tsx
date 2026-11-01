import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Music2, ArrowRight } from 'lucide-react';
import { VisualizerCanvas } from '@/components/Player/VisualizerCanvas';
import { SongRequestModal } from '@/components/Community/SongRequestModal';

export function LowerActionCards() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* CARD 1: Programação da Rádio */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E1020] to-[#07070D] border border-[#1C223A] hover:border-[#7000FF]/50 p-6 shadow-xl flex flex-col justify-between group transition-all duration-300">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FFC928]" />
                <h3 className="font-extrabold text-white text-base">
                  Programação da Rádio
                </h3>
              </div>
              <Link
                to="/programacao"
                className="text-xs text-[#9B4DFF] hover:text-white transition-colors flex items-center gap-1 font-semibold"
              >
                <span>Ver Grade Completa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Badge AO VIVO e Título */}
            <div className="flex items-center gap-3 pt-2">
              <span className="px-3.5 py-1 rounded-full bg-[#7000FF] text-white text-[11px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(112,0,255,0.7)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                AO VIVO
              </span>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-white truncate">GDM Live Radio</h4>
                <p className="text-xs text-[#C9C9D4] truncate">
                  Música, fé e inspiração, 24 horas com você!
                </p>
              </div>
            </div>
          </div>

          {/* Visualizador Espectral em Neon Violeta */}
          <div className="mt-6 pt-4 border-t border-[#1C223A]">
            <VisualizerCanvas barCount={32} />
          </div>
        </div>

        {/* CARD 2: Sobre a GDM (Com Bíblia Sagrada Iluminada Hiper-Realista) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E1020] to-[#07070D] border border-[#1C223A] hover:border-[#FFC928]/50 p-6 shadow-xl flex flex-col justify-between group transition-all duration-300">
          <div className="grid grid-cols-12 gap-3 items-start">
            <div className="col-span-8 space-y-2.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FFC928]" />
                <h3 className="font-extrabold text-white text-base">
                  Sobre a GDM
                </h3>
              </div>

              <p className="text-xs sm:text-xs text-[#C9C9D4] leading-relaxed line-clamp-4">
                A <strong>Graça Digital (GDM)</strong> é uma produção musical independente, criada com fé, criatividade e propósito. Nossa rádio transmite exclusivamente músicas autorais para levar esperança e renovação.
              </p>
            </div>

            {/* Imagem Hiper-Realista da Bíblia Aberta com Raios de Ouro */}
            <div className="col-span-4 flex items-center justify-center">
              <div className="relative rounded-xl overflow-hidden border border-[#FFC928]/40 shadow-[0_0_20px_rgba(255,201,40,0.4)] group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/card-bible-realistic.jpg"
                  alt="Bíblia Sagrada Aberta com Luz Celestial"
                  className="w-full h-24 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="mt-5 pt-4 border-t border-[#1C223A] flex items-center justify-between">
            <span className="text-[11px] text-[#FFE58F] font-bold tracking-wide">
              Palavra & Fé
            </span>

            <Link
              to="/sobre"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1C223A] hover:bg-[#FFC928] hover:text-[#07070D] text-white text-xs font-bold transition-all duration-200"
            >
              <span>Saiba Mais</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* CARD 3: Faça Seu Pedido (Com Fone de Ouvido Neon Studio Hiper-Realista) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E1020] to-[#120B24] border border-[#1C223A] hover:border-[#7000FF]/50 p-6 shadow-xl flex flex-col justify-between group transition-all duration-300">
          <div className="grid grid-cols-12 gap-3 items-start">
            <div className="col-span-8 space-y-2.5">
              <div className="flex items-center gap-2">
                <Music2 className="w-5 h-5 text-[#FFC928]" />
                <h3 className="font-extrabold text-white text-base">
                  Faça Seu Pedido
                </h3>
              </div>

              <p className="text-xs sm:text-xs text-[#C9C9D4] leading-relaxed">
                Peça sua música favorita e compartilhe conosco sua mensagem de carinho e edificação!
              </p>
            </div>

            {/* Imagem Hiper-Realista do Fone de Ouvido Neon Purple */}
            <div className="col-span-4 flex items-center justify-center">
              <div className="relative rounded-xl overflow-hidden border border-[#7000FF]/40 shadow-[0_0_20px_rgba(112,0,255,0.4)] group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/card-headphones-realistic.jpg"
                  alt="Fones de Ouvido Studio Neon Violeta"
                  className="w-full h-24 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Botão Pedir Música */}
          <div className="mt-5 pt-4 border-t border-[#1C223A] flex items-center justify-between">
            <span className="text-[11px] text-[#9B4DFF] font-bold">
              No Ar 24h
            </span>

            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#7000FF] hover:bg-[#851EFF] text-white text-xs font-bold shadow-[0_0_20px_rgba(112,0,255,0.6)] transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <span>Pedir Música</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <SongRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </>
  );
}
