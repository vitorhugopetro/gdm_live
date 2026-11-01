import { useState, useEffect } from 'react';
import { Moon, X, Clock, Check } from 'lucide-react';
import { useRadioStore } from '@/store/radioStore';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMER_OPTIONS = [
  { minutes: 15, label: '15 minutos' },
  { minutes: 30, label: '30 minutos' },
  { minutes: 45, label: '45 minutos' },
  { minutes: 60, label: '1 hora' },
  { minutes: 90, label: '1 hora e meia' },
];

export function SleepTimerModal({ isOpen, onClose }: SleepTimerModalProps) {
  const { sleepTimerEndsAt, setSleepTimer } = useRadioStore();
  const [remainingSec, setRemainingSec] = useState<number | null>(null);

  useEffect(() => {
    if (!sleepTimerEndsAt) {
      setRemainingSec(null);
      return;
    }

    const update = () => {
      const left = Math.max(0, Math.round((sleepTimerEndsAt - Date.now()) / 1000));
      setRemainingSec(left);
      if (left === 0) setSleepTimer(null);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [sleepTimerEndsAt, setSleepTimer]);

  if (!isOpen) return null;

  const formatRemaining = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0f1423] border border-white/10 p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gdm-purple/20 text-gdm-purple">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Timer de Sono</h3>
              <p className="text-xs text-gdm-text-muted">Desliga a rádio automaticamente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gdm-text-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Countdown */}
        {remainingSec !== null && remainingSec > 0 && (
          <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-gdm-purple/15 to-gdm-emerald/15 border border-gdm-purple/30 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gdm-emerald font-medium mb-1">
              <Clock className="w-4 h-4 animate-spin-slow" />
              <span>Desligamento em andamento</span>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-wider">
              {formatRemaining(remainingSec)}
            </div>
            <button
              onClick={() => setSleepTimer(null)}
              className="mt-3 text-xs text-red-400 hover:text-red-300 font-semibold underline"
            >
              Cancelar Timer
            </button>
          </div>
        )}

        {/* Options */}
        <div className="mt-4 space-y-2">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt.minutes}
              onClick={() => {
                setSleepTimer(opt.minutes);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gdm-purple/40 transition-all text-sm font-medium"
            >
              <span>{opt.label}</span>
              {sleepTimerEndsAt && Math.round((sleepTimerEndsAt - Date.now()) / 60000) === opt.minutes ? (
                <Check className="w-4 h-4 text-gdm-emerald" />
              ) : (
                <span className="text-xs text-gdm-text-muted">Ativar</span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-gdm-text-muted">
          Durma em paz ouvindo os louvores da GDM Live Radio.
        </p>
      </div>
    </div>
  );
}

