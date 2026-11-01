import { Wifi, WifiOff, Loader2, Radio, PauseCircle, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { AnimatedBars } from '@/components/Common/AnimatedBars';
import { Spinner } from '@/components/Common/Spinner';
import type { ConnectionState } from '@/types';

interface PlayerConnectionBadgeProps {
  state: ConnectionState;
  reconnectAttempt?: number;
  className?: string;
  compact?: boolean;
}

export function PlayerConnectionBadge({
  state,
  reconnectAttempt = 0,
  className,
  compact = false,
}: PlayerConnectionBadgeProps) {
  const config = getConfig(state, reconnectAttempt);

  if (compact) {
    return (
      <div className={clsx('flex items-center gap-1.5', className)}>
        {config.icon}
        <span className={clsx('text-xs font-semibold', config.textColor)}>
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold',
        config.bg,
        config.textColor,
        className,
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}

function getConfig(state: ConnectionState, attempt: number) {
  switch (state) {
    case 'playing':
      return {
        label: 'AO VIVO',
        icon: <AnimatedBars size="sm" color="emerald" />,
        textColor: 'text-gdm-emerald',
        bg: 'bg-gdm-emerald/15 border border-gdm-emerald/30',
      };
    case 'connecting':
      return {
        label: 'Conectando...',
        icon: <Spinner size="sm" color="purple" />,
        textColor: 'text-gdm-purple-light',
        bg: 'bg-gdm-purple/15 border border-gdm-purple/30',
      };
    case 'loading':
      return {
        label: 'Carregando...',
        icon: <Loader2 className="w-3 h-3 animate-spin" />,
        textColor: 'text-gdm-purple-light',
        bg: 'bg-gdm-purple/15 border border-gdm-purple/30',
      };
    case 'paused':
      return {
        label: 'Pausado',
        icon: <PauseCircle className="w-3 h-3" />,
        textColor: 'text-gdm-text-secondary',
        bg: 'bg-gdm-border/50 border border-gdm-border',
      };
    case 'reconnecting':
      return {
        label: `Reconectando... (${attempt}/5)`,
        icon: <Wifi className="w-3 h-3 animate-pulse" />,
        textColor: 'text-amber-400',
        bg: 'bg-amber-500/15 border border-amber-500/30',
      };
    case 'offline':
      return {
        label: 'Transmissão indisponível',
        icon: <WifiOff className="w-3 h-3" />,
        textColor: 'text-red-400',
        bg: 'bg-red-500/15 border border-red-500/30',
      };
    case 'error':
      return {
        label: 'Erro de conexão',
        icon: <AlertTriangle className="w-3 h-3" />,
        textColor: 'text-red-400',
        bg: 'bg-red-500/15 border border-red-500/30',
      };
    case 'idle':
    default:
      return {
        label: 'GDM Live Radio',
        icon: <Radio className="w-3 h-3" />,
        textColor: 'text-gdm-text-muted',
        bg: 'bg-gdm-border/50 border border-gdm-border',
      };
  }
}
