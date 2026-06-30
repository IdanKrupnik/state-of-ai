import React from 'react';
import { SystemStatus } from '../ui/SystemStatus/SystemStatus';

export interface TelemetryTickerProps {
  scannedTime?: string;
  bestModel?: string;
  marketIndex?: string;
  latestBlock?: string;
}

export const TelemetryTicker: React.FC<TelemetryTickerProps> = ({
  scannedTime = '4m ago',
  bestModel = 'Claude 3.5 Sonnet',
  marketIndex = '64.2%',
  latestBlock = '#A1-9982',
}) => {
  return (
    <div className="mt-16 w-full bg-brand-clay/30 border-b border-outline-variant py-2 ticker-wrap">
      <div className="ticker-content flex items-center gap-12 font-label-mono text-label-mono text-brand-warm-grey uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <SystemStatus label="Pipeline Active" isActive={true} />
          <span className="text-[10px] text-brand-warm-grey/60">({scannedTime})</span>
        </div>
        <div className="flex gap-4">
          <span>Best Model:</span>
          <span className="text-brand-black font-semibold">{bestModel}</span>
        </div>
        <div className="flex gap-4">
          <span>Market Index:</span>
          <span className="text-brand-black font-semibold">{marketIndex}</span>
        </div>
        <div className="flex gap-4">
          <span>Latest Block:</span>
          <span className="text-brand-black font-semibold">{latestBlock}</span>
        </div>
      </div>
    </div>
  );
};
