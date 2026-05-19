import { useEffect, useRef, type RefObject } from 'react';

const W = 196, H = 136;
const FX = 4,  FY = 44;           // forge
const AX = 52, AY = 88;           // anvil
const WX = 62, WY = 85;           // hot metal
const CX = 72, CY = 20;           // smith — moved left so hammer lands on metal

// Hammer animation (single-shot, triggered externally)
const STRIKE_DURATION = 0.78;     // seconds for one full swing + recover
const MAX_SWING = 55;             // max vertical travel of hammer head

// Proportional offset: linear scale from shoulder pivot (relY≈38) to hammer head (relY=-2)
function hammerScale(relY: number): number {
  return Math.max(0, Math.min(1, (38 - relY) / 40));
}

// Vertical offset at a given animation time
function strikeY(hammerT: number): number {
  const f = Math.min(hammerT / STRIKE_DURATION, 1);
  if (f < 0.40) { const s = f / 0.40; return s * s * MAX_SWING; }   // ease-in down
  if (f < 0.55) return MAX_SWING;                                      // hold at impact
  const s = (f - 0.55) / 0.45; return (1 - s) * MAX_SWING;            // ease-out up
}

// Slight leftward arc (hammer swings towards the metal, not straight down)
function strikeX(hammerT: number): number {
  return -Math.round(strikeY(hammerT) * 0.14);
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  type: 'ember' | 'smoke' | 'spark';
}

