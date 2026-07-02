import { CanvasTooltipItem } from './types';

const TOOLTIPS: CanvasTooltipItem[] = [
  { id: 'vocab', exhibitX: -1200, lx: -100, ly: 40, term: 'Vocab ID', definition: 'A unique integer representing a token in the model\'s vocabulary database.' },
  { id: 'slice', exhibitX: -1200, lx: -20, ly: -50, term: 'Token Slicing', definition: 'Chopping prompt strings into clean chunks based on whitespace or character patterns.' },
  { id: 'embed', exhibitX: -400, lx: 90, ly: -183, term: 'Embedding Vector', definition: 'A coordinate coordinate representing a word\'s core definition.' },
  { id: 'att', exhibitX: -400, lx: 90, ly: 167, term: 'Attention Weights', definition: 'Laser scores highlighting connection strengths between prompt context words.' },
  { id: 'w', exhibitX: 400, lx: 60, ly: -90, term: 'Synaptic Weights', definition: 'Multiplier values on connection lines scaling signals during feed-forward passes.' },
  { id: 'act', exhibitX: 400, lx: 60, ly: 90, term: 'Activation Function', definition: 'Non-linear filter determining if a neuron fires based on input values.' },
  { id: 'prob', exhibitX: 1200, lx: 155, ly: -183, term: 'Probability Tree', definition: 'Branches showing upcoming candidate word options and likelihoods.' },
  { id: 'auto', exhibitX: 0, lx: 60, ly: -255, term: 'Autoregressive Loop', definition: 'Feeding predicted outputs back as inputs to generate words recursively.' }
];

export function renderTooltipsAndCheckHover(ctx: CanvasRenderingContext2D, vx: number, vy: number) {
  let active: CanvasTooltipItem | null = null;
  TOOLTIPS.forEach(t => {
    const gx = t.exhibitX + t.lx;
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1; ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(gx, t.ly, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2563eb'; ctx.font = 'bold 7px Geist Mono, Courier New, monospace';
    ctx.fillText('?', gx - 2, t.ly + 2.5);
    if (Math.hypot(gx - vx, t.ly - vy) < 8) active = t;
  });
  if (active) {
    const t = active as CanvasTooltipItem;
    const gx = t.exhibitX + t.lx;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)'; ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.roundRect(gx + 10, t.ly - 30, 160, 48, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#18181b'; ctx.font = 'bold 7px Geist Mono, Courier New, monospace';
    ctx.fillText(`${t.term.toUpperCase()}:`, gx + 15, t.ly - 18);
    ctx.fillStyle = 'rgba(24, 24, 27, 0.7)'; ctx.font = '6px Geist Mono, Courier New, monospace';
    const words = t.definition.split(' ');
    let line = ''; let yOffset = -8;
    words.forEach(w => {
      if (ctx.measureText(line + w).width > 140) {
        ctx.fillText(line, gx + 15, t.ly + yOffset);
        line = w + ' '; yOffset += 8;
      } else line += w + ' ';
    });
    ctx.fillText(line, gx + 15, t.ly + yOffset);
  }
}

export function checkTooltipClick(vx: number, vy: number): boolean {
  return TOOLTIPS.some(t => Math.hypot(t.exhibitX + t.lx - vx, t.ly - vy) < 8);
}
