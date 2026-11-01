import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  Info,
  Music,
  Mail,
  Smartphone,
  Moon,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { GdmBrandLogo } from '@/components/Common/GdmBrandLogo';
import { SongRequestModal } from '@/components/Community/SongRequestModal';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Início', icon: Home, isAction: false },
    { to: '/programacao', label: 'Programação', icon: Calendar, isAction: false },
    { to: '/sobre', label: 'Sobre a GDM', icon: Info, isAction: false },
    { to: '#pedidos', label: 'Pedidos', icon: Music, isAction: true },
    { to: '/comunidade', label: 'Contato', icon: Mail, isAction: false },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#07070D]/95 backdrop-blur-xl border-b border-[#1C223A] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo Oficial GDM Live Radio */}
          <Link
            to="/"
            className="flex items-center group transition-transform duration-200 hover:scale-[1.02]"
            aria-label="GDM Live Radio — Início"
          >
            <GdmBrandLogo size="md" />
          </Link>

          {/* Desktop Navigation Pills */}
          <nav
            className="hidden lg:flex items-center gap-2 bg-[#0B0B16]/90 p-1.5 rounded-full border border-[#1C223A] shadow-inner"
            aria-label="Navegação principal"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.isAction) {
                return (
                  <button
                    key={item.label}
                    onClick={() => setIsRequestModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-[#C9C9D4] hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#FFC928]" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-[#7000FF] text-white shadow-[0_0_16px_rgba(112,0,255,0.6)]'
                        : 'text-[#C9C9D4] hover:text-white hover:bg-white/10'
                    )
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Botão "Ouvir no App" */}
            <a
              href="https://gdm-live-radio.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7000FF] to-[#9B4DFF] hover:from-[#8014FF] hover:to-[#A861FF] text-white text-xs font-bold tracking-wide shadow-[0_0_16px_rgba(112,0,255,0.4)] transition-all duration-200 hover:scale-105"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Ouvir no App</span>
            </a>

            {/* Alternador / Modo Escuro (Decorativo / Preserva o tema obsidian) */}
            <button
              type="button"
              title="Modo Noite Ativo"
              className="w-9 h-9 rounded-full bg-[#0E1020] border border-[#1C223A] flex items-center justify-center text-[#C9C9D4] hover:text-[#FFC928] hover:border-[#FFC928]/40 transition-colors shadow-sm"
              aria-label="Modo de exibição"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Painel Administrativo */}
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-[#7A839E] hover:text-white hover:bg-white/5 border border-transparent hover:border-[#1C223A] transition-all"
              aria-label="Painel Administrativo"
            >
              <Shield className="w-3.5 h-3.5 text-[#7000FF]" />
              <span className="hidden xl:inline">Admin</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl text-[#C9C9D4] hover:text-white hover:bg-white/5 transition-colors border border-[#1C223A]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <nav
            className="lg:hidden border-t border-[#1C223A] bg-[#07070D]/98 backdrop-blur-2xl px-4 py-5 flex flex-col gap-2.5 shadow-2xl animate-fade-in"
            aria-label="Navegação mobile"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.isAction) {
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMenuOpen(false);
                      setIsRequestModalOpen(true);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#C9C9D4] hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-[#FFC928]" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-[#7000FF] text-white shadow-[0_0_16px_rgba(112,0,255,0.5)]'
                        : 'text-[#C9C9D4] hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <div className="pt-3 border-t border-[#1C223A] flex flex-col gap-2">
              <a
                href="https://gdm-live-radio.web.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-[#7000FF] to-[#9B4DFF] text-white font-bold text-sm shadow-gdm"
              >
                <Smartphone className="w-4 h-4" />
                <span>Ouvir no App</span>
              </a>

              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-xs text-[#7A839E] hover:text-white border border-[#1C223A]"
              >
                <Shield className="w-3.5 h-3.5 text-[#7000FF]" />
                <span>Painel Administrativo</span>
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Modal de Pedidos de Música */}
      <SongRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </>
  );
}
