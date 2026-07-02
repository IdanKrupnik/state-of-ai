import { CanvasTooltipItem } from './types';

const TOOLTIPS: CanvasTooltipItem[] = [
  { id: 'vocab', exhibitX: -1200, lx: -100, ly: 40, term: 'Vocab ID', definition: 'A digital ID card for words! Computers are terrible at spelling but great at math, so they swap every word for a unique number.' },
  { id: 'slice', exhibitX: -1200, lx: -20, ly: -50, term: 'Token Slicing', definition: 'Chops sentences into bite-sized word chunks. Think of it as pre-chewing text so the AI doesn\'t choke on long prompts.' },
  { id: 'embed', exhibitX: -400, lx: 90, ly: -183, term: 'Embedding Vector', definition: 'A semantic map of the universe. Words with similar vibes (like "coffee" and "morning") are parked next to each other on a grid.' },
  { id: 'att', exhibitX: -400, lx: 90, ly: 167, term: 'Attention Weights', definition: 'Fires virtual laser beams to measure context. It checks how much words care about each other (like "cat" caring about "mat").' },
  { id: 'w', exhibitX: 400, lx: 60, ly: -90, term: 'Synaptic Weights', definition: 'Synapse volume dials! They act like dial knobs that turn up the volume on important signals and mute the useless ones.' },
  { id: 'act', exhibitX: 400, lx: 60, ly: 90, term: 'Activation Function', definition: 'The ultimate filter gatekeeper! It inspects signals and only lets the loud, important ones pass to the next stage.' },
  { id: 'prob', exhibitX: 1200, lx: 155, ly: -183, term: 'Probability Tree', definition: 'A forecast of candidate words. The AI calculates which word is most likely to win the next spot in the sentence.' },
  { id: 'auto', exhibitX: 0, lx: 60, ly: -255, term: 'Autoregressive Loop', definition: 'Recycling at its finest! The AI feeds its own output back into its input over and over to compose full sentences.' }
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
    ctx.beginPath(); ctx.roundRect(gx + 12, t.ly - 60, 280, 95, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#18181b'; ctx.font = 'bold 12px Geist Mono, Courier New, monospace';
    ctx.fillText(`${t.term.toUpperCase()}:`, gx + 24, t.ly - 40);
    ctx.fillStyle = 'rgba(24, 24, 27, 0.7)'; ctx.font = '10.5px Geist Mono, Courier New, monospace';
    const words = t.definition.split(' ');
    let line = ''; let yOffset = -22;
    words.forEach(w => {
      if (ctx.measureText(line + w).width > 240) {
        ctx.fillText(line, gx + 24, t.ly + yOffset);
        line = w + ' '; yOffset += 13;
      } else line += w + ' ';
    });
    ctx.fillText(line, gx + 24, t.ly + yOffset);
  }
}

export function checkTooltipClick(vx: number, vy: number): boolean {
  return TOOLTIPS.some(t => Math.hypot(t.exhibitX + t.lx - vx, t.ly - vy) < 8);
}
