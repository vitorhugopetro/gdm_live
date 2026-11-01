import { WifiOff, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = 'Algo deu errado',
  message = 'Não foi possível carregar o conteúdo.',
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  if (compact) {
    return (
      <div className={clsx('flex items-center gap-2 text-gdm-text-secondary', className)}>
        <WifiOff className="w-4 h-4 text-red-400 flex-shrink-0" />
        <span className="text-sm">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto text-gdm-purple hover:text-gdm-purple-light text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center gap-4 py-12 px-6',
        className,
      )}
    >
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
        <WifiOff className="w-7 h-7 text-red-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-gdm-text-primary font-semibold">{title}</h3>
        <p className="text-gdm-text-secondary text-sm max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-gdm-card hover:bg-gdm-border text-gdm-text-primary font-medium px-5 py-2.5 rounded-lg border border-gdm-border transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
