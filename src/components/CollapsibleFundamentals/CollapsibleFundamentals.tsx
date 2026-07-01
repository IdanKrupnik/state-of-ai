import React from 'react';

export const CollapsibleFundamentals: React.FC = () => {
  return (
    <section data-testid="collapsible-fundamentals">
      <details className="group border border-outline-variant bg-brand-clay/20">
        <summary className="flex justify-between items-center p-4 cursor-pointer list-none select-none font-geist-mono text-[12px] font-bold text-brand-black">
          <span>[ ? ] NEW TO AI? CLICK TO UNWRAP</span>
          <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
        </summary>
        <div className="px-4 pb-6 text-sm text-brand-warm-grey leading-relaxed space-y-4">
          <p>Artificial Intelligence is not a monolithic entity but a convergence of probabilistic modeling and compute. This dashboard provides real-time telemetry on model weights, bias variance, and architectural shifts across the ecosystem.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-brand-offwhite border border-outline-variant">
              <span className="block font-geist-mono text-[10px] text-brand-warm-grey mb-1 uppercase">Foundation</span>
              <span className="text-sm font-semibold text-brand-black">Transformers</span>
            </div>
            <div className="p-3 bg-brand-offwhite border border-outline-variant">
              <span className="block font-geist-mono text-[10px] text-brand-warm-grey mb-1 uppercase">Methodology</span>
              <span className="text-sm font-semibold text-brand-black">Diffusion</span>
            </div>
          </div>
        </div>
      </details>
    </section>
  );
};
