import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Radio, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      // Firebase error messages in Portuguese
      if (message.includes('invalid-credential') || message.includes('wrong-password') || message.includes('user-not-found')) {
        setError('Email ou senha incorretos.');
      } else if (message.includes('too-many-requests')) {
        setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      } else {
        setError('Erro ao fazer login. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gdm-dark flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gdm-purple to-gdm-emerald flex items-center justify-center shadow-xl mb-4">
            <Radio className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-gdm-text text-xl font-bold">GDM Live Radio</h1>
          <p className="text-gdm-muted text-sm mt-1">Painel Administrativo</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gdm-card border border-gdm-border rounded-2xl p-6 space-y-4"
          aria-label="Formulário de login"
        >
          <div>
            <label htmlFor="email" className="block text-gdm-text text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gdm-dark border border-gdm-border rounded-xl px-4 py-3 text-gdm-text text-sm placeholder:text-gdm-muted focus:outline-none focus:ring-2 focus:ring-gdm-purple/50 focus:border-gdm-purple transition-colors"
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gdm-text text-sm font-medium mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gdm-dark border border-gdm-border rounded-xl px-4 py-3 pr-11 text-gdm-text text-sm placeholder:text-gdm-muted focus:outline-none focus:ring-2 focus:ring-gdm-purple/50 focus:border-gdm-purple transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gdm-muted hover:text-gdm-text transition-colors p-1"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5" role="alert">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3 bg-gdm-purple hover:bg-gdm-purple/80 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gdm-muted text-sm hover:text-gdm-text transition-colors">
            ← Voltar para a rádio
          </Link>
        </div>
      </div>
    </div>
  );
}

