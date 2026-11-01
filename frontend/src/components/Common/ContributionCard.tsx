import { useState } from 'react';
import { Heart, Copy, Check, MessageCircle, QrCode, ExternalLink, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const PIX_KEY = '(24) 988212712';
const WHATSAPP_NUMBER = '5524988212712'; // Formato internacional
const OWNER_NAME = 'Vitor Hugo Abre de Soussa';

export function ContributionCard() {
  const [copied, setCopied] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true);
      toast.success('Chave PIX copiada!', {
        icon: '💛',
        style: { background: '#131929', color: '#F1F5F9', border: '1px solid #FFC928' },
      });
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Olá! Ouvi a GDM Live Radio e quero contribuir com a missão. Deus te abençoe! 🙏'
  )}`;

  return (
    <section
      aria-labelledby="contribution-heading"
      className="relative overflow-hidden rounded-3xl border border-[#FFC928]/30 shadow-[0_0_40px_rgba(255,201,40,0.15)] bg-gradient-to-br from-[#12100A] via-[#1A1305] to-[#0B0B16]"
    >
      {/* Fundo decorativo */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#FFC928]/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-[#7000FF]/15 blur-[100px] pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-[#FFC928]/15 border border-[#FFC928]/30">
            <Heart className="w-7 h-7 text-[#FFC928] fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#FFC928]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFC928]">
                Apoie a Missão
              </span>
            </div>
            <h2
              id="contribution-heading"
              className="text-2xl sm:text-3xl font-black text-white leading-tight"
            >
              Contribua com a GDM Live Radio
            </h2>
            <p className="text-[#C9C9D4] text-sm mt-1 max-w-xl">
              A GDM Live Radio é um ministério independente, feito com fé e amor.
              Sua contribuição sustenta a transmissão 24h de louvores autorais e a produção de novas músicas.
            </p>
          </div>
        </div>

        {/* Grid de opções */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Card PIX */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0E1020] border border-[#FFC928]/40 hover:border-[#FFC928]/70 p-5 sm:p-6 transition-all duration-300 group">
            {/* Ícone QR decorativo */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <QrCode className="w-16 h-16 text-[#FFC928]" />
            </div>

            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC928]/15 border border-[#FFC928]/30">
                <span className="w-2 h-2 rounded-full bg-[#FFC928] animate-pulse" />
                <span className="text-xs font-bold text-[#FFC928] uppercase tracking-wide">PIX — Transferência Instantânea</span>
              </div>

              {/* Nome */}
              <div>
                <p className="text-xs text-[#7A839E] font-medium mb-1">Beneficiário</p>
                <p className="text-white font-bold text-base">{OWNER_NAME}</p>
              </div>

              {/* Chave PIX */}
              <div>
                <p className="text-xs text-[#7A839E] font-medium mb-2">Chave PIX (Telefone)</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#07070D] rounded-xl border border-[#1C223A] px-4 py-3">
                    <span className="font-mono text-[#FFC928] font-bold text-lg tracking-widest">
                      {PIX_KEY}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPix}
                    aria-label="Copiar chave PIX"
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFC928] hover:bg-[#FFD84A] text-black transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0 shadow-[0_0_16px_rgba(255,201,40,0.4)]"
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Instrução */}
              <p className="text-xs text-[#7A839E] leading-relaxed">
                Abra o app do seu banco → PIX → Pagar → Cole a chave acima → Confirme o nome <strong className="text-[#C9C9D4]">{OWNER_NAME}</strong> antes de confirmar.
              </p>
            </div>
          </div>

          {/* Card WhatsApp / Contato */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0E1020] border border-[#25D366]/40 hover:border-[#25D366]/70 p-5 sm:p-6 transition-all duration-300 group">
            {/* Ícone decorativo */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <MessageCircle className="w-16 h-16 text-[#25D366]" />
            </div>

            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/15 border border-[#25D366]/30">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-xs font-bold text-[#25D366] uppercase tracking-wide">WhatsApp — Fale Conosco</span>
              </div>

              {/* Descrição */}
              <div>
                <p className="text-white font-bold text-base">{OWNER_NAME}</p>
                <p className="text-[#C9C9D4] text-sm mt-1 leading-relaxed">
                  Dúvidas, pedidos de oração, mensagens de encorajamento ou confirmação de contribuição — fale diretamente comigo!
                </p>
              </div>

              {/* Número */}
              <div>
                <p className="text-xs text-[#7A839E] font-medium mb-2">WhatsApp</p>
                <div className="bg-[#07070D] rounded-xl border border-[#1C223A] px-4 py-3">
                  <span className="font-mono text-[#25D366] font-bold text-lg tracking-widest">
                    (24) 98821-2712
                  </span>
                </div>
              </div>

              {/* Botão WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Versículo de agradecimento */}
        <div className="mt-6 p-4 rounded-2xl bg-[#07070D]/60 border border-[#1C223A] text-center">
          <p className="text-[#C9C9D4] text-sm italic leading-relaxed">
            "Cada um dê conforme determinou em seu coração, não com tristeza nem por obrigação,
            pois Deus ama quem dá com alegria."
          </p>
          <p className="text-[#FFC928] text-xs font-bold mt-2">2 Coríntios 9:7</p>
        </div>
      </div>
    </section>
  );
}

