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
  state: NeuralNetState,
  nnStep: number
) {
  const { nodes, pulses } = state;
  if (Math.random() < 0.04 && pulses.length < 10) {
    if (nnStep === 0) {
      nodes[0][Math.floor(Math.random() * nodes[0].length)].flare = 1.0;
    } else if (nnStep === 1) {
      pulses.push({
        fromLayer: 0, fromIndex: Math.floor(Math.random() * nodes[0].length),
        toLayer: 1, toIndex: Math.floor(Math.random() * nodes[1].length),
        progress: 0, speed: 0.02
      });
    } else if (nnStep === 2) {
      pulses.push({
        fromLayer: 1, fromIndex: Math.floor(Math.random() * nodes[1].length),
        toLayer: 2, toIndex: Math.floor(Math.random() * nodes[2].length),
        progress: 0, speed: 0.02
      });
    } else if (nnStep === 3) {
      pulses.push({
        fromLayer: 2, fromIndex: Math.floor(Math.random() * nodes[2].length),
        toLayer: 3, toIndex: Math.floor(Math.random() * nodes[3].length),
        progress: 0, speed: 0.02
      });
    } else if (nnStep === 4) {
      const fromL = 1 + Math.floor(Math.random() * 3);
      pulses.push({
        fromLayer: fromL, fromIndex: Math.floor(Math.random() * nodes[fromL].length),
        toLayer: fromL - 1, toIndex: Math.floor(Math.random() * nodes[fromL - 1].length),
        progress: 0, speed: 0.02
      });
    }
  }
  nodes.forEach(layer => layer.forEach(n => {
    if (n.flare > 0) n.flare -= 0.04;
  }));
  for (let i = pulses.length - 1; i >= 0; i--) {
    const p = pulses[i];
    p.progress += p.speed;
    if (p.progress >= 1) {
      nodes[p.toLayer][p.toIndex].flare = 1.0;
      pulses.splice(i, 1);
    }
  }
  ctx.strokeStyle = 'rgba(24, 24, 27, 0.08)';
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
    ctx.strokeStyle = nnStep === 4 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(37, 99, 235, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.fillStyle = nnStep === 4 ? '#ef4444' : '#2563eb';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  nodes.forEach((layer, lIdx) => {
    layer.forEach(n => {
      const isLayerActive = nnStep === 0 && lIdx === 0;
      ctx.fillStyle = n.flare > 0 || isLayerActive ? 'rgba(37, 99, 235, 0.15)' : '#ffffff';
      ctx.strokeStyle = n.flare > 0 || isLayerActive ? (nnStep === 4 ? '#ef4444' : '#2563eb') : 'rgba(24, 24, 27, 0.2)';
      ctx.lineWidth = n.flare > 0 || isLayerActive ? 2 : 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  });
}
