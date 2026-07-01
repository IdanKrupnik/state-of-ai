import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface GenerationVisualizerProps {
  prompt: string;
}

interface Candidate {
  token: string;
  probability: number;
}

export const GenerationVisualizer: React.FC<GenerationVisualizerProps> = ({ prompt }) => {
  const candidates: Candidate[] = [
    { token: 'on', probability: 82 },
    { token: 'near', probability: 11 },
    { token: 'beside', probability: 5 },
    { token: 'under', probability: 2 },
  ];

  const [typedOutput, setTypedOutput] = useState('');

  useEffect(() => {
    const winner = candidates[0].token;
    const timeout = setTimeout(() => {
      setTypedOutput(` ${winner}`);
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full" data-testid="generation-visualizer">
      <div className="flex flex-col gap-3 p-4 bg-brand-offwhite border border-outline-variant">
        <span className="font-geist-mono text-[10px] text-brand-warm-grey uppercase">Running Output Prediction</span>
        <div className="p-3 bg-brand-clay/5 border border-outline-variant/40 min-h-[50px] font-medium text-brand-black text-sm">
          <span>{prompt}</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="text-secondary font-bold"
            data-testid="predicted-token"
          >
            {typedOutput || '_'}
          </motion.span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="font-geist-mono text-[10px] text-brand-warm-grey uppercase">Next-Token Candidate Probabilities</span>
        {candidates.map((cand, idx) => {
          const isWinner = idx === 0;
          return (
            <div
              key={cand.token}
              className={`flex items-center gap-4 p-2 border ${
                isWinner ? 'border-secondary/45 bg-secondary/5' : 'border-outline-variant bg-brand-offwhite'
              } rounded`}
              data-testid={`candidate-row-${idx}`}
            >
              <span className={`w-14 text-sm font-geist-mono ${isWinner ? 'text-brand-black font-bold' : 'text-brand-warm-grey'}`}>
                {cand.token}
              </span>
              <div className="flex-1 h-2 bg-brand-clay/20 rounded overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${cand.probability}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`h-full ${isWinner ? 'bg-secondary' : 'bg-brand-warm-grey/40'}`}
                />
              </div>
              <span className="w-10 text-right text-xs font-geist-mono text-brand-black">
                {cand.probability}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
