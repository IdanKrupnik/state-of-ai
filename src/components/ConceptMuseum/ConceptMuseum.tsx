import React, { useState, useRef, useEffect } from 'react';
import { MuseumCanvas } from './MuseumCanvas';
import { LLM_STEPS } from './types';

export const ConceptMuseum: React.FC = () => {
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isIntro, setIsIntro] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [promptTokens, setPromptTokens] = useState(['The', ' cat', ' sat']);
  const [isRecycling, setIsRecycling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNextPhase = () => {
    if (activeStep === LLM_STEPS.length - 1) {
      setIsRecycling(true);
    } else setActiveStep(prev => prev + 1);
  };

  useEffect(() => {
    const handleFs = () => setIsFullScreen(!!document.fullscreenElement);
    const handleKeys = (e: KeyboardEvent) => {
      if (!isExplorerOpen || isIntro) return;
      if (e.key === 'ArrowRight') handleNextPhase();
      if (e.key === 'ArrowLeft') setActiveStep(prev => Math.max(0, prev - 1));
    };
    document.addEventListener('fullscreenchange', handleFs);
    window.addEventListener('keydown', handleKeys);
    return () => {
      document.removeEventListener('fullscreenchange', handleFs);
      window.removeEventListener('keydown', handleKeys);
    };
  }, [isExplorerOpen, isIntro, activeStep, promptTokens]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
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
          onClick={() => { setIsExplorerOpen(true); setIsIntro(true); setActiveStep(0); setPromptTokens(['The', ' cat', ' sat']); setIsRecycling(false); }}
          className="px-5 py-3 text-xs font-bold font-geist-mono uppercase tracking-wider bg-brand-black text-brand-offwhite hover:bg-brand-black/90 transition-all duration-200 rounded cursor-pointer shrink-0"
          data-testid="launch-museum-btn"
        >
          Launch AI Concept Museum
        </button>
      </div>

      {isExplorerOpen && (
        <div ref={containerRef} className="fixed inset-0 z-50 bg-[#fcfbfa] text-zinc-900 flex flex-col overflow-hidden" data-testid="museum-overlay">
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-brand-black/10 shadow-sm z-10">
            <span className="font-geist-mono text-xs text-brand-warm-grey font-bold uppercase tracking-wider">AI CONCEPT MUSEUM // ACTIVE EXHIBITS</span>
            <div className="flex items-center gap-3">
              <button onClick={toggleFullscreen} className="px-3 py-1.5 text-xs font-geist-mono border border-brand-black/15 bg-brand-clay/5 text-brand-warm-grey hover:border-brand-black hover:text-brand-black rounded cursor-pointer transition-colors" data-testid="fullscreen-toggle-btn">
                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen ⛶'}
              </button>
              <button onClick={() => setIsExplorerOpen(false)} className="px-3 py-1.5 text-xs font-geist-mono bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded cursor-pointer transition-colors" data-testid="close-museum-btn">
                Exit Museum ×
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <MuseumCanvas targetPanX={step.panX} targetPanY={step.panY} targetZoom={step.zoom} nnStep={activeStep} promptTokens={promptTokens} setPromptTokens={setPromptTokens} isRecycling={isRecycling} onLoopReset={() => { setActiveStep(0); setIsRecycling(false); }} />
            {isIntro ? (
              <div className="absolute inset-0 bg-[#fcfbfa]/60 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                <div className="bg-white border border-brand-black/10 rounded-2xl p-8 max-w-md shadow-2xl text-center flex flex-col gap-5">
                  <h3 className="text-xl font-extrabold text-brand-black">Welcome to the AI Concept Museum</h3>
                  <p className="text-xs text-brand-warm-grey leading-relaxed">
                    We will guide you step-by-step through how Large Language Models (LLMs) work in practice. Explore the interactive visual exhibits to see how mathematical vectors, neural network weights, and token probability branches generate language.
                  </p>
                  <button onClick={() => setIsIntro(false)} className="w-full py-3 text-xs font-bold font-geist-mono uppercase tracking-wider bg-brand-black text-brand-offwhite hover:bg-brand-black/90 transition-all duration-200 rounded cursor-pointer" data-testid="begin-journey-btn">
                    Begin Journey &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-xl bg-white border border-brand-black/15 rounded-2xl p-6 shadow-2xl z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-geist-mono text-[9px] uppercase tracking-wider text-brand-warm-grey">How LLMs Work // Phase {activeStep + 1} of {LLM_STEPS.length}</span>
                  <div className="flex items-center gap-1.5">
                    {LLM_STEPS.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeStep ? 'bg-primary w-3' : 'bg-brand-clay/35'}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-black">{step.title}</h4>
                  <p className="text-xs leading-relaxed text-brand-warm-grey mt-1">{step.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-brand-black/5">
                  <button onClick={() => setActiveStep(prev => Math.max(0, prev - 1))} disabled={activeStep === 0} className="px-3 py-1.5 text-[10px] font-bold font-geist-mono border border-brand-black/10 bg-brand-clay/5 text-brand-warm-grey hover:border-brand-black hover:text-brand-black disabled:opacity-30 rounded cursor-pointer transition-all duration-200" data-testid="prev-step-btn">&larr; Previous Phase</button>
                  <span className="text-[9px] font-geist-mono text-brand-warm-grey uppercase tracking-wider hidden sm:inline">Use Arrow Keys • Drag to pan</span>
                  <button onClick={handleNextPhase} className="px-3 py-1.5 text-[10px] font-bold font-geist-mono border border-brand-black/10 bg-brand-black text-brand-offwhite hover:bg-brand-black/90 disabled:opacity-30 rounded cursor-pointer transition-all duration-200" data-testid="next-step-btn">
                    {activeStep === LLM_STEPS.length - 1 ? 'Recycle & Loop ↺' : 'Next Phase \u2192'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
