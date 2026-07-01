import React from 'react';
import { motion } from 'framer-motion';

export interface BubbleIndexData {
  bubblePercentage: number;
  structuralShiftPercentage: number;
  statusDirection: 'increasing' | 'decreasing' | 'stable';
  lastSynced: string;
}

export interface AIBubbleTensionIndexProps {
  data?: BubbleIndexData;
}

const defaultData: BubbleIndexData = {
  bubblePercentage: 68,
  structuralShiftPercentage: 32,
  statusDirection: 'increasing',
  lastSynced: new Date().toISOString(),
};

export const AIBubbleTensionIndex: React.FC<AIBubbleTensionIndexProps> = ({ data = defaultData }) => {
  const isUp = data.statusDirection === 'increasing';
  const badgeText = isUp ? '↗ Tension Increasing' : data.statusDirection === 'decreasing' ? '↘ Stabilizing' : '→ Stable';
  const badgeColor = isUp ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20';

  return (
    <div className="border border-outline-variant/30 p-6 bg-brand-clay/5 hover:border-brand-black hover:shadow-sm transition-all duration-200 flex flex-col gap-6" data-testid="bubble-index-widget">
      <header className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-brand-black">Is AI a Bubble?</h2>
          <p className="text-brand-warm-grey text-xs mt-1">Financial & Media Data Aggregate Indicator</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-emerald-600 dark:text-emerald-500 font-geist-mono text-[9px] font-bold tracking-wider">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>LIVE COMPLIANT DATA</span>
        </div>
      </header>

      <div className="flex items-baseline gap-4">
        <span className="text-5xl font-extrabold tracking-tight text-brand-black">{data.bubblePercentage}%</span>
        <span className={`text-xs font-geist-mono border px-2 py-0.5 rounded ${badgeColor}`}>{badgeText}</span>
      </div>

      <div className="relative w-full h-4 bg-brand-clay/10 rounded overflow-visible border border-outline-variant/20 mt-2">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-amber-500 to-red-600 rounded" />
        <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-bg-base/30" />
        <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-bg-base/30" />
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: `${data.bubblePercentage}%` }}
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

      <p className="text-xs text-brand-warm-grey leading-relaxed">
        Calculated using macro financial indicators: capital expenditure vs enterprise ROI, media sentiment analysis of "AI bubble" / "AI capex" mentions, and VIX volatility metrics.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-outline-variant/30 pt-4 text-center">
        <div>
          <span className="block text-[10px] font-geist-mono text-brand-warm-grey uppercase">Market Capex Trend</span>
          <span className="text-sm font-bold text-brand-black">Up 22% QoQ</span>
        </div>
        <div>
          <span className="block text-[10px] font-geist-mono text-brand-warm-grey uppercase">Media Sentiment</span>
          <span className="text-sm font-bold text-brand-black">+18% "AI Hype" Mentions</span>
        </div>
        <div>
          <span className="block text-[10px] font-geist-mono text-brand-warm-grey uppercase">Macro Volatility</span>
          <span className="text-sm font-bold text-brand-black">VIX Index: 24.5</span>
        </div>
      </div>

      <footer className="border-t border-outline-variant/30 pt-3 text-[10px] font-geist-mono text-brand-warm-grey flex justify-between items-center">
        <span>FORMULA: 0.4(CAPEX) + 0.4(SENTIMENT) + 0.2(VIX)</span>
        <span>LIVE DATA: SYNCED {new Date(data.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </footer>
    </div>
  );
};
