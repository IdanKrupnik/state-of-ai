import React from 'react';

export const LatencyMap: React.FC = () => {
  return (
    <section>
      <div className="aspect-[21/9] bg-brand-clay/20 border border-outline-variant overflow-hidden relative flex items-center justify-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute bottom-4 left-4 z-10">
          <span className="bg-brand-black text-brand-offwhite font-geist-mono text-[10px] px-2 py-1 uppercase tracking-wider">REAL-TIME LATENCY MAPPING</span>
        </div>
        <div className="flex items-center gap-8 font-geist-mono text-xs text-brand-warm-grey">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-neon-green"></span>US-EAST: 12ms</div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-neon-green"></span>EU-WEST: 45ms</div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-warm-grey animate-pulse"></span>AP-SOUTH: 180ms</div>
        </div>
      </div>
    </section>
  );
};
