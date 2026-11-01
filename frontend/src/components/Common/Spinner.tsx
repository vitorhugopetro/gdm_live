import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'purple' | 'emerald' | 'white';
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
};

const colorMap = {
  purple: 'border-gdm-purple/30 border-t-gdm-purple',
  emerald: 'border-gdm-emerald/30 border-t-gdm-emerald',
  white: 'border-white/30 border-t-white',
};

export function Spinner({ size = 'md', className, color = 'purple' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={clsx(
        'rounded-full animate-spin',
        sizeMap[size],
        colorMap[color],
        className,
      )}
    />
  );
}
