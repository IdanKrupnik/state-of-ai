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
}

export const MuseumCanvas: React.FC<MuseumCanvasProps> = ({ targetPanX, targetPanY, targetZoom, nnStep }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transRef = useRef({ zoom: 1.0, panX: 0, panY: 0, isDragging: false, startX: 0, startY: 0, dragDist: 0 });
  const statesRef = useRef({ tokenization: initTokenization(), net: initNeuralNet(), vector: initVectorSpace(), token: initTokenTree() });
  const hasInteractedRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => { hasInteractedRef.current = false; }, [targetPanX, targetPanY, targetZoom]);

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
      ctx.translate(canvas.width / 2 + transRef.current.panX, canvas.height / 2 + transRef.current.panY);
      ctx.scale(transRef.current.zoom, transRef.current.zoom);
      ctx.strokeStyle = 'rgba(24, 24, 27, 0.04)'; ctx.lineWidth = 1;
      const size = 40; const range = 2000;
      for (let x = -range; x <= range; x += size) {
        ctx.beginPath(); ctx.moveTo(x, -range); ctx.lineTo(x, range); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-range, x); ctx.lineTo(range, x); ctx.stroke();
      }
      ctx.font = 'bold 8px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT A // TEXT TOKENIZATION & VOCAB ID PARSING', -1320, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• Chops the prompt string into separate token boxes.', -1320, 60);
      ctx.fillText('• Click token boxes to toggle vocabulary ID mapping.', -1320, 72);
      ctx.fillText('INPUT TEXT', -1200, -8);
      ctx.fillText('VOCAB ID', -1200, 30);
      ctx.fillText('TOKEN SLICING', -1320, -50);

      ctx.font = 'bold 8px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT B // AMBIENT VECTOR SPACE EMBEDDINGS', -520, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• Floating stars represent words in coordinate space.', -520, 140);
      ctx.fillText('• Hover over word particles to view semantic lasers.', -520, 152);
      ctx.fillText('EMBEDDING VECTOR', -400, -170);
      ctx.fillText('ATTENTION WEIGHTS', -400, 160);

      ctx.font = 'bold 8px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT C // LIVING NEURAL NETWORK DYNAMICS', 280, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• Signal pulses represent activations through layer synapses.', 280, 150);
      ctx.fillText('• Click neuron nodes to manually trigger signal paths.', 280, 162);
      ctx.fillText('INPUT SYNAPSE', 220, 10);
      ctx.fillText('OUTPUT PREDICTION', 500, 10);
      ctx.fillText('SYNAPTIC WEIGHTS', 400, -90);
      ctx.fillText('ACTIVATION FUNCTION', 400, 90);

      ctx.font = 'bold 8px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT D // NEXT-TOKEN BRANCHING SELECTIONS', 1050, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace'; ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• Branches show predicted next word probability %.', 1050, 60);
      ctx.fillText('• Click options to override next word selection.', 1050, 72);
      ctx.fillText('PROMPT SO FAR', 650, -8);
      ctx.fillText('PREDICTED TOKENS', 930, 20);
      ctx.fillText('PROBABILITY TREE', 1200, -170);

      if (nnStep === 7) {
        ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -Date.now() * 0.05;
        ctx.beginPath(); ctx.moveTo(950, -10); ctx.bezierCurveTo(700, -320, -1100, -320, -1400, -10); ctx.stroke();
        ctx.setLineDash([]); ctx.fillStyle = '#2563eb';
        ctx.beginPath(); ctx.moveTo(-1400, -10); ctx.lineTo(-1394, -20); ctx.lineTo(-1390, -16); ctx.fill();
        ctx.font = 'bold 7px Geist Mono, Courier New, monospace';
        ctx.fillText('AUTOREGRESSIVE FEEDBACK LOOP: CHOSEN WORD BECOMES NEW INPUT', -220, -255);
      }

      ctx.save(); ctx.translate(-1200, 0); updateAndRenderTokenization(ctx, statesRef.current.tokenization); ctx.restore();
      ctx.save(); ctx.translate(-400, 0); updateAndRenderVectorSpace(ctx, statesRef.current.vector); ctx.restore();
      ctx.save(); ctx.translate(400, 0); updateAndRenderNeuralNet(ctx, statesRef.current.net, nnStep); ctx.restore();
      ctx.save(); ctx.translate(1200, 0); updateAndRenderTokenTree(ctx, statesRef.current.token); ctx.restore();
      
      const rect = canvas.getBoundingClientRect();
      const mouseVx = (mousePosRef.current.x - rect.left - canvas.width / 2 - transRef.current.panX) / transRef.current.zoom;
      const mouseVy = (mousePosRef.current.y - rect.top - canvas.height / 2 - transRef.current.panY) / transRef.current.zoom;
      renderTooltipsAndCheckHover(ctx, mouseVx, mouseVy);
      ctx.restore();
      animFrameId = requestAnimationFrame(render);
    };
    render();
    return () => { cancelAnimationFrame(animFrameId); window.removeEventListener('resize', resize); };
  }, [targetPanX, targetPanY, targetZoom, nnStep]);

  const getVirtualCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!; const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - canvas.width / 2 - transRef.current.panX) / transRef.current.zoom,
      y: (clientY - rect.top - canvas.height / 2 - transRef.current.panY) / transRef.current.zoom
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    transRef.current.isDragging = true; transRef.current.dragDist = 0;
    transRef.current.startX = e.clientX - transRef.current.panX; transRef.current.startY = e.clientY - transRef.current.panY;
    hasInteractedRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
    const v = getVirtualCoords(e.clientX, e.clientY);
    handleVectorSpaceHover(statesRef.current.vector, v.x + 400, v.y);
    if (!transRef.current.isDragging) return;
    const dx = e.clientX - (transRef.current.panX + transRef.current.startX);
    const dy = e.clientY - (transRef.current.panY + transRef.current.startY);
    transRef.current.dragDist += Math.hypot(dx, dy);
    transRef.current.panX = e.clientX - transRef.current.startX; transRef.current.panY = e.clientY - transRef.current.startY;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (transRef.current.isDragging && transRef.current.dragDist < 5) {
      const v = getVirtualCoords(e.clientX, e.clientY);
      if (!checkTooltipClick(v.x, v.y)) {
        handleTokenizationClick(statesRef.current.tokenization, v.x + 1200, v.y);
        handleNeuralNetClick(statesRef.current.net, v.x - 400, v.y);
        handleTokenTreeClick(statesRef.current.token, v.x - 1200, v.y);
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
