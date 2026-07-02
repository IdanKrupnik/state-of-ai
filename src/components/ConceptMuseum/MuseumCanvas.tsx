import React, { useRef, useEffect } from 'react';
import { initNeuralNet, updateAndRenderNeuralNet, handleNeuralNetClick } from './renderNeuralNet';
import { initVectorSpace, updateAndRenderVectorSpace, handleVectorSpaceHover } from './renderVectorSpace';
import { initTokenTree, updateAndRenderTokenTree, handleTokenTreeClick } from './renderTokenBranching';

export interface MuseumCanvasProps {
  targetPanX: number;
  targetPanY: number;
  targetZoom: number;
  nnStep: number;
}

export const MuseumCanvas: React.FC<MuseumCanvasProps> = ({ targetPanX, targetPanY, targetZoom, nnStep }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transRef = useRef({ zoom: 1.0, panX: 0, panY: 0, isDragging: false, startX: 0, startY: 0, dragDist: 0 });
  const statesRef = useRef({ net: initNeuralNet(), vector: initVectorSpace(), token: initTokenTree() });
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    hasInteractedRef.current = false;
  }, [targetPanX, targetPanY, targetZoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext('2d')) return;
    const ctx = canvas.getContext('2d')!;
    let animFrameId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    const render = () => {
      ctx.fillStyle = '#fcfbfa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (!transRef.current.isDragging && !hasInteractedRef.current) {
        transRef.current.panX += (targetPanX - transRef.current.panX) * 0.08;
        transRef.current.panY += (targetPanY - transRef.current.panY) * 0.08;
        transRef.current.zoom += (targetZoom - transRef.current.zoom) * 0.08;
      }
      ctx.save();
      ctx.translate(canvas.width / 2 + transRef.current.panX, canvas.height / 2 + transRef.current.panY);
      ctx.scale(transRef.current.zoom, transRef.current.zoom);
      ctx.strokeStyle = 'rgba(24, 24, 27, 0.04)';
      ctx.lineWidth = 1;
      const size = 40;
      const range = 1500;
      for (let x = -range; x <= range; x += size) {
        ctx.beginPath(); ctx.moveTo(x, -range); ctx.lineTo(x, range); ctx.stroke();
      }
      for (let y = -range; y <= range; y += size) {
        ctx.beginPath(); ctx.moveTo(-range, y); ctx.lineTo(range, y); ctx.stroke();
      }
      ctx.font = 'bold 8px Geist Mono, Courier New, monospace';
      ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT A // AMBIENT VECTOR CLUSTERS', -920, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace';
      ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• Dim stars represent words floating in vector space.', -920, 160);
      ctx.fillText('• Hover over words to activate semantic associations.', -920, 172);

      ctx.font = 'bold 8px Geist Mono, Courier New, monospace';
      ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT B // LIVING NEURAL NETWORK', -120, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace';
      ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• Light pulses represent forward-propagating signals.', -120, 160);
      ctx.fillText('• Click any node to manually fire signal pulses.', -120, 172);

      ctx.font = 'bold 8px Geist Mono, Courier New, monospace';
      ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
      ctx.fillText('EXHIBIT C // NEXT-TOKEN BRANCHING', 650, -180);
      ctx.font = '7px Geist Mono, Courier New, monospace';
      ctx.fillStyle = 'rgba(24, 24, 27, 0.5)';
      ctx.fillText('• Typewriter shows real-time sequence prediction.', 650, 160);
      ctx.fillText('• Click branching options to override word choices.', 650, 172);

      ctx.save(); ctx.translate(-800, 0); updateAndRenderVectorSpace(ctx, statesRef.current.vector); ctx.restore();
      ctx.save(); ctx.translate(0, 0); updateAndRenderNeuralNet(ctx, statesRef.current.net, nnStep); ctx.restore();
      ctx.save(); ctx.translate(800, 0); updateAndRenderTokenTree(ctx, statesRef.current.token); ctx.restore();
      ctx.restore();
      animFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [targetPanX, targetPanY, targetZoom, nnStep]);

  const getVirtualCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - canvas.width / 2 - transRef.current.panX) / transRef.current.zoom,
      y: (clientY - rect.top - canvas.height / 2 - transRef.current.panY) / transRef.current.zoom
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    transRef.current.isDragging = true;
    transRef.current.dragDist = 0;
    transRef.current.startX = e.clientX - transRef.current.panX;
    transRef.current.startY = e.clientY - transRef.current.panY;
    hasInteractedRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const v = getVirtualCoords(e.clientX, e.clientY);
    handleVectorSpaceHover(statesRef.current.vector, v.x + 800, v.y);
    if (!transRef.current.isDragging) return;
    const dx = e.clientX - (transRef.current.panX + transRef.current.startX);
    const dy = e.clientY - (transRef.current.panY + transRef.current.startY);
    transRef.current.dragDist += Math.hypot(dx, dy);
    transRef.current.panX = e.clientX - transRef.current.startX;
    transRef.current.panY = e.clientY - transRef.current.startY;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (transRef.current.isDragging && transRef.current.dragDist < 5) {
      const v = getVirtualCoords(e.clientX, e.clientY);
      handleNeuralNetClick(statesRef.current.net, v.x, v.y);
      handleTokenTreeClick(statesRef.current.token, v.x - 800, v.y);
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
        const factor = 1.05;
        const nextZoom = e.deltaY < 0 ? transRef.current.zoom * factor : transRef.current.zoom / factor;
        transRef.current.zoom = Math.min(2.0, Math.max(0.4, nextZoom));
      }}
      className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
      data-testid="museum-canvas"
    />
  );
};
