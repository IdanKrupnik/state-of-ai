import { TokenTreeState } from './types';

const PREDICTIONS: Record<string, { word: string; prob: number }[]> = {
  'The cat sat': [{ word: 'on', prob: 80 }, { word: 'under', prob: 14 }, { word: 'inside', prob: 6 }],
  'The cat sat on': [{ word: 'the', prob: 92 }, { word: 'a', prob: 6 }, { word: 'some', prob: 2 }],
  'The cat sat on the': [{ word: 'mat', prob: 74 }, { word: 'rug', prob: 18 }, { word: 'sofa', prob: 8 }],
  'The cat sat on the mat': [{ word: 'and', prob: 85 }, { word: 'but', prob: 10 }, { word: 'then', prob: 5 }],
  'The cat sat on the mat and': [{ word: 'went', prob: 78 }, { word: 'began', prob: 15 }, { word: 'started', prob: 7 }],
  'The cat sat on the mat and went': [{ word: 'to', prob: 95 }, { word: 'under', prob: 3 }, { word: 'inside', prob: 2 }],
  'The cat sat on the mat and went to': [{ word: 'sleep', prob: 88 }, { word: 'play', prob: 8 }, { word: 'eat', prob: 4 }],
  'The cat sat on the mat and went to sleep': [{ word: 'under', prob: 70 }, { word: 'on', prob: 20 }, { word: 'near', prob: 10 }],
  'The cat sat on the mat and went to sleep under': [{ word: 'a', prob: 90 }, { word: 'the', prob: 8 }, { word: 'some', prob: 2 }],
  'The cat sat on the mat and went to sleep under a': [{ word: 'warm', prob: 65 }, { word: 'soft', prob: 25 }, { word: 'thick', prob: 10 }],
  'The cat sat on the mat and went to sleep under a warm': [{ word: 'rug', prob: 84 }, { word: 'blanket', prob: 12 }, { word: 'towel', prob: 4 }]
};

export function initTokenTree(): TokenTreeState {
  return { stepIndex: 0, typedText: '', targetText: '', state: 'typing', timer: 0, cursorBlink: true };
}

function getWrappedLines(text: string, maxWidthChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  words.forEach(w => {
    const test = current + (current ? ' ' : '') + w;
    if (test.length > maxWidthChars) {
      if (current) lines.push(current);
      current = w;
    } else current = test;
  });
  if (current) lines.push(current);
  return lines;
}

export function updateAndRenderTokenTree(
  ctx: CanvasRenderingContext2D,
  state: TokenTreeState,
  promptTokens: string[]
) {
  state.timer += 16.67;
  if (state.timer % 500 < 16.67) state.cursorBlink = !state.cursorBlink;
  const sentence = promptTokens.join('');
  const prevSentence = promptTokens.slice(0, -1).join('');
  if (state.targetText !== sentence) {
    state.typedText = prevSentence;
    state.targetText = sentence;
    state.state = 'typing';
    state.timer = 0;
  }
  if (state.state === 'typing') {
    if (state.timer >= 80) {
      state.timer = 0;
      if (state.typedText.length < state.targetText.length) {
        state.typedText = state.targetText.slice(0, state.typedText.length + 1);
      } else state.state = 'branching';
    }
  }
  ctx.font = '10px Geist Mono, Courier New, monospace'; ctx.fillStyle = '#18181b';
  const startX = -180; const startY = -20;
  const lines = getWrappedLines(state.typedText, 25);
  lines.forEach((line, idx) => {
    ctx.fillText(line, startX, startY + idx * 16);
  });
  const lastLine = lines[lines.length - 1] || '';
  const textWidth = ctx.measureText(lastLine).width;
  const lastLineY = startY + (lines.length - 1) * 16;
  if (state.state === 'typing' && state.cursorBlink) {
    ctx.fillRect(startX + textWidth + 2, lastLineY - 8, 5, 10);
  }
  const activePred = PREDICTIONS[sentence.trim()] || [{ word: 'next', prob: 99 }];
  if (state.state === 'branching' || state.state === 'committing') {
    const branchX = startX + textWidth + 8;
    const branchProgress = state.state === 'committing' ? 1 : Math.min(1, state.timer / 600);
    activePred.forEach((b, bIdx) => {
      const targetY = lastLineY + (bIdx - 1) * 30;
      const y = lastLineY + (targetY - lastLineY) * branchProgress;
      const x = branchX + 40 * branchProgress;
      const isWinner = bIdx === 0;
      const activeColor = state.state === 'committing' && isWinner;
      ctx.strokeStyle = activeColor ? '#2563eb' : 'rgba(24, 24, 27, 0.15)'; ctx.lineWidth = activeColor ? 1.5 : 1;
      ctx.beginPath(); ctx.moveTo(branchX, lastLineY - 3); ctx.lineTo(x, y - 3); ctx.stroke();
      if (branchProgress >= 0.8) {
        ctx.font = '8px Geist Mono, Courier New, monospace';
        ctx.fillStyle = activeColor ? '#2563eb' : 'rgba(24, 24, 27, 0.45)';
        ctx.fillText(`[${b.word}: ${b.prob}%]`, x + 5, y);
      }
    });
  }
}

export function handleTokenTreeClick(
  state: TokenTreeState,
  vx: number,
  vy: number,
  promptTokens: string[],
  setPromptTokens: React.Dispatch<React.SetStateAction<string[]>>
): boolean {
  if (state.state !== 'branching') return false;
  const sentence = promptTokens.join('');
  const startX = -180; const startY = -20;
  const lines = getWrappedLines(state.typedText, 25);
  const lastLine = lines[lines.length - 1] || '';
  const lastLineY = startY + (lines.length - 1) * 16;
  const textWidth = lastLine.length * 6;
  const branchX = startX + textWidth + 48;
  const activePred = PREDICTIONS[sentence.trim()] || [{ word: 'next', prob: 99 }];
  for (let bIdx = 0; bIdx < activePred.length; bIdx++) {
    const b = activePred[bIdx];
    const targetY = lastLineY + (bIdx - 1) * 30;
    const dx = vx - branchX; const dy = vy - targetY;
    if (dx >= 0 && dx <= 100 && Math.abs(dy) <= 15) {
      state.state = 'committing';
      state.timer = 0;
      const formattedWord = b.word.startsWith(' ') || sentence.endsWith(' ') ? b.word : ' ' + b.word;
      setPromptTokens(prev => [...prev, formattedWord]);
      return true;
    }
  }
  return false;
}
