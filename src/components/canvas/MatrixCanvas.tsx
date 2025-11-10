import { useEffect, useRef } from 'react';
import styles from './MatrixCanvas.module.css';

interface Pixel {
  x: number;
  y: number;
  z: number;
}

export default function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const pixels: Pixel[] = [];
    let animationFrameId: number;

    const resize = (): void => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Crear píxeles
    for (let x = -400; x < 400; x += 6) {
      for (let z = -250; z < 250; z += 6) {
        pixels.push({ x, y: 100, z });
      }
    }

    const render = (ts: number): void => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#39FF14';

      const fov = 250;
      const len = pixels.length;

      for (let i = 0; i < len; i++) {
        const pixel = pixels[i];
        const scale = fov / (fov + pixel.z);
        const x2d = pixel.x * scale + W / 2;
        const y2d = pixel.y * scale + H / 2;

        if (x2d >= 0 && x2d <= W && y2d >= 0 && y2d <= H) {
          ctx.fillRect(x2d, y2d, 2, 2);
        }

        pixel.z -= 0.6;
        pixel.y = H / 14 + Math.sin(i / len * 15 + ts / 450) * 10;
        if (pixel.z < -fov) pixel.z += 500;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}