import { useRef } from 'react';
import { useSmithAnimation } from '../hooks/useSmithAnimation';

interface SmithCanvasProps {
  strike: number;
}

export default function SmithCanvas({ strike }: SmithCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useSmithAnimation(canvasRef, strike);

  return (
    <canvas
      ref={canvasRef}
      className="rounded border border-stone-800"
      style={{
        imageRendering: 'pixelated',
        // Fill available width, grow to fill remaining height, keep pixel-art ratio
        width: '100%',
        height: '100%',
        maxWidth: '900px',
        maxHeight: '625px',  // 900 × (136/196) ≈ 625
        objectFit: 'contain',
        aspectRatio: '196 / 136',
      }}
    />
  );
}
