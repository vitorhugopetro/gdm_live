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