export function useSmithAnimation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  strike: number,
) {
  // Keep latest strike value readable inside the rAF loop without re-running effect
  const strikeRef = useRef(strike);
  strikeRef.current = strike;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width  = W;
    canvas.height = H;
    // Display size is controlled by CSS on the canvas element (responsive)

    const g = canvas.getContext('2d')!;
    g.imageSmoothingEnabled = false;

    const noM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parts: Particle[] = [];
    let animId: number;
    let t = 0;
    let lastTs: number | null = null;

    // Hammer state
    let lastStrike  = strikeRef.current; // last strike count seen
    let hammerActive = false;
    let hammerT      = 0;
    let impactArmed  = true;

    const px = (x: number, y: number, c: string, w = 1, h = 1) => {
      g.fillStyle = c;
      g.fillRect(Math.round(x), Math.round(y), w, h);
    };

    // ── particles ────────────────────────────────────────────────────────────

    function spawnEmber() {
      parts.push({
        x: FX + 6 + Math.random() * 12, y: FY + 44 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 0.45, vy: -(0.55 + Math.random() * 0.9),
        life: 1, maxLife: 0.5 + Math.random() * 0.65, type: 'ember',
      });
    }

    function spawnSmoke() {
      parts.push({
        x: FX + 7 + Math.random() * 10, y: FY + 4,
        vx: (Math.random() - 0.4) * 0.2, vy: -(0.11 + Math.random() * 0.14),
        life: 1, maxLife: 2.2 + Math.random() * 1.2, type: 'smoke',
      });
    }

    function spawnImpactSparks() {
      for (let i = 0; i < 12; i++) {
        const angle = -Math.PI * 0.15 - Math.random() * Math.PI * 0.7;
        const speed = 0.9 + Math.random() * 2.3;
        parts.push({
          x: WX + 8 + Math.random() * 8, y: WY + 1,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 1, maxLife: 0.2 + Math.random() * 0.22, type: 'spark',
        });
      }
    }

    function tickAndDrawParticles(dt: number) {
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy;
        p.life -= dt / p.maxLife;
        if (p.type === 'ember') { p.vx += (Math.random() - 0.5) * 0.08; p.vy += 0.018; }
        if (p.type === 'smoke') { p.vx += (Math.random() - 0.5) * 0.04; }
        if (p.type === 'spark') { p.vy += 0.13; }
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        const a = Math.max(0, p.life);
        if (p.type === 'ember') {
          const gb = Math.round(a > 0.6 ? 160 * (a - 0.6) / 0.4 : 0);
          g.fillStyle = `rgba(255,${gb},0,${Math.min(1, a * 1.4)})`;
          g.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
        } else if (p.type === 'smoke') {
          const sz = Math.max(1, Math.round(1 + (1 - a) * 2));
          g.fillStyle = `rgba(70,60,80,${a * 0.13})`;
          g.fillRect(Math.round(p.x - sz / 2), Math.round(p.y - sz / 2), sz, sz);
        } else {
          g.fillStyle = `rgba(255,${Math.round(110 * a)},0,${a})`;
          g.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
        }
      }
    }

    // ── scene ─────────────────────────────────────────────────────────────────

    function wall() {
      g.fillStyle = '#04030b'; g.fillRect(0, 0, W, H);
      for (let row = 0; row < 12; row++) {
        const o = (row % 2) * 13;
        for (let c = 0; c < 9; c++) {
          const bx = c * 26 + o - 13, by = row * 11;
          g.fillStyle = ((row * 2 + c) % 3 === 0) ? '#181828' : ((row + c) % 2 ? '#131323' : '#10101e');
          g.fillRect(bx + 1, by + 1, 24, 9);
        }
        g.fillStyle = '#020210'; g.fillRect(0, row * 11, W, 1);
        for (let c = 0; c < 9; c++) g.fillRect(c * 26 + (row % 2) * 13 - 13, row * 11, 1, 11);
      }
    }

    function flr(fy: number) {
      for (let i = 0; i < 12; i++) {
        g.fillStyle = i % 2 ? '#080914' : '#0a0a18';
        g.fillRect(i * 17, fy, 17, H - fy);
      }
      g.fillStyle = '#020210'; g.fillRect(0, fy, W, 1);
      g.fillStyle = 'rgba(0,0,0,.32)'; g.fillRect(0, fy + 1, W, 3);
    }

    function forgeGlow(time: number) {
      const fl = 0.07 + Math.sin(time * 3.7) * 0.025 + Math.sin(time * 11.3) * 0.01;
      const gr = g.createRadialGradient(FX + 14, FY + 30, 0, FX + 14, FY + 30, 100);
      gr.addColorStop(0, `rgba(200,75,0,${fl})`);
      gr.addColorStop(1, 'rgba(200,75,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }

    function forge(fx: number, fy: number, time: number) {
      px(fx, fy, '#13111c', 28, 62); px(fx + 1, fy + 1, '#171528', 26, 60);
      px(fx, fy, '#1e1c36', 1, 62); px(fx + 27, fy, '#080614', 1, 62); px(fx, fy, '#1e1c36', 28, 1);
      px(fx + 4, fy + 5, '#040108', 20, 53);
      for (let row = 50; row >= 0; row--) {
        const ratio = 1 - row / 52;
        const w1 = Math.sin(time * .80 + row * .30) * 1.6 + Math.sin(time * .48 + row * .48) * 1.0;
        const fw = Math.max(2, Math.round((10 + w1) * (.08 + ratio * .92)));
        const fo = Math.sin(time * .58 + row * .38) * 1.6;
        const fx2 = fx + 4 + Math.round((20 - fw) / 2 + fo);
        const fc = ratio > .90 ? '#ffd030' : ratio > .74 ? '#ff8a00' : ratio > .56 ? '#d24000' : ratio > .35 ? '#8c1200' : ratio > .14 ? '#3c0800' : '#0a0100';
        g.fillStyle = fc; g.fillRect(Math.max(fx + 4, fx2), fy + 5 + row, fw, 1);
      }
      const gs = .13 + Math.sin(time * .56) * .04;
      const gr = g.createRadialGradient(fx + 14, fy + 32, 4, fx + 14, fy + 32, 68);
      gr.addColorStop(0, `rgba(175,60,0,${gs})`); gr.addColorStop(1, 'rgba(175,60,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }

    function anvil(ax: number, ay: number) {
      g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(ax + 4, ay + 22, 44, 5);
      px(ax - 14, ay + 4, '#212a38', 15, 8); px(ax - 16, ay + 6, '#212a38', 5, 5); px(ax - 14, ay + 4, '#354456', 14, 2);
      px(ax, ay, '#4e5c6c', 44, 1); px(ax, ay + 1, '#3c4b60', 44, 2); px(ax, ay + 3, '#2e3b4e', 44, 5);
      px(ax, ay + 8, '#202838', 44, 9); px(ax + 1, ay + 9, '#2a3344', 42, 7);
      px(ax + 7, ay + 17, '#161c2a', 30, 6); px(ax + 8, ay + 18, '#1e2836', 28, 4);
      px(ax + 4, ay + 23, '#212a38', 36, 8); px(ax + 4, ay + 23, '#354456', 36, 1); px(ax + 5, ay + 29, '#121a28', 34, 2);
      px(ax, ay + 8, '#4e5c6c', 1, 9);
    }

    function hot(wx: number, wy: number, time: number, flash: boolean) {
      const pu = flash ? 1 : (.56 + Math.sin(time * 1.40) * .44);
      px(wx, wy, flash ? '#fff8e0' : '#761200', 24, 6);
      px(wx + 1, wy, flash ? '#ffe060' : '#be2a00', 20, 4);
      px(wx + 3, wy, flash ? '#ffc820' : '#ea6600', 14, 3);
      px(wx + 6, wy, flash ? '#ffaa00' : '#ffa822', 8, 2);
      px(wx + 9, wy, flash ? '#ffee88' : '#ffda56', 4, 1);
      const gr = g.createRadialGradient(wx + 12, wy + 2, 1, wx + 12, wy + 2, flash ? 26 : 16);
      gr.addColorStop(0, `rgba(235,95,0,${pu * (flash ? 0.65 : .38)})`);
      gr.addColorStop(1, 'rgba(235,95,0,0)');
      g.fillStyle = gr; g.fillRect(wx - 10, wy - 8, 44, 22);
    }

    function smith(cx: number, cy: number, breathe: number, hb: number, hbx: number) {
      const bi = Math.round(breathe);
      // Proportional arm offsets (Y and X arc)
      const hy = (relY: number) => Math.round(hammerScale(relY) * hb);
      const hx = (relY: number) => Math.round(hammerScale(relY) * hbx);

      // boots
      px(cx-10,cy+82,'#0f0f0f',9,7);px(cx-12,cy+86,'#0f0f0f',11,3);px(cx+1,cy+82,'#0f0f0f',9,7);px(cx+1,cy+86,'#0f0f0f',11,3);
      px(cx-8,cy+83,'#767856',3,2);px(cx+3,cy+83,'#767856',3,2);
      // legs
      px(cx-9,cy+66,'#221808',7,18);px(cx+2,cy+66,'#221808',7,18);
      px(cx-8,cy+66,'#3e2e0a',5,16);px(cx+3,cy+66,'#3e2e0a',5,16);
      px(cx-7,cy+68,'#4e3a14',1,14);px(cx+5,cy+68,'#4e3a14',1,14);
      px(cx-10,cy+80,'#685a4a',8,4);px(cx-9,cy+80,'#867860',6,2);px(cx+1,cy+80,'#685a4a',8,4);px(cx+2,cy+80,'#867860',6,2);
      // apron
      px(cx-11,cy+60,'#761208',22,12);px(cx-10,cy+61,'#ac2014',20,6);px(cx-9,cy+66,'#90200e',18,4);
      px(cx-11,cy+60,'#ba9036',1,12);px(cx+10,cy+60,'#ba9036',1,12);px(cx-11,cy+60,'#ba9036',22,1);
      px(cx-9,cy+61,'#d8ae46',1,8);px(cx+8,cy+61,'#d8ae46',1,8);
      // leather straps
      px(cx-10,cy+42,'#422c0a',4,20);px(cx+6,cy+42,'#422c0a',4,20);
      // torso
      px(cx-7,cy+40,'#263242',14,22);px(cx-6,cy+41,'#384a56',12,2);
      px(cx-6,cy+43,'#2e3844',5,16);px(cx+1,cy+43,'#2e3844',5,16);px(cx-1,cy+43,'#1c242a',2,16);
      px(cx-6,cy+57,'#384a56',12,3);
      px(cx-4,cy+46,'#587282',2,2);px(cx+2,cy+46,'#587282',2,2);px(cx-4,cy+52,'#587282',2,2);px(cx+2,cy+52,'#587282',2,2);
      for(let y2=0;y2<7;y2++)px(cx-1,cy+44+y2*2,'#26303e',2,1);
      // left shoulder
      px(cx-13,cy+38,'#253146',9,11);px(cx-12,cy+38,'#3f5262',8,2);px(cx-11,cy+40,'#4c6070',5,2);
      px(cx-13,cy+46,'#18222e',9,4);px(cx-13,cy+50,'#101a26',9,2);px(cx-9,cy+40,'#6484a4',2,2);
      // right shoulder — pivot, no hammer offset
      px(cx+4,cy+38,'#253146',9,11);px(cx+5,cy+38,'#3f5262',7,2);px(cx+6,cy+40,'#4c6070',5,2);
      px(cx+4,cy+46,'#18222e',9,4);px(cx+4,cy+50,'#101a26',9,2);px(cx+7,cy+40,'#6484a4',2,2);
      // left forearm & tongs
      px(cx-12,cy+44,'#321c0a',5,9);px(cx-12,cy+44,'#503016',3,7);
      px(cx-15,cy+51,'#321c0a',5,8);px(cx-15,cy+51,'#503016',3,6);
      px(cx-17,cy+57,'#321c0a',5,7);px(cx-17,cy+57,'#503016',3,5);
      px(cx-19,cy+62,'#0b0904',6,12);px(cx-18,cy+63,'#160e04',5,10);px(cx-18,cy+62,'#241e14',1,12);px(cx-18,cy+68,'#201c14',4,2);
      px(cx-20,cy+72,'#282828',3,18);px(cx-20,cy+72,'#404040',1,16);px(cx-17,cy+74,'#282828',3,16);px(cx-17,cy+74,'#404040',1,14);
      px(cx-21,cy+77,'#363636',7,3);px(cx-20,cy+78,'#4c4c4c',5,1);px(cx-21,cy+88,'#323232',8,4);px(cx-20,cy+89,'#4c4c4c',6,1);
      // right arm — hammer arm, proportional Y+X arc offset
      px(cx+8 +hx(44),cy+44+hy(44),'#321c0a',6,8); px(cx+9 +hx(44),cy+44+hy(44),'#503016',4,6);
      px(cx+11+hx(36),cy+36+hy(36),'#321c0a',6,8); px(cx+12+hx(36),cy+36+hy(36),'#503016',4,6);
      px(cx+14+hx(28),cy+28+hy(28),'#321c0a',6,8); px(cx+15+hx(28),cy+28+hy(28),'#503016',4,6);
      px(cx+16+hx(20),cy+20+hy(20),'#0b0904',7,12);px(cx+17+hx(20),cy+21+hy(20),'#160e04',6,10);
      px(cx+22+hx(20),cy+20+hy(20),'#070504',1,12); px(cx+16+hx(20),cy+20+hy(20),'#100c04',7,1);
      px(cx+17+hx(20),cy+26+hy(20),'#201c14',5,2);
      // handle
      px(cx+19+hx(2),cy+2 +hy(2),'#5a3410',3,20);px(cx+20+hx(2),cy+2 +hy(2),'#7a5020',1,18);
      px(cx+19+hx(2),cy+2 +hy(2),'#42260a',1,20);
      px(cx+19+hx(2),cy+6 +hy(2),'#3a2608',3,2);
      px(cx+19+hx(2),cy+10+hy(2),'#3a2608',3,2);
      px(cx+19+hx(2),cy+14+hy(2),'#3a2608',3,2);
      // hammer head
      px(cx+11+hx(-2),cy-2+hy(-2),'#2d3546',20,12);px(cx+11+hx(-2),cy-2+hy(-2),'#465868',19,3);
      px(cx+12+hx(-2),cy-2+hy(-2),'#667c8e',14,2); px(cx+14+hx(-2),cy-2+hy(-2),'#869eb0',8,1);
      px(cx+11+hx(-2),cy-2+hy(-2),'#667a8c',3,12); px(cx+12+hx(-2),cy-1+hy(-2),'#849eb0',2,9);
      px(cx+29+hx(-2),cy-2+hy(-2),'#16202c',2,12); px(cx+28+hx(-2),cy-1+hy(-2),'#1e2e3a',1,10);
      px(cx+11+hx(-2),cy+9+hy(-2),'#1a2434',20,2); px(cx+14+hx(-2),cy-3+hy(-2),'#869eb0',8,1);
      // breathing: heated chest glow
      px(cx-8,cy+22+bi,'#ae3800',16,24);px(cx-9,cy+24+bi,'#8c2800',2,22);px(cx+7,cy+25+bi,'#8c2800',2,18);
      px(cx-7,cy+23+bi,'#e8500e',10,7);px(cx-5,cy+28+bi,'#d64404',8,9);px(cx-4,cy+35+bi,'#bc3404',6,9);
      px(cx-3,cy+42+bi,'#a42400',4,4);px(cx-1,cy+45+bi,'#8c1e00',2,2);
      px(cx-5,cy+24+bi,'#ff6826',2,4);px(cx,cy+28+bi,'#ff5816',2,5);px(cx-3,cy+35+bi,'#e44a06',2,4);
      px(cx-1,cy+44+bi,'#761800',3,3);px(cx,cy+46+bi,'#5c1c00',1,2);
      px(cx-6,cy+22+bi,'#ba4400',12,4);px(cx-5,cy+22+bi,'#dc5a0c',10,2);px(cx-2,cy+24+bi,'#621800',5,1);
      // head
      px(cx-7,cy+12+bi,'#aa6044',14,12);px(cx-7,cy+12+bi,'#7a4434',2,10);px(cx+5,cy+12+bi,'#7a4434',2,10);
      px(cx-5,cy+12+bi,'#c27a5a',6,7);
      px(cx-5,cy+14+bi,'#461a00',5,3);px(cx+1,cy+14+bi,'#461a00',5,3);
      px(cx-4,cy+14+bi,'#662400',3,2);px(cx+2,cy+14+bi,'#662400',3,2);
      px(cx-5,cy+17+bi,'#090502',3,4);px(cx+2,cy+17+bi,'#090502',3,4);
      px(cx-4,cy+17+bi,'#c05c2c',1,1);px(cx+3,cy+17+bi,'#c05c2c',1,1);
      px(cx-5,cy+20+bi,'#160e04',2,1);px(cx+3,cy+20+bi,'#160e04',2,1);
      px(cx-1,cy+20+bi,'#7a4434',3,4);px(cx,cy+22+bi,'#582c24',2,2);
      px(cx-2,cy+21+bi,'#8a5040',1,2);px(cx+2,cy+21+bi,'#664026',1,2);
      px(cx-6,cy+18+bi,'#b64440',3,3);px(cx+3,cy+18+bi,'#b64440',3,3);
      px(cx-5,cy+19+bi,'#ca5044',2,2);px(cx+4,cy+19+bi,'#bc4440',2,2);
      px(cx-2,cy+22+bi,'#9a5440',5,2);
      // helmet
      px(cx-7,cy+0+bi,'#364658',14,11);px(cx-5,cy-2+bi,'#364658',10,3);
      px(cx-3,cy-3+bi,'#364658',6,2);px(cx-1,cy-4+bi,'#364658',2,2);
      px(cx-6,cy+0+bi,'#546678',12,2);px(cx-4,cy-1+bi,'#566880',8,2);
      px(cx-2,cy-2+bi,'#667c8c',4,1);px(cx-3,cy+1+bi,'#7c9698',4,1);px(cx-1,cy+0+bi,'#90aab8',2,1);
      px(cx+4,cy+0+bi,'#26343c',5,9);px(cx+6,cy+1+bi,'#1e2a34',3,7);
      px(cx-5,cy+4+bi,'#2a3846',1,3);px(cx+4,cy+4+bi,'#2a3846',1,3);
      // shoulder armor (breathes)
      px(cx-11,cy+11+bi,'#46586a',22,4);px(cx-11,cy+11+bi,'#566e80',22,1);px(cx-11,cy+13+bi,'#2c3948',22,2);
      px(cx-9,cy+12+bi,'#6484a6',2,2);px(cx+7,cy+12+bi,'#6484a6',2,2);px(cx-2,cy+12+bi,'#6484a6',5,2);
      px(cx-11,cy+14+bi,'#2e3848',4,14);px(cx-10,cy+15+bi,'#3e4a5c',3,12);
      px(cx-11,cy+26+bi,'#1e2632',4,3);px(cx-10,cy+16+bi,'#4e5a6c',2,4);
      px(cx+7,cy+14+bi,'#2e3848',4,14);px(cx+8,cy+15+bi,'#3e4a5c',3,12);
      px(cx+7,cy+26+bi,'#1e2632',4,3);px(cx+8,cy+16+bi,'#4e5a6c',2,4);
      // spine
      px(cx-1,cy+5+bi,'#566a7a',3,18);px(cx,cy+6+bi,'#768ea4',1,16);
      px(cx-1,cy+5+bi,'#38484a',1,18);px(cx-1,cy+5+bi,'#6484a4',3,2);
      px(cx-1,cy-5+bi,'#465a6c',3,3);px(cx,cy-5+bi,'#748aaa',1,2);px(cx,cy-6+bi,'#768caa',1,1);
      px(cx-9,cy+3+bi,'#2c3846',1,3);px(cx-8,cy+4+bi,'#2c3846',2,1);
      px(cx+7,cy+3+bi,'#2c3846',1,3);px(cx+8,cy+4+bi,'#2c3846',2,1);
    }

    // ── main loop ─────────────────────────────────────────────────────────────

    function drawScene(time: number, breathe: number, hb: number, hbx: number, flash: boolean) {
      g.clearRect(0, 0, W, H);
      wall();
      flr(110);
      forgeGlow(time);
      forge(FX, FY, time);
      anvil(AX, AY);
      hot(WX, WY, time, flash);
      smith(CX, CY, breathe, hb, hbx);
    }

    function frame(ts: number) {
      const dt = lastTs === null ? 1 / 60 : Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      t += dt;

      // Check for new external strike trigger
      if (strikeRef.current !== lastStrike) {
        lastStrike   = strikeRef.current;
        hammerActive = true;
        hammerT      = 0;
        impactArmed  = true;
      }

      // Advance hammer animation
      if (hammerActive) {
        hammerT += dt;
        if (hammerT >= STRIKE_DURATION) {
          hammerActive = false;
          hammerT      = STRIKE_DURATION;
        }
      }

      // Particles (embers + smoke always; sparks only on impact)
      if (Math.random() < 0.40) spawnEmber();
      if (Math.random() < 0.06) spawnSmoke();

      const hb  = hammerActive ? strikeY(hammerT) : 0;
      const hbx = hammerActive ? strikeX(hammerT) : 0;
      const frac = hammerT / STRIKE_DURATION;
      const isImpact = hammerActive && frac >= 0.40 && frac < 0.55;

      if (isImpact && impactArmed) { spawnImpactSparks(); impactArmed = false; }

      // Breathing always runs
      const breathe = Math.sin(t * (Math.PI * 2 / 5.5)) * 1.3;

      drawScene(t, breathe, hb, hbx, isImpact);
      tickAndDrawParticles(dt);

      animId = requestAnimationFrame(frame);
    }

    if (noM) {
      drawScene(0, 0, 0, 0, false);
    } else {
      animId = requestAnimationFrame(frame);
    }

    return () => cancelAnimationFrame(animId);
  }, [canvasRef]);
}
