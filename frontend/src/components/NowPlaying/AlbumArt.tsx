import { useState } from 'react';
import { Music2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { Track } from '@/types';

interface AlbumArtProps {
  src?: string | null;
  track?: Track | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-48 h-48 md:w-64 md:h-64',
};

const iconSizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-16 h-16',
};

const roundedMap = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export function AlbumArt({
  src,
  track,
  alt = 'Capa do álbum',
  size = 'md',
  className,
  rounded = 'lg',
}: AlbumArtProps) {
  const [error, setError] = useState(false);
  // Support passing a track object directly for convenience
  const imgSrc = (error ? null : (src ?? track?.coverArt ?? track?.coverArtDataUrl)) || '/images/player-album-art.jpg';
  const imgAlt = alt ?? (track ? `${track.title} — ${track.artist}` : 'Capa do álbum');
  const showFallback = error && !imgSrc;

  return (
    <div
      className={clsx(
        sizeMap[size],
        roundedMap[rounded],
        'overflow-hidden flex-shrink-0 relative',
        showFallback &&
          'bg-gdm-gradient border border-gdm-border/50',
        className,
      )}
    >
      {showFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gdm-gradient">
          {/* Subtle purple to emerald gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gdm-purple/20 to-gdm-emerald/20" />
          <Music2
            className={clsx(iconSizeMap[size], 'text-gdm-text-muted/60 relative z-10')}
          />
          {size === 'xl' && (
            <span className="mt-2 text-xs font-bold text-gdm-text-muted/50 tracking-widest relative z-10">
              GDM
            </span>
          )}
        </div>
      ) : (
        <img
          src={imgSrc!}
          alt={imgAlt}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}
