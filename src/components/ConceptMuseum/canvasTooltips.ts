import { CanvasTooltipItem } from './types';

const TOOLTIPS: CanvasTooltipItem[] = [
  { id: 'vocab', exhibitX: -1200, lx: -100, ly: 40, term: 'Vocab ID', definition: 'A dictionary number representing a word. Computers cannot read letters, so they convert every word into a unique number.' },
  { id: 'slice', exhibitX: -1200, lx: -20, ly: -50, term: 'Token Slicing', definition: 'Splitting sentences into word pieces. This breaks text down into clean segments that the AI can easily digest.' },
  { id: 'embed', exhibitX: -400, lx: 90, ly: -183, term: 'Embedding Vector', definition: 'Mapping words onto a semantic grid. Words with similar meanings are placed close together on this map.' },
  { id: 'att', exhibitX: -400, lx: 90, ly: 167, term: 'Attention Weights', definition: 'Connections that link words. This measures how strongly words in a sentence relate to each other.' },
  { id: 'w', exhibitX: 400, lx: 60, ly: -90, term: 'Synaptic Weights', definition: 'Fidelity filters on neuron pathways. They act like knobs that scale signals as they flow through the neural net.' },
  { id: 'act', exhibitX: 400, lx: 60, ly: 90, term: 'Activation Function', definition: 'A filter determining if a node fires. It only lets strong, important signals pass through to the next layer.' },
  { id: 'prob', exhibitX: 1200, lx: 155, ly: -183, term: 'Probability Tree', definition: 'A list of potential next words. The AI calculates which word makes the most sense to output next.' },
  { id: 'auto', exhibitX: 0, lx: 60, ly: -255, term: 'Autoregressive Loop', definition: 'Recycling generated words. The chosen output is sent back to the start as new input to build sentences.' }
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
