import React from 'react';
import { motion } from 'framer-motion';

export interface BubbleIndexData {
  bubble_percentage: number;
  status_direction: 'increasing' | 'stable' | 'decreasing';
  short_explanation: string;
  financial_highlights: { label: string; simple_text: string }[];
  updated_at?: string;
}

const defaultData: BubbleIndexData = {
  bubble_percentage: 68,
  status_direction: 'increasing',
  short_explanation: 'AI spending is very high but short-term returns are not yet clear.',
  financial_highlights: [
    { label: 'Hardware Sales', simple_text: 'Sales of advanced computer chips are growing rapidly but software sales are slower.' },
    { label: 'Corporate Spending', simple_text: 'Companies are spending billions on new data centers without immediate revenue.' },
    { label: 'Stock Volatility', simple_text: 'AI startup valuations are shifting up and down as investors evaluate long-term value.' }
  ]
};

export const AIBubbleTensionIndex: React.FC<{ data?: BubbleIndexData }> = ({ data = defaultData }) => {
  const isUp = data.status_direction === 'increasing';
  const badgeText = isUp ? '↗ Tension Increasing' : data.status_direction === 'decreasing' ? '↘ Stabilizing' : '→ Stable';
  const badgeColor = isUp ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20';

  return (
    <div className="border border-outline-variant/30 p-6 bg-brand-clay/5 hover:border-brand-black hover:shadow-sm transition-all duration-200 flex flex-col gap-6" data-testid="bubble-index-widget">
      <header className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-black">Is AI a Bubble?</h2>
          <p className="text-brand-warm-grey text-sm mt-1">Financial & Media Data Aggregate Indicator</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-emerald-600 dark:text-emerald-500 font-geist-mono text-[9px] font-bold tracking-wider">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span>LIVE COMPLIANT DATA</span>
        </div>
      </header>

      <div className="flex items-baseline gap-4">
        <span className="text-5xl font-extrabold tracking-tight text-brand-black">{data.bubble_percentage}%</span>
        <span className={`text-xs font-geist-mono border px-2 py-0.5 rounded ${badgeColor}`}>{badgeText}</span>
      </div>

      <div className="relative w-full h-4 bg-brand-clay/10 rounded border border-outline-variant/20 mt-2">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-amber-500 to-red-600 rounded" />
        <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-bg-base/30" />
        <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-bg-base/30" />
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: `${data.bubble_percentage}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          className="absolute -top-1.5 -ml-2 w-4 h-7 flex flex-col items-center"
          data-testid="tracker-pin"
        >
          <div className="w-4 h-4 bg-brand-black border-2 border-brand-offwhite rounded-full shadow" />
          <div className="w-0.5 h-3 bg-brand-black" />
        </motion.div>
      </div>

      <div className="flex justify-between text-[10px] font-geist-mono text-brand-warm-grey">
        <span>STABLE BUILD</span>
        <span>TRANSITIONAL SHIFT</span>
        <span>STRUCTURAL BUBBLE</span>
      </div>

      <div className="text-sm text-brand-black leading-relaxed font-medium bg-brand-clay/10 p-4 border-l-2 border-brand-black" data-testid="explanation-text">
        {data.short_explanation}
      </div>

      <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-black">Underlying Market Indicators:</h4>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="highlights-grid">
          {data.financial_highlights.map((highlight, idx) => (
            <li key={idx} className="border border-outline-variant/20 p-4 bg-brand-offwhite/50 hover:border-brand-black transition-all flex flex-col gap-1.5" data-testid={`highlight-item-${idx}`}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-black rounded-full" />
                <span className="font-geist-mono text-xs uppercase tracking-wider font-bold text-brand-black">{highlight.label}</span>
              </div>
              <p className="text-brand-warm-grey text-xs leading-relaxed">{highlight.simple_text}</p>
            </li>
          ))}
        </ul>
      </div>

      <footer className="border-t border-outline-variant/30 pt-3 text-[10px] font-geist-mono text-brand-warm-grey flex justify-between items-center">
        <span>STATEFUL ANALYSIS ITERATION</span>
        {data.updated_at && (
          <span>UPDATED: {new Date(data.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        )}
      </footer>
    </div>
  );
};
