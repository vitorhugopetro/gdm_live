import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Radio, LogOut, LayoutDashboard, Library, Settings, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import AdminLibrary from '@/components/Admin/AdminLibrary';
import AdminSettings from '@/components/Admin/AdminSettings';

type AdminTab = 'dashboard' | 'library' | 'settings';

const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'library', label: 'Biblioteca', icon: Library },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gdm-dark">
      {/* Admin header */}
      <header className="bg-gdm-card border-b border-gdm-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gdm-purple to-gdm-emerald flex items-center justify-center">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-gdm-text text-sm font-semibold leading-tight">GDM Live Radio</p>
              <p className="text-gdm-muted text-xs leading-tight flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Painel Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-gdm-muted text-xs truncate max-w-[200px]">
              {user?.email}
            </span>
            <Link
              to="/"
              className="text-gdm-muted hover:text-gdm-text text-xs px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              ← Rádio
            </Link>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 text-gdm-muted hover:text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              aria-label="Sair"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 pb-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-gdm-purple text-gdm-purple'
                  : 'border-transparent text-gdm-muted hover:text-gdm-text'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'library' && <AdminLibrary />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
}

