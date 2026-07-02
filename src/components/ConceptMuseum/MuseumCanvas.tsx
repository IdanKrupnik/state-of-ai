import React, { useRef, useEffect } from 'react';
import { initTokenization, updateAndRenderTokenization, handleTokenizationClick } from './renderTokenization';
import { initNeuralNet, updateAndRenderNeuralNet, handleNeuralNetClick } from './renderNeuralNet';
import { initVectorSpace, updateAndRenderVectorSpace, handleVectorSpaceHover } from './renderVectorSpace';
import { initTokenTree, updateAndRenderTokenTree, handleTokenTreeClick } from './renderTokenBranching';
import { renderTooltipsAndCheckHover, checkTooltipClick } from './canvasTooltips';

export interface MuseumCanvasProps {
  targetPanX: number;
  targetPanY: number;
  targetZoom: number;
  nnStep: number;
  promptTokens: string[];
  setPromptTokens: React.Dispatch<React.SetStateAction<string[]>>;
  isRecycling?: boolean;
  onLoopReset?: () => void;
}

export const MuseumCanvas: React.FC<MuseumCanvasProps> = ({ targetPanX, targetPanY, targetZoom, nnStep, promptTokens, setPromptTokens, isRecycling, onLoopReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transRef = useRef({ zoom: targetZoom, panX: targetPanX, panY: targetPanY, isDragging: false, startX: 0, startY: 0, dragDist: 0 });
  const statesRef = useRef({ tokenization: initTokenization(), net: initNeuralNet(), vector: initVectorSpace(), token: initTokenTree() });
  const hasInteractedRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => { hasInteractedRef.current = false; }, [targetPanX, targetPanY, targetZoom]);

  useEffect(() => {
    if (isRecycling) {
      const sentence = promptTokens.join('');
      const PREDICTIONS: Record<string, { word: string; prob: number }[]> = {
        'The cat sat': [{ word: 'on', prob: 80 }],
        'The cat sat on': [{ word: 'the', prob: 92 }],
        'The cat sat on the': [{ word: 'mat', prob: 74 }],
        'The cat sat on the mat': [{ word: 'and', prob: 85 }],
        'The cat sat on the mat and': [{ word: 'went', prob: 78 }],
        'The cat sat on the mat and went': [{ word: 'to', prob: 95 }],
        'The cat sat on the mat and went to': [{ word: 'sleep', prob: 88 }],
        'The cat sat on the mat and went to sleep': [{ word: 'under', prob: 70 }],
        'The cat sat on the mat and went to sleep under': [{ word: 'a', prob: 90 }],
        'The cat sat on the mat and went to sleep under a': [{ word: 'warm', prob: 65 }],
        'The cat sat on the mat and went to sleep under a warm': [{ word: 'rug', prob: 84 }]
      };
      const activePred = PREDICTIONS[sentence.trim()] || [{ word: 'next', prob: 99 }];
      const winner = activePred[0];
      statesRef.current.token.typedText = sentence;
      statesRef.current.token.state = 'committing';
      statesRef.current.token.timer = 0;
      statesRef.current.token.pendingWord = (winner.word.startsWith(' ') || sentence.endsWith(' ') ? winner.word : ' ' + winner.word);
    }
  }, [isRecycling, promptTokens]);

  useEffect(() => {
    statesRef.current.tokenization = initTokenization();
    statesRef.current.net = initNeuralNet();
    statesRef.current.vector = initVectorSpace();
    statesRef.current.token = initTokenTree();
  }, [nnStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext('2d')) return;
    const ctx = canvas.getContext('2d')!;
    let animFrameId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    const render = () => {
      ctx.fillStyle = '#fcfbfa'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (!transRef.current.isDragging && !hasInteractedRef.current) {
        transRef.current.panX += (targetPanX - transRef.current.panX) * 0.08;
        transRef.current.panY += (targetPanY - transRef.current.panY) * 0.08;
        transRef.current.zoom += (targetZoom - transRef.current.zoom) * 0.08;
      }
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(transRef.current.zoom, transRef.current.zoom);
      ctx.translate(transRef.current.panX, transRef.current.panY);
      ctx.strokeStyle = 'rgba(24, 24, 27, 0.04)'; ctx.lineWidth = 1;
      const size = 40; const range = 2000;
      for (let x = -range; x <= range; x += size) {
        ctx.beginPath(); ctx.moveTo(x, -range); ctx.lineTo(x, range); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-range, x); ctx.lineTo(range, x); ctx.stroke();
      }
      ctx.font = 'bold 8px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT A // TEXT CHOPPING & WORD ID CODES', -1320, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• Slices sentences into separate, bite-sized word boxes.', -1320, 60);
      ctx.fillText('• Click word cards to flip and reveal their secret numeric codes.', -1320, 72);
      ctx.fillText('INPUT TEXT', -1200, -8);
      ctx.fillText('VOCAB ID', -1200, 30);
      ctx.fillText('TOKEN SLICING', -1320, -50);

      ctx.font = 'bold 8px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT B // THE COSMIC DICTIONARY GRID', -520, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• Maps words as stars based on their "meaning vibes".', -520, 140);
      ctx.fillText('• Hover over stars to shoot lasers showing context links.', -520, 152);
      ctx.fillText('EMBEDDING VECTOR', -400, -170);
      ctx.fillText('ATTENTION WEIGHTS', -400, 160);

      ctx.font = 'bold 8px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT C // CALCULATING THE ANSWER', 280, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• Electric pulses run logic forward through a dense web.', 280, 150);
      ctx.fillText('• Click circular neuron nodes to fire a custom test pulse.', 280, 162);
      ctx.fillText('INPUT SYNAPSE', 220, 10);
      ctx.fillText('OUTPUT PREDICTION', 500, 10);
      ctx.fillText('SYNAPTIC WEIGHTS', 400, -90);
      ctx.fillText('ACTIVATION FUNCTION', 400, 90);

      ctx.font = 'bold 8px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT D // DECIDING THE NEXT WORD', 1050, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• The AI forecasts candidate branches for the next word.', 1050, 60);
      ctx.fillText('• Click any branch choice to override what the AI types next.', 1050, 72);
      ctx.fillText('PROMPT SO FAR', 650, -8);
      ctx.fillText('PREDICTED TOKENS', 930, 20);
      ctx.fillText('PROBABILITY TREE', 1200, -170);



      ctx.save(); ctx.translate(-1200, 0); updateAndRenderTokenization(ctx, statesRef.current.tokenization, promptTokens); ctx.restore();
      ctx.save(); ctx.translate(-400, 0); updateAndRenderVectorSpace(ctx, statesRef.current.vector); ctx.restore();
      ctx.save(); ctx.translate(400, 0); updateAndRenderNeuralNet(ctx, statesRef.current.net, nnStep); ctx.restore();
      ctx.save(); ctx.translate(1200, 0); updateAndRenderTokenTree(ctx, statesRef.current.token, promptTokens, setPromptTokens, onLoopReset); ctx.restore();
      
      const rect = canvas.getBoundingClientRect();
      const mouseVx = (mousePosRef.current.x - rect.left - canvas.width / 2) / transRef.current.zoom - transRef.current.panX;
      const mouseVy = (mousePosRef.current.y - rect.top - canvas.height / 2) / transRef.current.zoom - transRef.current.panY;
      renderTooltipsAndCheckHover(ctx, mouseVx, mouseVy);
      ctx.restore();
      animFrameId = requestAnimationFrame(render);
    };
    render();
    return () => { cancelAnimationFrame(animFrameId); window.removeEventListener('resize', resize); };
  }, [targetPanX, targetPanY, targetZoom, nnStep, promptTokens]);

  const getVirtualCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!; const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - canvas.width / 2) / transRef.current.zoom - transRef.current.panX,
      y: (clientY - rect.top - canvas.height / 2) / transRef.current.zoom - transRef.current.panY
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    transRef.current.isDragging = true; transRef.current.dragDist = 0;
    transRef.current.startX = e.clientX; transRef.current.startY = e.clientY;
    hasInteractedRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
    const v = getVirtualCoords(e.clientX, e.clientY);
    handleVectorSpaceHover(statesRef.current.vector, v.x + 400, v.y);
    if (!transRef.current.isDragging) return;
    const dx = e.clientX - transRef.current.startX;
    const dy = e.clientY - transRef.current.startY;
    transRef.current.dragDist += Math.hypot(dx, dy);
    transRef.current.panX += dx / transRef.current.zoom;
    transRef.current.panY += dy / transRef.current.zoom;
    transRef.current.startX = e.clientX; transRef.current.startY = e.clientY;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (transRef.current.isDragging && transRef.current.dragDist < 5) {
      const v = getVirtualCoords(e.clientX, e.clientY);
      if (!checkTooltipClick(v.x, v.y)) {
        handleTokenizationClick(statesRef.current.tokenization, v.x + 1200, v.y);
        handleNeuralNetClick(statesRef.current.net, v.x - 400, v.y);
        handleTokenTreeClick(statesRef.current.token, v.x - 1200, v.y, promptTokens);
      }
    }
    transRef.current.isDragging = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { transRef.current.isDragging = false; }}
      onWheel={(e) => {
        hasInteractedRef.current = true;
        const factor = 1.05; const nextZoom = e.deltaY < 0 ? transRef.current.zoom * factor : transRef.current.zoom / factor;
        transRef.current.zoom = Math.min(2.0, Math.max(0.4, nextZoom));
      }}
      className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
      data-testid="museum-canvas"
    />
  );
};
