import React, { useState, useRef, useEffect } from 'react';
import { MuseumCanvas } from './MuseumCanvas';

const LLM_STEPS = [
  {
    title: 'Phase 1: Input & Embedding Space',
    description: 'Your prompt is broken into tokens and converted into coordinate vectors in a high-dimensional space, grouping words with similar semantic meanings together.',
    panX: 120, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 2: Neural Net Processing',
    description: 'These word vectors travel through layers of interconnected neurons, calculating context and weights to understand the sentence structure.',
    panX: 1050, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 3: Next-Token Selection',
    description: 'The model computes branching probability options for the next word in the sequence. It commits the highest percentage word, then repeats the loop.',
    panX: -800, panY: 0, zoom: 1.3
  }
];

export const ConceptMuseum: React.FC = () => {
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
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

  const step = LLM_STEPS[activeStep];

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
          onClick={() => { setIsExplorerOpen(true); setActiveStep(0); }}
          className="px-5 py-3 text-xs font-bold font-geist-mono uppercase tracking-wider bg-brand-black text-brand-offwhite hover:bg-brand-black/90 transition-all duration-200 rounded cursor-pointer shrink-0"
          data-testid="launch-museum-btn"
        >
          Launch AI Concept Museum
        </button>
      </div>

      {isExplorerOpen && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-50 bg-[#fcfbfa] text-zinc-900 flex flex-col overflow-hidden"
          data-testid="museum-overlay"
        >
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-brand-black/10 shadow-sm z-10">
            <span className="font-geist-mono text-xs text-brand-warm-grey font-bold uppercase tracking-wider">
              AI CONCEPT MUSEUM // ACTIVE EXHIBITS
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 text-xs font-geist-mono uppercase tracking-wider border border-brand-black/15 bg-brand-clay/5 text-brand-warm-grey hover:border-brand-black hover:text-brand-black rounded cursor-pointer transition-colors"
                data-testid="fullscreen-toggle-btn"
              >
                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen ⛶'}
              </button>
              <button
                onClick={() => setIsExplorerOpen(false)}
                className="px-3 py-1.5 text-xs font-geist-mono uppercase tracking-wider bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded cursor-pointer transition-colors"
                data-testid="close-museum-btn"
              >
                Exit Museum ×
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <MuseumCanvas targetPanX={step.panX} targetPanY={step.panY} targetZoom={step.zoom} nnStep={activeStep === 1 ? 1 : 0} />
            <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-white border border-brand-black/10 text-[10px] font-geist-mono uppercase tracking-wider text-brand-warm-grey shadow-md pointer-events-none">
              Drag to pan, scroll to zoom.
            </div>
            <div className="absolute bottom-6 right-6 w-80 bg-white border border-brand-black/10 rounded-xl p-4 shadow-lg z-10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-geist-mono text-[9px] uppercase tracking-wider text-brand-warm-grey">
                  LLM Stepper // Phase {activeStep + 1} of 3
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                    disabled={activeStep === 0}
                    className="w-5 h-5 flex items-center justify-center rounded border border-brand-black/10 hover:border-brand-black text-[10px] disabled:opacity-30 cursor-pointer"
                    data-testid="prev-step-btn"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => setActiveStep(prev => Math.min(2, prev + 1))}
                    disabled={activeStep === 2}
                    className="w-5 h-5 flex items-center justify-center rounded border border-brand-black/10 hover:border-brand-black text-[10px] disabled:opacity-30 cursor-pointer"
                    data-testid="next-step-btn"
                  >
                    &gt;
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-xs text-brand-black">{step.title}</h4>
                <p className="text-[10px] leading-normal text-brand-warm-grey mt-1">{step.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
