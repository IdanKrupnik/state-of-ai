import { CanvasTooltipItem } from './types';

const TOOLTIPS: CanvasTooltipItem[] = [
  {
    id: 'vocab',
    exhibitX: -1200,
    lx: 55, ly: -53,
    term: 'Vocab ID',
    definition: 'A unique index number assigned to every word in the dictionary so the computer can calculate text.'
  },
  {
    id: 'embeddings',
    exhibitX: -400,
    lx: 100, ly: -183,
    term: 'Embedding',
    definition: 'A coordinate location in vector space representing a word\'s core definition.'
  },
  {
    id: 'attention',
    exhibitX: -400,
    lx: 90, ly: 167,
    term: 'Attention Weights',
    definition: 'Scores showing how much words in a sentence relate to each other (e.g. "sat" connects to "mat").'
  },
  {
    id: 'backprop',
    exhibitX: 400,
    lx: 100, ly: 167,
    term: 'Backpropagation',
    definition: 'The learning process where prediction errors are sent backward to fine-tune neuron connections.'
  },
  {
    id: 'prob-tree',
    exhibitX: 1200,
    lx: 120, ly: -183,
    term: 'Probability Tree',
    definition: 'A list of potential upcoming words scored by likelihood (e.g. "mat" has a 72% chance).'
  }
];

export function renderTooltipsAndCheckHover(
  ctx: CanvasRenderingContext2D,
  vx: number,
  vy: number
) {
  let activeTooltip: CanvasTooltipItem | null = null;
  TOOLTIPS.forEach(t => {
    const gx = t.exhibitX + t.lx;
    const gy = t.ly;
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(gx, gy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 7px Geist Mono, Courier New, monospace';
    ctx.fillText('?', gx - 2, gy + 2.5);
    if (Math.hypot(gx - vx, gy - vy) < 8) {
      activeTooltip = t;
    }
  });
  if (activeTooltip) {
    const t = activeTooltip as CanvasTooltipItem;
    const gx = t.exhibitX + t.lx;
    const gy = t.ly;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(gx + 10, gy - 30, 160, 48, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 7px Geist Mono, Courier New, monospace';
    ctx.fillText(`${t.term.toUpperCase()}:`, gx + 15, gy - 18);
    ctx.fillStyle = 'rgba(24, 24, 27, 0.7)';
    ctx.font = '6px Geist Mono, Courier New, monospace';
    const words = t.definition.split(' ');
    let line = '';
    let yOffset = -8;
    words.forEach(w => {
      if (ctx.measureText(line + w).width > 140) {
        ctx.fillText(line, gx + 15, gy + yOffset);
        line = w + ' ';
        yOffset += 8;
      } else {
        line += w + ' ';
      }
    });
    ctx.fillText(line, gx + 15, gy + yOffset);
  }
}

export function checkTooltipClick(vx: number, vy: number): boolean {
  return TOOLTIPS.some(t => Math.hypot(t.exhibitX + t.lx - vx, t.ly - vy) < 8);
}
