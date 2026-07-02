import React, { useState, useRef, useEffect } from 'react';
import { MuseumCanvas } from './MuseumCanvas';

export const ConceptMuseum: React.FC = () => {
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-4" data-testid="concept-museum-container">
      <div className="w-full max-w-2xl bg-brand-clay/5 border border-outline-variant/30 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-black transition-colors duration-300">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-brand-warm-grey">
            <span className="material-symbols-outlined text-sm animate-pulse">auto_awesome</span>
            <span className="font-geist-mono text-xs uppercase tracking-wider">Interactive Living Exhibit</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-brand-black">AI Concept Museum</h3>
          <p className="text-sm text-brand-warm-grey max-w-md">
            Step into an automated, living visual exhibit. Watch deep learning mechanics, vector semantic spaces, and next-token branches execute in real-time.
          </p>
        </div>
        <button
          onClick={() => setIsExplorerOpen(true)}
          className="px-5 py-3 text-xs font-bold font-geist-mono uppercase tracking-wider bg-brand-black text-brand-offwhite hover:bg-brand-black/90 transition-all duration-200 rounded cursor-pointer shrink-0"
          data-testid="launch-museum-btn"
        >
          Launch AI Concept Museum
        </button>
      </div>

      {isExplorerOpen && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-50 bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden"
          data-testid="museum-overlay"
        >
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/50 border-b border-zinc-800/40 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <span className="font-geist-mono text-xs text-zinc-400 font-bold uppercase tracking-wider">
                AI CONCEPT MUSEUM // ACTIVE EXHIBITS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 text-xs font-geist-mono uppercase tracking-wider border border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 rounded cursor-pointer transition-colors"
                data-testid="fullscreen-toggle-btn"
              >
                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen ⛶'}
              </button>
              <button
                onClick={() => setIsExplorerOpen(false)}
                className="px-3 py-1.5 text-xs font-geist-mono uppercase tracking-wider bg-red-950/30 border border-red-900/55 text-red-400 hover:bg-red-900/40 hover:text-red-300 rounded cursor-pointer transition-colors"
                data-testid="close-museum-btn"
              >
                Exit Museum ×
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <MuseumCanvas />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800/40 text-[10px] font-geist-mono uppercase tracking-wider text-zinc-400 backdrop-blur-md shadow-2xl pointer-events-none text-center">
              Drag to pan the map, scroll to zoom between exhibits.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
