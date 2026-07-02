import { TokenizationState } from './types';

export function initTokenization(): TokenizationState {
  const rawTokens = [
    { text: 'The', id: 464 },
    { text: ' cat', id: 3797 },
    { text: ' sat', id: 3452 },
    { text: ' on', id: 319 },
    { text: ' the', id: 262 },
    { text: ' mat', id: 18104 }
  ];
  let currentX = -200;
  const tokens = rawTokens.map(t => {
    const w = 55;
    const box = {
      text: t.text,
      id: t.id,
      x: currentX,
      y: -10,
      width: w,
      height: 28,
      isFlipped: false
    };
    currentX += w + 12;
    return box;
  });
  return { sentence: 'The cat sat on the mat', tokens, scanIndex: 0, timer: 0 };
}

export function updateAndRenderTokenization(
  ctx: CanvasRenderingContext2D,
  state: TokenizationState
) {
  state.timer += 16.67;
  if (state.timer >= 1200) {
    state.scanIndex = (state.scanIndex + 1) % (state.tokens.length + 1);
    state.timer = 0;
  }
  ctx.font = '9px Geist Mono, Courier New, monospace';
  ctx.fillStyle = '#18181b';
  ctx.fillText('INPUT STRING: "The cat sat on the mat"', -200, -50);
  state.tokens.forEach((t, idx) => {
    const isScanning = idx === state.scanIndex;
    ctx.strokeStyle = isScanning ? '#2563eb' : 'rgba(24, 24, 27, 0.15)';
    ctx.lineWidth = isScanning ? 1.5 : 1;
    ctx.fillStyle = isScanning ? 'rgba(37, 99, 235, 0.05)' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(t.x, t.y, t.width, t.height, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isScanning ? '#2563eb' : '#18181b';
    ctx.font = 'bold 8px Geist Mono, Courier New, monospace';
    const content = t.isFlipped ? `ID: ${t.id}` : `"${t.text}"`;
    ctx.fillText(content, t.x + 8, t.y + 17);
    if (idx < state.scanIndex) {
      ctx.font = '6px Geist Mono, Courier New, monospace';
      ctx.fillStyle = 'rgba(24, 24, 27, 0.4)';
      ctx.fillText(`vocab[${t.id}]`, t.x + 8, t.y + 40);
    }
  });
}

export function handleTokenizationClick(state: TokenizationState, vx: number, vy: number): boolean {
  for (let i = 0; i < state.tokens.length; i++) {
    const t = state.tokens[i];
    if (vx >= t.x && vx <= t.x + t.width && vy >= t.y && vy <= t.y + t.height) {
      t.isFlipped = !t.isFlipped;
      return true;
    }
  }
  return false;
}
