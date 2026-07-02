import { TokenizationState } from './types';

const VOCAB_IDS: Record<string, number> = {
  'The': 464, ' cat': 3797, ' sat': 3452, ' on': 319, ' the': 262, ' mat': 18104,
  ' and': 290, ' went': 1816, ' to': 284, ' sleep': 5372, ' under': 742, ' a': 257,
  ' warm': 3410, ' rug': 8412
};

export function initTokenization(): TokenizationState {
  return { sentence: '', tokens: [], scanIndex: 0, timer: 0 };
}

export function updateAndRenderTokenization(
  ctx: CanvasRenderingContext2D,
  state: TokenizationState,
  promptTokens: string[]
) {
  state.timer += 16.67;
  const sentence = promptTokens.join('');
  if (state.tokens.length !== promptTokens.length) {
    let currentX = -200;
    state.tokens = promptTokens.map(text => {
      const id = VOCAB_IDS[text] || 999;
      const w = 55;
      const box = { text, id, x: currentX, y: -10, width: w, height: 28, isFlipped: false };
      currentX += w + 12;
      return box;
    });
  }
  if (state.timer >= 1200) {
    state.scanIndex = (state.scanIndex + 1) % (state.tokens.length + 1);
    state.timer = 0;
  }
  ctx.font = '9px Geist Mono, Courier New, monospace';
  ctx.fillStyle = '#18181b';
  ctx.fillText(`INPUT STRING: "${sentence}"`, -200, -50);
  state.tokens.forEach((t, idx) => {
    const isScanning = idx === state.scanIndex;
    ctx.strokeStyle = isScanning ? '#2563eb' : 'rgba(24, 24, 27, 0.15)';
    ctx.lineWidth = isScanning ? 1.5 : 1;
    ctx.fillStyle = isScanning ? 'rgba(37, 99, 235, 0.05)' : '#ffffff';
    ctx.beginPath(); ctx.roundRect(t.x, t.y, t.width, t.height, 4); ctx.fill(); ctx.stroke();
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
