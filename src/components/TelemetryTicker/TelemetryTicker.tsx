import React from 'react';
import { SystemStatus } from '../ui/SystemStatus/SystemStatus';

export interface TelemetryTickerProps {
  articles?: { id: string; simplified_title: string }[];
  scannedTime?: string;
  bestModel?: string;
  marketIndex?: string;
  latestBlock?: string;
  apiLatency?: string;
}

export const TelemetryTicker: React.FC<TelemetryTickerProps> = ({
  articles = [],
  scannedTime = '4m ago',
  bestModel = 'Claude 3.5 Sonnet',
  marketIndex = '64.2%',
  latestBlock = '#A1-9982',
  apiLatency = '42ms',
}) => {
  const fallbackNews = [
    'Indian Tycoon Funds AI Office to Rival Microsoft',
    'OpenAI Announces Next-Gen Frontier GPT-5 Architecture',
    'Google Integrates Gemini Directly Into Android Core',
    'Anthropic Launches Claude 3.5 Opus with Expanded Context'
  ];

  const newsList = articles && articles.length > 0
    ? articles.map(a => a.simplified_title)
    : fallbackNews;

  const renderNewsSpans = () => (
    newsList.map((headline, index) => (
      <span key={`news-${index}`} className="inline-flex items-center gap-1.5 shrink-0 flex-nowrap">
        <span className="px-1.5 py-0.5 text-[8px] bg-brand-neon-green/10 text-brand-neon-green border border-brand-neon-green/20 rounded font-semibold tracking-wider">NEWS</span>
        <span className="text-brand-black font-semibold">"{headline}"</span>
      </span>
    ))
  );

  const renderStatsSpans = () => (
    <>
      <span className="inline-flex items-center gap-1.5 shrink-0 flex-nowrap">
        <SystemStatus label="Pipeline Active" isActive={true} className="text-[10px] leading-none text-brand-black/70" />
        <span className="text-[9px] text-brand-warm-grey/60">({scannedTime})</span>
      </span>
      <span className="inline-flex items-center gap-1.5 shrink-0 flex-nowrap">
        <span>Best Model:</span>
        <span className="text-brand-black font-semibold">{bestModel}</span>
      </span>
      <span className="inline-flex items-center gap-1.5 shrink-0 flex-nowrap">
        <span>Market Index:</span>
        <span className="text-brand-black font-semibold">{marketIndex}</span>
      </span>
      <span className="inline-flex items-center gap-1.5 shrink-0 flex-nowrap">
        <span>Latest Block:</span>
        <span className="text-brand-black font-semibold">{latestBlock}</span>
      </span>
      <span className="inline-flex items-center gap-1.5 shrink-0 flex-nowrap">
        <span>API Latency:</span>
        <span className="text-brand-black font-semibold">{apiLatency}</span>
      </span>
      <span className="inline-flex items-center gap-1.5 shrink-0 flex-nowrap">
        <span>GPU LOAD:</span>
        <span className="text-brand-black font-semibold">87.4%</span>
      </span>
      <span className="inline-flex items-center gap-1.5 shrink-0 flex-nowrap">
        <span>ACTIVE AGENTS:</span>
        <span className="text-brand-black font-semibold">14,842</span>
      </span>
      <span className="inline-flex items-center gap-1.5 shrink-0 flex-nowrap">
        <span>TOKEN VELOCITY:</span>
        <span className="text-brand-black font-semibold">1,280/S</span>
      </span>
      <span className="inline-flex items-center gap-1.5 shrink-0 flex-nowrap">
        <span>COST/M:</span>
        <span className="text-brand-black font-semibold">$0.15</span>
      </span>
    </>
  );

  return (
    <div className="mt-16 w-full bg-brand-clay/30 border-b border-outline-variant h-8 flex items-center overflow-hidden ticker-wrap">
      <div className="ticker-content inline-flex flex-row flex-nowrap items-center gap-24 font-label-mono text-[10px] leading-none text-brand-warm-grey uppercase tracking-wider animate-ticker">
        {renderStatsSpans()}
        {renderNewsSpans()}
        {renderStatsSpans()}
        {renderNewsSpans()}
      </div>
    </div>
  );
};
