import { useEffect, type RefObject } from 'react';

// Classic demo-scene fire: low-res heat buffer propagated upward each frame.
// Kept subtle (max heat 130, sparse seeding) so it reads as "embers at the
// bottom" rather than a full-screen inferno.

const MAX_HEAT    = 130;
const COOLING     = 0.978;   // multiplier per upward step
const SEED_CHANCE = 0.45;    // probability a bottom-row pixel is seeded each frame
const SCALE       = 5;       // canvas pixels per buffer cell

function heatToRGBA(h: number, d: Uint8ClampedArray, i: number) {
  if (h < 2) { d[i] = 0; d[i+1] = 0; d[i+2] = 0; d[i+3] = 0; return; }
  const v = Math.min(h / MAX_HEAT, 1);
  let r: number, gr: number, b: number, a: number;
  if (v < 0.25) {
    const t = v / 0.25;
    r = Math.round(t * 90);  gr = 0; b = 0; a = Math.round(t * 170);
  } else if (v < 0.5) {
    const t = (v - 0.25) / 0.25;
    r = Math.round(90 + t * 160); gr = Math.round(t * 18); b = 0; a = Math.round(170 + t * 55);
  } else if (v < 0.75) {
    const t = (v - 0.5) / 0.25;
    r = Math.round(250 + t * 5); gr = Math.round(18 + t * 82); b = 0; a = Math.round(225 + t * 25);
  } else {
    const t = (v - 0.75) / 0.25;
    r = 255; gr = Math.round(100 + t * 155); b = Math.round(t * 55); a = 250;
  }
  d[i] = r; d[i+1] = gr; d[i+2] = b; d[i+3] = a;
}

export function useFireBackground(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size the canvas to the viewport once on mount
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;

    const noM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const bW = Math.ceil(canvas.width  / SCALE);
    const bH = Math.ceil(canvas.height / SCALE);

    const heat = new Float32Array(bW * bH);

    // Off-screen canvas used to build each frame at low resolution
    const fireCanvas = document.createElement('canvas');
    fireCanvas.width  = bW;
    fireCanvas.height = bH;
    const fc = fireCanvas.getContext('2d')!;
    const img = fc.createImageData(bW, bH);

    function seedBottom() {
      for (let x = 0; x < bW; x++) {
        const h = Math.random() < SEED_CHANCE ? Math.random() * MAX_HEAT : 0;
        heat[x + (bH - 1) * bW] = h;
        heat[x + (bH - 2) * bW] = h * 0.75;
      }
    }

    function propagate() {
      for (let y = 0; y < bH - 2; y++) {
        for (let x = 0; x < bW; x++) {
          const xl = x > 0       ? x - 1 : 0;
          const xr = x < bW - 1 ? x + 1 : bW - 1;
          heat[x + y * bW] = (
            heat[xl + (y + 1) * bW] +
            heat[x  + (y + 1) * bW] +
            heat[xr + (y + 1) * bW] +
            heat[x  + (y + 2) * bW]
          ) / 4 * COOLING;
        }
      }
    }

    function renderFire() {
      const d = img.data;
      for (let i = 0; i < bW * bH; i++) {
        heatToRGBA(heat[i], d, i * 4);
      }
      fc.putImageData(img, 0, 0);
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.drawImage(fireCanvas, 0, 0, canvas!.width, canvas!.height);
    }

    if (noM) {
      // Single static low-heat frame
      for (let x = 0; x < bW; x++) {
        heat[x + (bH - 1) * bW] = MAX_HEAT * 0.4;
        heat[x + (bH - 2) * bW] = MAX_HEAT * 0.2;
      }
      propagate();
      renderFire();
      return;
    }

    let animId: number;
    let frame = 0;

    function tick() {
      // Update simulation at ~30 fps (every other rAF)
      if (frame % 2 === 0) {
        seedBottom();
        propagate();
        renderFire();
      }
      frame++;
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [canvasRef]);
}
