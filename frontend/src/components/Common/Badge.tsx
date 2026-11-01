import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type BadgeVariant = 'live' | 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantMap: Record<BadgeVariant, string> = {
  live: 'bg-gdm-emerald/15 text-gdm-emerald border border-gdm-emerald/30',
  default: 'bg-gdm-border/50 text-gdm-text-secondary border border-gdm-border',
  success: 'bg-gdm-emerald/15 text-gdm-emerald border border-gdm-emerald/30',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  error: 'bg-red-500/15 text-red-400 border border-red-500/30',
  info: 'bg-gdm-purple/15 text-gdm-purple-light border border-gdm-purple/30',
};

const dotColorMap: Record<BadgeVariant, string> = {
  live: 'bg-gdm-emerald',
  default: 'bg-gdm-text-muted',
  success: 'bg-gdm-emerald',
  warning: 'bg-amber-400',
  error: 'bg-red-400',
  info: 'bg-gdm-purple-light',
};

export function Badge({ children, variant = 'default', className, dot }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide uppercase',
        variantMap[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            dotColorMap[variant],
            variant === 'live' && 'animate-pulse',
          )}
        />
      )}
      {children}
    </span>
  );
}
