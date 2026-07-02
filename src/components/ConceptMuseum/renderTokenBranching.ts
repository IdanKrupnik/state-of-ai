import { TokenTreeState, TreeStep } from './types';

const STEPS: TreeStep[] = [
  { text: 'The cat sat on the', branches: [{ word: 'mat', prob: 72 }, { word: 'rug', prob: 21 }, { word: 'fridge', prob: 7 }] },
  { text: 'The cat sat on the mat and went to', branches: [{ word: 'sleep', prob: 84 }, { word: 'eat', prob: 12 }, { word: 'play', prob: 4 }] },
  { text: 'The cat sat on the mat and went to sleep under the', branches: [{ word: 'bed', prob: 68 }, { word: 'table', prob: 24 }, { word: 'blanket', prob: 8 }] }
];

export function initTokenTree(): TokenTreeState {
  return {
    stepIndex: 0,
    typedText: '',
    targetText: STEPS[0].text,
    state: 'typing',
    timer: 0,
    cursorBlink: true,
  };
}

export function updateAndRenderTokenTree(
  ctx: CanvasRenderingContext2D,
  state: TokenTreeState
) {
  state.timer += 16.67;
  if (state.timer % 500 < 16.67) {
    state.cursorBlink = !state.cursorBlink;
  }
  const currentStep = STEPS[state.stepIndex];
  if (state.state === 'typing') {
    if (state.timer >= 80) {
      state.timer = 0;
      if (state.typedText.length < state.targetText.length) {
        state.typedText = state.targetText.slice(0, state.typedText.length + 1);
      } else {
        state.state = 'branching';
      }
    }
  } else if (state.state === 'branching') {
    if (state.timer >= 1200) {
      state.state = 'committing';
      state.timer = 0;
    }
  } else if (state.state === 'committing') {
    if (state.timer >= 1000) {
      state.timer = 0;
      const nextIndex = state.stepIndex + 1;
      if (nextIndex < STEPS.length) {
        state.stepIndex = nextIndex;
        state.typedText = STEPS[nextIndex - 1].text + ' ' + currentStep.branches[0].word;
        state.targetText = STEPS[nextIndex].text;
        state.state = 'typing';
      } else {
        state.state = 'finished';
      }
    }
  } else if (state.state === 'finished') {
    if (state.timer >= 3000) {
      Object.assign(state, initTokenTree());
    }
  }
  ctx.font = '10px Geist Mono, Courier New, monospace';
  ctx.fillStyle = '#f4f4f5';
  const startX = 650;
  const startY = 0;
  ctx.fillText(state.typedText, startX, startY);
  const textWidth = ctx.measureText(state.typedText).width;
  if (state.state === 'typing' && state.cursorBlink) {
    ctx.fillRect(startX + textWidth + 2, startY - 8, 5, 10);
  }
  if (state.state === 'branching' || state.state === 'committing') {
    const branchX = startX + textWidth + 8;
    const branchProgress = state.state === 'committing' ? 1 : Math.min(1, state.timer / 600);
    currentStep.branches.forEach((b, bIdx) => {
      const targetY = startY + (bIdx - 1) * 30;
      const y = startY + (targetY - startY) * branchProgress;
      const x = branchX + 40 * branchProgress;
      const isWinner = bIdx === 0;
      const activeColor = state.state === 'committing' && isWinner;
      ctx.strokeStyle = activeColor ? '#38bdf8' : 'rgba(228, 228, 231, 0.2)';
      ctx.lineWidth = activeColor ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(branchX, startY - 3);
      ctx.lineTo(x, y - 3);
      ctx.stroke();
      if (branchProgress >= 0.8) {
        ctx.font = '8px Geist Mono, Courier New, monospace';
        ctx.fillStyle = activeColor ? '#38bdf8' : 'rgba(228, 228, 231, 0.4)';
        ctx.fillText(`[${b.word}: ${b.prob}%]`, x + 5, y);
      }
    });
  }
}
