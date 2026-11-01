import { clsx } from 'clsx';

interface AnimatedBarsProps {
  className?: string;
  color?: 'emerald' | 'purple' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  emerald: 'bg-gdm-emerald',
  purple: 'bg-gdm-purple',
  white: 'bg-white',
};

const sizeMap = {
  sm: { w: 'w-[2px]', heights: ['h-[8px]', 'h-[12px]', 'h-[8px]', 'h-[10px]'], gap: 'gap-[2px]' },
  md: { w: 'w-[3px]', heights: ['h-[14px]', 'h-[18px]', 'h-[12px]', 'h-[16px]'], gap: 'gap-[3px]' },
  lg: { w: 'w-[4px]', heights: ['h-[20px]', 'h-[28px]', 'h-[18px]', 'h-[24px]'], gap: 'gap-[4px]' },
};

export function AnimatedBars({ className, color = 'emerald', size = 'md' }: AnimatedBarsProps) {
  const colorClass = colorMap[color];
  const { w, heights, gap } = sizeMap[size];

  return (
    <div
      className={clsx('flex items-end', gap, className)}
      role="img"
      aria-label="Tocando agora"
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className={clsx(
            w,
            h,
            colorClass,
            'rounded-sm origin-bottom',
            'music-bar',
          )}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}
