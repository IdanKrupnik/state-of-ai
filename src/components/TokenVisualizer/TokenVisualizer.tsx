import React from 'react';
import { motion } from 'framer-motion';

export interface TokenVisualizerProps {
  prompt: string;
}

export const TokenVisualizer: React.FC<TokenVisualizerProps> = ({ prompt }) => {
  const tokens = prompt.split(/\s+/).filter(Boolean);

  const getTokenId = (token: string, idx: number) => {
    const sum = token.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (sum * 13 + idx * 7) % 10000;
  };

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center" data-testid="token-visualizer">
      {tokens.map((token, idx) => {
        const id = getTokenId(token, idx);
        return (
          <motion.div
            key={`${token}-${idx}`}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="flex flex-col items-center gap-1.5 p-3 bg-brand-offwhite border border-outline-variant shadow-sm hover:border-brand-black transition-colors"
            data-testid={`token-box-${idx}`}
          >
            <span className="font-semibold text-brand-black text-sm">{token}</span>
            <span className="font-geist-mono text-[10px] text-brand-warm-grey bg-brand-clay/20 px-1.5 py-0.5">
              ID: {id}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
