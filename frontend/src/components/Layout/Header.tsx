import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Radio, Menu, X, Music2 } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/programacao', label: 'Programação' },
  { to: '/sobre', label: 'Sobre' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gdm-card/80 backdrop-blur-md border-b border-gdm-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="GDM Live Radio — Início">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gdm-purple to-gdm-emerald flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="text-gdm-text font-bold text-sm leading-tight">GDM Live Radio</div>
            <div className="text-gdm-muted text-xs leading-tight">Graça Digital</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gdm-purple/20 text-gdm-purple'
                    : 'text-gdm-muted hover:text-gdm-text hover:bg-white/5'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Admin link + mobile menu button */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gdm-muted hover:text-gdm-text hover:bg-white/5 transition-colors"
            aria-label="Painel Administrativo"
          >
            <Music2 className="w-3.5 h-3.5" />
            Admin
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gdm-muted hover:text-gdm-text hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden border-t border-gdm-border bg-gdm-card px-4 py-3 flex flex-col gap-1"
          aria-label="Navegação mobile"
        >
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gdm-purple/20 text-gdm-purple'
                    : 'text-gdm-muted hover:text-gdm-text hover:bg-white/5'
                )
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 rounded-lg text-sm text-gdm-muted hover:text-gdm-text hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <Music2 className="w-4 h-4" />
            Painel Admin
          </Link>
        </nav>
      )}
    </header>
  );
}

