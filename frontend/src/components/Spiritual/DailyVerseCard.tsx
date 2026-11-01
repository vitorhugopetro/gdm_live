import { useState } from 'react';
import { BookOpen, RefreshCw, Share2, Check } from 'lucide-react';

interface Verse {
  text: string;
  reference: string;
  theme: string;
}

const VERSES: Verse[] = [
  {
    text: "O Senhor é o meu pastor; de nada terei falta. Em verdes pastagens me faz repousar e me conduz a águas tranquilas.",
    reference: "Salmos 23:1-2",
    theme: "Paz & Confiança",
  },
  {
    text: "Tudo posso naquele que me fortalece.",
    reference: "Filipenses 4:13",
    theme: "Vitória & Fé",
  },
  {
    text: "Não fui eu que ordenei a você? Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.",
    reference: "Josué 1:9",
    theme: "Coragem & Ânimo",
  },
  {
    text: "Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.",
    reference: "1 Pedro 5:7",
    theme: "Cuidado de Deus",
  },
  {
    text: "Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.",
    reference: "Jeremias 29:11",
    theme: "Esperança",
  },
  {
    text: "Mas aqueles que esperam no Senhor renovam as suas forças. Voam alto como águias; correm e não ficam exaustos, andam e não se cansam.",
    reference: "Isaías 40:31",
    theme: "Renovação",
  },
  {
    text: "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e te conceda graça; o Senhor volte para ti o seu rosto e te dê paz.",
    reference: "Números 6:24-26",
    theme: "Bênção Apostólica",
  },
  {
    text: "Mil poderão cair ao seu lado e dez mil à sua direita, mas nada o atingirá.",
    reference: "Salmos 91:7",
    theme: "Proteção Divina",
  },
];

export function DailyVerseCard() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * VERSES.length));
  const [copied, setCopied] = useState(false);

  const current = VERSES[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % VERSES.length);
  };

  const handleShare = () => {
    const text = `📖 *Palavra de Fé — GDM Live Radio*\n\n"${current.text}"\n— *${current.reference}*\n\nOuça louvores 24h na rádio: https://gdmlr.web.app`;
    if (navigator.share) {
      navigator.share({ title: 'Palavra de Fé', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gdm-card via-[#111927] to-[#0A101D] border border-gdm-purple/30 p-6 md:p-8 shadow-gdm-lg">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gdm-purple/10 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gdm-purple/20 text-gdm-purple-light border border-gdm-purple/30">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-gdm-purple-light">
              Palavra de Fé & Esperança
            </span>
            <span className="text-xs text-gdm-text-muted">• {current.theme}</span>
          </div>

          <blockquote className="text-base md:text-lg text-gdm-text-primary italic font-serif leading-relaxed">
            "{current.text}"
          </blockquote>

          <p className="text-sm font-bold text-gdm-gold tracking-wide">
            — {current.reference}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
          <button
            onClick={handleNext}
            title="Outro versículo"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gdm-border/50 text-gdm-text-secondary hover:text-white hover:bg-gdm-border transition-colors border border-gdm-border"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Outro</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gdm-purple/30 text-gdm-purple-light hover:bg-gdm-purple hover:text-white transition-all border border-gdm-purple/40 shadow-gdm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-gdm-emerald" />
                <span className="text-gdm-emerald">Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartilhar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

