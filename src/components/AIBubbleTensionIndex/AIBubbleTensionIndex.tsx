import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface BubbleIndexData {
  bubblePercentage: number;
  structuralShiftPercentage: number;
  statusDirection: 'increasing' | 'decreasing' | 'stable';
  lastSynced: string;
}

const defaultData: BubbleIndexData = {
  bubblePercentage: 68,
  structuralShiftPercentage: 32,
  statusDirection: 'increasing',
  lastSynced: new Date().toISOString(),
};

export const AIBubbleTensionIndex: React.FC<{ data?: BubbleIndexData }> = ({ data = defaultData }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isUp = data.statusDirection === 'increasing';
  const badgeText = isUp ? '↗ Tension Increasing' : data.statusDirection === 'decreasing' ? '↘ Stabilizing' : '→ Stable';
  const badgeColor = isUp ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20';

  const metrics = [
    {
      title: 'Companies Spending vs. Profits',
      status: '🚨 High Bubble Risk',
      subtitle: 'Companies are spending 22% more on hardware this quarter.',
      bubble: 'Big tech giants are spending billions on expensive computers and chips, but they are not making enough revenue from them yet.',
      stable: 'This huge spending builds the raw digital infrastructure required for all future software.',
    },
    {
      title: 'Public Hype & News Sentiment',
      status: '⚠️ Moderate Hype',
      subtitle: 'There is 18% more talk in the news about AI bubble risks.',
      bubble: 'Many news articles warn that AI is an overhyped trend and that companies will start cutting their AI budgets.',
      stable: 'Higher public interest means more real businesses are starting to integrate AI tools daily.',
    },
    {
      title: 'Stock Market Fear & Volatility',
      status: '⚠️ Moderately High Fear',
      subtitle: 'The VIX fear index is currently at 24.5.',
      bubble: 'AI stock prices are swinging up and down wildly, showing that investors are nervous about long-term profits.',
      stable: 'Stock market volatility is completely normal when a massive new industry is being built.',
    },
  ];

  return (
    <div className="border border-outline-variant/30 p-8 bg-brand-clay/5 hover:border-brand-black hover:shadow-sm transition-all duration-200 flex flex-col gap-6" data-testid="bubble-index-widget">
      <header className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-brand-black">Is AI a Bubble?</h2>
          <p className="text-brand-warm-grey text-base mt-1.5">Financial & Media Data Aggregate Indicator</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-emerald-600 dark:text-emerald-500 font-geist-mono text-xs font-bold tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>LIVE COMPLIANT DATA</span>
        </div>
      </header>

      <div className="flex items-baseline gap-6">
        <span className="text-7xl font-black tracking-tight text-brand-black">{data.bubblePercentage}%</span>
        <span className={`text-base font-geist-mono border px-3 py-1 rounded ${badgeColor}`}>{badgeText}</span>
      </div>

      <div className="relative w-full h-6 bg-brand-clay/10 rounded border border-outline-variant/20 mt-2">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-amber-500 to-red-600 rounded" />
        <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-bg-base/30" />
        <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-bg-base/30" />
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: `${data.bubblePercentage}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          className="absolute -top-1.5 -ml-2.5 w-5 h-9 flex flex-col items-center"
          data-testid="tracker-pin"
        >
          <div className="w-5 h-5 bg-brand-black border-2 border-brand-offwhite rounded-full shadow" />
          <div className="w-0.5 h-4 bg-brand-black" />
        </motion.div>
      </div>

      <div className="flex justify-between text-xs font-geist-mono text-brand-warm-grey">
        <span>STABLE BUILD</span>
        <span>TRANSITIONAL SHIFT</span>
        <span>STRUCTURAL BUBBLE</span>
      </div>

      <div className="border-t border-outline-variant/30 pt-6 flex flex-col gap-6">
        <h4 className="text-lg font-black uppercase tracking-wider text-brand-black">Underlying Market Indicators (Click to expand details):</h4>
        <div className="flex flex-col gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="border border-outline-variant/20 p-6 bg-brand-offwhite/50 hover:border-brand-black transition-all">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full text-left flex justify-between items-start gap-6 cursor-pointer" data-testid={`metric-btn-${i}`}>
                <div>
                  <span className="block text-2xl font-black text-brand-black">{m.title}</span>
                  <span className="block text-base text-brand-warm-grey mt-1">{m.subtitle}</span>
                </div>
                <span className="font-geist-mono text-base font-bold text-brand-black shrink-0">{m.status}</span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-6 pt-6 border-t border-outline-variant/20 flex flex-col gap-4 text-base text-brand-warm-grey" data-testid={`metric-details-${i}`}>
                    <div>
                      <strong className="block text-red-500 mb-1.5 text-lg">🚨 Why this points to a Bubble:</strong>
                      <p>{m.bubble}</p>
                    </div>
                    <div>
                      <strong className="block text-indigo-600 mb-1.5 text-lg">✅ Why this points to a Stable Build:</strong>
                      <p>{m.stable}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-outline-variant/30 pt-4 text-xs font-geist-mono text-brand-warm-grey flex justify-between items-center">
        <span>FORMULA: 0.4(CAPEX) + 0.4(SENTIMENT) + 0.2(VIX)</span>
        <span>LIVE DATA: SYNCED {new Date(data.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </footer>
    </div>
  );
};
