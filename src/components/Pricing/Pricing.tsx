import React from 'react';

export const Pricing: React.FC = () => {
  const freeFeatures = [
    'View latest AI articles in real-time',
    'Access AI basics and learning guides'
  ];

  const proFeatures = [
    'Filter news by specific company',
    'Get notified about new events',
    'Read quick summaries of all events',
    'Get alerts when new models are released',
    'Browse full models directory with cost details'
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="border-t border-brand-black/15 pt-8 flex flex-col gap-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-brand-black uppercase font-geist-mono">
          Membership Plans
        </h2>
        <p className="text-brand-warm-grey text-sm max-w-xl">
          Choose a plan that fits your needs and help support our project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full mx-auto" data-testid="pricing-container">
        
        {/* Free Plan Card */}
        <div className="border border-brand-black/10 bg-brand-offwhite/40 rounded-lg p-8 hover:border-brand-black/25 transition-all flex flex-col justify-between gap-6 min-h-[400px]">
          <div className="flex flex-col gap-1.5">
            <span className="font-geist-mono text-xs uppercase tracking-wider font-semibold text-brand-black">
              Free Access
            </span>
            <div className="flex items-baseline gap-1 text-brand-black">
              <span className="text-4xl font-extrabold tracking-tight">$0</span>
              <span className="text-xs font-medium text-brand-warm-grey">/ month</span>
            </div>
            <p className="text-brand-warm-grey text-xs mt-2 leading-relaxed">
              Standard access to our simplified AI news streams and basic learning material.
            </p>
          </div>

          <div className="border-t border-brand-black/5 my-1" />

          <ul className="flex flex-col gap-3">
            {freeFeatures.map((feature, i) => (
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
            className="w-full py-3 bg-brand-black/5 border border-brand-black/10 text-brand-black text-xs font-semibold uppercase tracking-wider rounded transition-colors focus:outline-none cursor-default font-geist-mono mt-auto"
            data-testid="free-button"
          >
            Active Plan
          </button>
        </div>

        {/* Pro Plan Card */}
        <div className="border border-brand-black bg-brand-offwhite rounded-lg p-8 shadow-md flex flex-col justify-between gap-6 relative overflow-hidden min-h-[400px]">
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
              Complete access to event insights, model directories, and real-time release notifications.
            </p>
          </div>

          <div className="border-t border-brand-black/10 my-1" />

          <ul className="flex flex-col gap-3">
            {proFeatures.map((feature, i) => (
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
            className="w-full py-3 bg-brand-black text-brand-offwhite text-xs font-semibold uppercase tracking-wider rounded hover:bg-brand-black/90 transition-colors focus:outline-none cursor-not-allowed opacity-90 font-geist-mono mt-auto"
            data-testid="subscribe-button"
          >
            Coming Soon
          </button>
        </div>

      </div>
    </div>
  );
};
