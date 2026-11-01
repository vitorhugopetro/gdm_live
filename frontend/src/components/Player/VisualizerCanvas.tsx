import { useEffect, useRef } from 'react';
import { useRadioStore } from '@/store/radioStore';

interface VisualizerCanvasProps {
  className?: string;
  barCount?: number;
  isPlaying?: boolean;
}

export function VisualizerCanvas({
  className = '',
  barCount = 36,
  isPlaying: externalIsPlaying,
}: VisualizerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const storeIsPlaying = useRadioStore((state) => state.isPlayerPlaying);
  const connectionState = useRadioStore((state) => state.connectionState);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : storeIsPlaying;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simulated organic audio bars with smooth physics
    const bars: number[] = Array.from({ length: barCount }, () => Math.random() * 0.2 + 0.1);
    const speeds: number[] = Array.from({ length: barCount }, () => 0.03 + Math.random() * 0.05);
    const targets: number[] = Array.from({ length: barCount }, () => Math.random());

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const isLive = isPlaying && (connectionState === 'playing' || connectionState === 'idle');
      phase += 0.05;

      const gap = 3;
      const totalGaps = (barCount - 1) * gap;
      const barWidth = Math.max(2, (width - totalGaps) / barCount);

      // Create gradient: purple #7C3AED -> emerald #10B981
      const gradient = ctx.createLinearGradient(0, height, width, 0);
      gradient.addColorStop(0, '#7C3AED');
      gradient.addColorStop(0.5, '#A855F7');
      gradient.addColorStop(1, '#10B981');

      for (let i = 0; i < barCount; i++) {
        if (isLive) {
          // Physics step towards target
          if (Math.abs(bars[i] - targets[i]) < 0.04) {
            // New random target with rhythmic wave envelope
            const wave = Math.sin(phase + (i / barCount) * Math.PI * 2);
            targets[i] = Math.max(0.12, Math.min(0.95, Math.random() * 0.7 + wave * 0.25));
          }
          bars[i] += (targets[i] - bars[i]) * speeds[i];
        } else {
          // Idle ambient gentle wave
          const wave = Math.sin(phase * 0.4 + (i / barCount) * Math.PI * 2);
          bars[i] = 0.08 + Math.abs(wave) * 0.08;
        }

        const barHeight = Math.max(3, bars[i] * (height - 4));
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Rounded bar top
        const radius = Math.min(barWidth / 2, 3);
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [barCount, isPlaying, connectionState]);

  return (
    <div className={`w-full overflow-hidden flex flex-col items-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={600}
        height={56}
        className="w-full h-14 opacity-90 transition-opacity duration-300"
      />
    </div>
  );
}
