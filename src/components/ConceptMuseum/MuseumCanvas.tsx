import React, { useRef, useEffect } from 'react';
import { initNeuralNet, updateAndRenderNeuralNet } from './renderNeuralNet';
import { initVectorSpace, updateAndRenderVectorSpace } from './renderVectorSpace';
import { initTokenTree, updateAndRenderTokenTree } from './renderTokenBranching';

export interface MuseumCanvasProps {
  nnStep: number;
}

export const MuseumCanvas: React.FC<MuseumCanvasProps> = ({ nnStep }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef({ zoom: 1.0, panX: 0, panY: 0, isDragging: false, startX: 0, startY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animFrameId: number;
    const netState = initNeuralNet();
    const vectorState = initVectorSpace();
    const tokenState = initTokenTree();
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    const render = () => {
      ctx.fillStyle = '#fcfbfa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2 + transformRef.current.panX, canvas.height / 2 + transformRef.current.panY);
      ctx.scale(transformRef.current.zoom, transformRef.current.zoom);
      ctx.strokeStyle = 'rgba(24, 24, 27, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      const range = 1500;
      for (let x = -range; x <= range; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -range);
        ctx.lineTo(x, range);
        ctx.stroke();
      }
      for (let y = -range; y <= range; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-range, y);
        ctx.lineTo(range, y);
        ctx.stroke();
      }
      ctx.font = 'bold 8px Geist Mono, Courier New, monospace';
      ctx.fillStyle = 'rgba(24, 24, 27, 0.4)';
      ctx.fillText('EXHIBIT A // LIVING NEURAL NETWORK', -1000, -180);
      ctx.fillText('EXHIBIT B // AMBIENT VECTOR CLUSTERS', -120, -180);
      ctx.fillText('EXHIBIT C // NEXT-TOKEN BRANCHING', 650, -180);
      updateAndRenderNeuralNet(ctx, netState, nnStep);
      updateAndRenderVectorSpace(ctx, vectorState);
      updateAndRenderTokenTree(ctx, tokenState);
      ctx.restore();
      animFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [nnStep]);

  const handleMouseDown = (e: React.MouseEvent) => {
    transformRef.current.isDragging = true;
    transformRef.current.startX = e.clientX - transformRef.current.panX;
    transformRef.current.startY = e.clientY - transformRef.current.panY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!transformRef.current.isDragging) return;
    transformRef.current.panX = e.clientX - transformRef.current.startX;
    transformRef.current.panY = e.clientY - transformRef.current.startY;
  };

  const handleMouseUp = () => {
    transformRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const scaleFactor = 1.05;
    const nextZoom = e.deltaY < 0 ? transformRef.current.zoom * scaleFactor : transformRef.current.zoom / scaleFactor;
    transformRef.current.zoom = Math.min(2.0, Math.max(0.4, nextZoom));
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
      data-testid="museum-canvas"
    />
  );
};
