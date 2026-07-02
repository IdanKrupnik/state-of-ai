import { VectorSpaceState, VectorWord } from './types';

const CLUSTERS = [
  { hub: 'King', neighbors: ['Queen', 'Royal', 'Crown', 'Throne', 'Empire'] },
  { hub: 'AI', neighbors: ['Neural', 'Robot', 'Data', 'Compute', 'Model'] },
  { hub: 'Star', neighbors: ['Planet', 'Galaxy', 'Nebula', 'Cosmos', 'Orbit'] }
];

export function initVectorSpace(): VectorSpaceState {
  const stars = Array.from({ length: 180 }, () => ({
    x: -120 + Math.random() * 240,
    y: -120 + Math.random() * 240,
    vx: (Math.random() - 0.5) * 0.05,
    vy: (Math.random() - 0.5) * 0.05,
    alpha: 0.15 + Math.random() * 0.35,
  }));
  const words: VectorWord[] = [];
  CLUSTERS.forEach((c, cIdx) => {
    const cx = -100 + Math.random() * 200;
    const cy = -100 + Math.random() * 200;
    words.push({ text: c.hub, x: cx, y: cy, vx: (Math.random() - 0.5) * 0.05, vy: (Math.random() - 0.5) * 0.05, isHub: true, clusterId: cIdx });
    c.neighbors.forEach((n, nIdx) => {
      const angle = (nIdx / c.neighbors.length) * Math.PI * 2;
      const dist = 50 + Math.random() * 20;
      words.push({
        text: n,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        isHub: false,
        clusterId: cIdx
      });
    });
  });
  return { stars, words, activeIndex: 0, timer: 0 };
}

export function updateAndRenderVectorSpace(
  ctx: CanvasRenderingContext2D,
  state: VectorSpaceState
) {
  const { stars, words, activeIndex, timer } = state;
  state.timer += 16.67;
  if (state.timer >= 4000) {
    state.activeIndex = (activeIndex + 1) % CLUSTERS.length;
    state.timer = 0;
  }
  stars.forEach(s => {
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < -150 || s.x > 150) s.vx *= -1;
    if (s.y < -150 || s.y > 150) s.vy *= -1;
    ctx.fillStyle = `rgba(24, 24, 27, ${s.alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  });
  words.forEach(w => {
    w.x += w.vx;
    w.y += w.vy;
    if (w.x < -150 || w.x > 150) w.vx *= -1;
    if (w.y < -150 || w.y > 150) w.vy *= -1;
  });
  const currentCluster = CLUSTERS[activeIndex];
  const activeHub = words.find(w => w.text === currentCluster.hub);
  const activeNeighbors = words.filter(w => currentCluster.neighbors.includes(w.text));
  const laserOpacity = timer < 2000 ? 0.6 : Math.max(0, 0.6 - (timer - 2000) / 1000 * 0.6);
  if (activeHub && laserOpacity > 0) {
    activeNeighbors.forEach(n => {
      ctx.strokeStyle = `rgba(37, 99, 235, ${laserOpacity})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(activeHub.x, activeHub.y);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
    });
  }
  ctx.font = '7px Geist Mono, Courier New, monospace';
  words.forEach(w => {
    const isActive = w.text === currentCluster.hub || currentCluster.neighbors.includes(w.text);
    const inRange = isActive && laserOpacity > 0;
    ctx.fillStyle = inRange ? '#2563eb' : 'rgba(24, 24, 27, 0.4)';
    ctx.fillText(w.text, w.x - 10, w.y - 4);
    ctx.fillStyle = inRange ? '#2563eb' : 'rgba(24, 24, 27, 0.55)';
    ctx.beginPath();
    ctx.arc(w.x, w.y, w.isHub ? 2.5 : 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function handleVectorSpaceHover(state: VectorSpaceState, vx: number, vy: number) {
  for (let i = 0; i < state.words.length; i++) {
    const w = state.words[i];
    if (Math.hypot(w.x - vx, w.y - vy) < 18) {
      if (state.activeIndex !== w.clusterId) {
        state.activeIndex = w.clusterId;
        state.timer = 0;
      }
      break;
    }
  }
}
