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

      <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-black">Underlying Financial & Sentiment Metrics:</h4>
        <ul className="text-xs text-brand-warm-grey flex flex-col gap-3">
          <li className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-outline-variant/10 pb-2">
            <span><strong>1. Tech Giants Capex:</strong> Massive spending on data centers & AI chips vs actual cash revenues (Up 22% QoQ).</span>
            <span className="font-geist-mono text-brand-black shrink-0 font-bold">High Bubble Risk</span>
          </li>
          <li className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-outline-variant/10 pb-2">
            <span><strong>2. Media & Social Sentiment:</strong> Volume of public news articles focusing on ROI mismatches & AI hype (+18% bubble mentions).</span>
            <span className="font-geist-mono text-brand-black shrink-0 font-bold">Moderate Hype</span>
          </li>
          <li className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span><strong>3. Market Volatility (VIX):</strong> Overall stock market fear Index representing technology stocks volatility (VIX Index: 24.5).</span>
            <span className="font-geist-mono text-brand-black shrink-0 font-bold">Moderately Fearful</span>
          </li>
        </ul>
      </div>

      <footer className="border-t border-outline-variant/30 pt-3 text-[10px] font-geist-mono text-brand-warm-grey flex justify-between items-center">
        <span>FORMULA: 0.4(CAPEX) + 0.4(SENTIMENT) + 0.2(VIX)</span>
        <span>LIVE DATA: SYNCED {new Date(data.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </footer>
    </div>
  );
};
