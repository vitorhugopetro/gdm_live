import { Radio, Music2 } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export default function AboutSection({ compact = false }: Props) {
  return (
    <section
      className={`bg-gdm-card border border-gdm-border rounded-2xl overflow-hidden ${compact ? 'p-6' : 'p-8'}`}
      aria-labelledby="about-heading"
    >
      <div className={`flex ${compact ? 'flex-col sm:flex-row' : 'flex-col'} gap-6 items-start`}>
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gdm-purple to-gdm-emerald flex items-center justify-center shadow-xl">
            <Radio className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 id="about-heading" className="text-gdm-text font-bold text-xl mb-2">
            Graça Digital — GDM Live Radio
          </h2>
          <p className="text-gdm-muted text-sm leading-relaxed mb-4">
            A GDM Live Radio é uma rádio cristã contemporânea que transmite{' '}
            <strong className="text-gdm-text">exclusivamente músicas autorais</strong> da{' '}
            <strong className="text-gdm-text">Graça Digital (GDM)</strong>. Uma produção musical
            independente, criada com fé, criatividade e propósito.
          </p>

          {!compact && (
            <>
              <p className="text-gdm-muted text-sm leading-relaxed mb-4">
                Nossa programação é cuidadosamente automatizada para proporcionar uma experiência de
                escuta contínua e envolvente. Cada faixa foi composta e produzida com o objetivo de
                levar mensagens de esperança, fé e renovação.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {[
                  { icon: '🎵', label: 'Músicas autorais', desc: 'Composições originais da Graça Digital' },
                  { icon: '📻', label: 'Transmissão contínua', desc: '24/7, sem interrupções' },
                  { icon: '✝️', label: 'Conteúdo cristão', desc: 'Mensagens de fé e esperança' },
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="bg-gdm-dark rounded-xl p-4">
                    <div className="text-2xl mb-2">{icon}</div>
                    <p className="text-gdm-text text-sm font-medium">{label}</p>
                    <p className="text-gdm-muted text-xs mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Botão de Destaque Canal do YouTube */}
              <div className="mt-8 p-4 rounded-xl bg-[#FF0000]/10 border border-[#FF0000]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white shadow-lg shadow-[#FF0000]/30 flex-shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-bold">Canal Oficial no YouTube</h3>
                    <p className="text-gdm-muted text-xs">Inscreva-se em @graçadigitalmusic e assista aos videoclipes e lançamentos.</p>
                  </div>
                </div>
                <a
                  href="https://www.youtube.com/@gra%C3%A7adigitalmusic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#FF0000] hover:bg-[#CC0000] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 flex-shrink-0"
                >
                  Inscrever-se no YouTube
                </a>
              </div>
            </>
          )}

          {compact && (
            <div className="flex items-center gap-2 text-gdm-muted text-xs">
              <Music2 className="w-3.5 h-3.5" />
              <span>Músicas autorais cristãs · Transmissão contínua</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

