import React from 'react';
import { SystemStatus } from '../ui/SystemStatus/SystemStatus';

export interface TelemetryTickerProps {
  scannedTime?: string;
  bestModel?: string;
  marketIndex?: string;
  latestBlock?: string;
  gasPrice?: string;
  sentiment?: string;
  nextCron?: string;
}

export const TelemetryTicker: React.FC<TelemetryTickerProps> = ({
  scannedTime = '4m ago',
  bestModel = 'Claude 3.5 Sonnet',
  marketIndex = '64.2%',
  latestBlock = '#A1-9982',
  gasPrice = '14 Gwei',
  sentiment = 'Bullish',
  nextCron = '12m',
}) => {
  const content = (
    <>
      <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
        <SystemStatus label="Pipeline Active" isActive={true} />
        <span className="text-[10px] text-brand-warm-grey/60">({scannedTime})</span>
      </div>
      <div className="flex gap-4 shrink-0 whitespace-nowrap">
        <span>Best Model:</span>
        <span className="text-brand-black font-semibold">{bestModel}</span>
      </div>
      <div className="flex gap-4 shrink-0 whitespace-nowrap">
        <span>Market Index:</span>
        <span className="text-brand-black font-semibold">{marketIndex}</span>
      </div>
      <div className="flex gap-4 shrink-0 whitespace-nowrap">
        <span>Latest Block:</span>
        <span className="text-brand-black font-semibold">{latestBlock}</span>
      </div>
      <div className="flex gap-4 shrink-0 whitespace-nowrap">
        <span>Gas Price:</span>
        <span className="text-brand-black font-semibold">{gasPrice}</span>
      </div>
      <div className="flex gap-4 shrink-0 whitespace-nowrap">
        <span>Sentiment:</span>
        <span className="text-brand-black font-semibold">{sentiment}</span>
      </div>
      <div className="flex gap-4 shrink-0 whitespace-nowrap">
        <span>Next Cron:</span>
        <span className="text-brand-black font-semibold">{nextCron}</span>
      </div>
    </>
  );

  return (
    <div className="mt-16 w-full bg-brand-clay/30 border-b border-outline-variant h-8 flex items-center overflow-hidden ticker-wrap">
      <div className="ticker-content inline-flex items-center gap-12 font-label-mono text-label-mono text-brand-warm-grey uppercase tracking-wider animate-ticker">
        {content}
        <div className="w-12 shrink-0" />
        {content}
      </div>
    </div>
  );
};
