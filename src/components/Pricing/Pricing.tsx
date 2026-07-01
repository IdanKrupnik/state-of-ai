import React from 'react';

export const Pricing: React.FC = () => {
  const features = [
    'Real-time AI research and policy aggregation',
    'Cron-fetched news from major industry sources',
    'Gemini-powered summaries and simplified titles',
    'Live models catalog with pricing per 1M tokens',
    'Unlimited custom telemetry feed pagination'
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="border-t border-brand-black/15 pt-8 flex flex-col gap-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-brand-black uppercase font-geist-mono">
          Membership Plans
        </h2>
        <p className="text-brand-warm-grey text-sm max-w-xl">
          Support our mission to explain complex technology breakthroughs simply.
        </p>
      </div>

      <div className="max-w-md w-full mx-auto" data-testid="pricing-container">
        <div className="border border-brand-black bg-brand-offwhite rounded-lg p-8 shadow-md flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-brand-black text-brand-offwhite text-[9px] font-geist-mono uppercase tracking-widest font-extrabold px-3 py-1 rounded-bl-sm">
            Popular
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-geist-mono text-xs uppercase tracking-wider font-semibold text-brand-black">
              Pro Access
            </span>
            <div className="flex items-baseline gap-1 text-brand-black">
              <span className="text-4xl font-extrabold tracking-tight">$3.99</span>
              <span className="text-xs font-medium text-brand-warm-grey">/ month</span>
            </div>
            <p className="text-brand-warm-grey text-xs mt-2 leading-relaxed">
              Complete access to our live intelligence feed, curated developer newsletters, and LLM telemetry catalog.
            </p>
          </div>

          <div className="border-t border-brand-black/10 my-1" />

          <ul className="flex flex-col gap-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-brand-black">
                <svg
                  className="w-4 h-4 text-brand-black shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            disabled
            className="w-full py-3 bg-brand-black text-brand-offwhite text-xs font-semibold uppercase tracking-wider rounded hover:bg-brand-black/90 transition-colors focus:outline-none cursor-not-allowed opacity-90 mt-4 font-geist-mono"
            data-testid="subscribe-button"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};
