import { NeuralNetState } from './types';

export function initNeuralNet(): NeuralNetState {
  const layerSizes = [4, 5, 5, 3];
  const xOffset = -1000;
  const xSpacing = 120;
  const ySpacing = 65;
  const nodes = layerSizes.map((size, lIdx) => {
    const layerYStart = -((size - 1) * ySpacing) / 2;
    return Array.from({ length: size }, (_, nIdx) => ({
      x: xOffset + lIdx * xSpacing,
      y: layerYStart + nIdx * ySpacing,
      flare: 0,
    }));
  });
  return { nodes, pulses: [] };
}

export function updateAndRenderNeuralNet(
  ctx: CanvasRenderingContext2D,
  state: NeuralNetState
) {
  const { nodes, pulses } = state;
  if (Math.random() < 0.04 && pulses.length < 12) {
    pulses.push({
      fromLayer: 0,
      fromIndex: Math.floor(Math.random() * nodes[0].length),
      toLayer: 1,
      toIndex: Math.floor(Math.random() * nodes[1].length),
      progress: 0,
      speed: 0.015 + Math.random() * 0.015,
    });
  }
  nodes.forEach(layer => layer.forEach(n => {
    if (n.flare > 0) n.flare -= 0.04;
  }));
  for (let i = pulses.length - 1; i >= 0; i--) {
    const p = pulses[i];
    p.progress += p.speed;
    if (p.progress >= 1) {
      nodes[p.toLayer][p.toIndex].flare = 1.0;
      const nextLayer = p.toLayer + 1;
      if (nextLayer < nodes.length) {
        pulses.push({
          fromLayer: p.toLayer,
          fromIndex: p.toIndex,
          toLayer: nextLayer,
          toIndex: Math.floor(Math.random() * nodes[nextLayer].length),
          progress: 0,
          speed: 0.015 + Math.random() * 0.015,
        });
      }
      pulses.splice(i, 1);
    }
  }
  ctx.strokeStyle = 'rgba(63, 63, 70, 0.2)';
  ctx.lineWidth = 1;
  for (let l = 0; l < nodes.length - 1; l++) {
    nodes[l].forEach(from => {
      nodes[l + 1].forEach(to => {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
    });
  }
  pulses.forEach(p => {
    const from = nodes[p.fromLayer][p.fromIndex];
    const to = nodes[p.toLayer][p.toIndex];
    const x = from.x + (to.x - from.x) * p.progress;
    const y = from.y + (to.y - from.y) * p.progress;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  nodes.forEach(layer => {
    layer.forEach(n => {
      ctx.fillStyle = n.flare > 0 ? `rgba(14, 165, 233, ${0.2 + n.flare * 0.5})` : '#18181b';
      ctx.strokeStyle = n.flare > 0 ? '#38bdf8' : 'rgba(228, 228, 231, 0.2)';
      ctx.lineWidth = n.flare > 0 ? 2 : 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  });
}
