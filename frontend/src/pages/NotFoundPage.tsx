import { Link } from 'react-router-dom';
import { Radio, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gdm-dark flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gdm-purple to-gdm-emerald flex items-center justify-center mb-6">
        <Radio className="w-8 h-8 text-white" />
      </div>

      <h1 className="text-gdm-text text-4xl font-bold mb-2">404</h1>
      <p className="text-gdm-muted text-lg mb-2">Página não encontrada</p>
      <p className="text-gdm-muted text-sm mb-8 max-w-sm">
        A página que você procura não existe. Mas a música continua tocando!
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gdm-purple hover:bg-gdm-purple/80 text-white rounded-xl font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a rádio
      </Link>
    </div>
  );
}

