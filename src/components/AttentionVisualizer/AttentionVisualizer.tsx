import React from 'react';
import { motion } from 'framer-motion';

export interface AttentionVisualizerProps {
  prompt: string;
}

interface Synapse {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  weight: number;
}

export const AttentionVisualizer: React.FC<AttentionVisualizerProps> = ({ prompt }) => {
  const tokens = prompt.split(/\s+/).filter(Boolean).slice(0, 3);
  if (tokens.length === 0) tokens.push('Prompt');

  const layer1Y = tokens.map((_, i) => 80 + i * 80);
  const layer2Y = [60, 120, 180, 240];
  const layer3Y = [100, 200];

  const synapses: Synapse[] = [];

  layer1Y.forEach((y1) => {
    layer2Y.forEach((y2) => {
      synapses.push({
        fromX: 60,
        fromY: y1,
        toX: 200,
        toY: y2,
        weight: 0.1 + Math.random() * 0.8,
      });
    });
  });

  layer2Y.forEach((y2) => {
    layer3Y.forEach((y3) => {
      synapses.push({
        fromX: 200,
        fromY: y2,
        toX: 340,
        toY: y3,
        weight: 0.2 + Math.random() * 0.7,
      });
    });
  });

  return (
    <svg className="w-full h-full aspect-[4/3] overflow-hidden" viewBox="0 0 400 320" data-testid="attention-visualizer">
          <g className="font-geist-mono text-[9px] fill-brand-warm-grey uppercase tracking-wider font-bold">
            <text x={60} y={35} textAnchor="middle">Input Words</text>
            <text x={200} y={35} textAnchor="middle">Hidden Neurons</text>
            <text x={340} y={35} textAnchor="middle">Output layer</text>
          </g>
          <g>
            {synapses.map((syn, idx) => (
              <g key={`syn-${idx}`}>
                <line
                  x1={syn.fromX}
                  y1={syn.fromY}
                  x2={syn.toX}
                  y2={syn.toY}
                  stroke="rgba(0,0,0,0.12)"
                  strokeWidth={syn.weight * 3}
                />
                <motion.line
                  x1={syn.fromX}
                  y1={syn.fromY}
                  x2={syn.toX}
                  y2={syn.toY}
                  stroke="var(--color-secondary, #22c55e)"
                  strokeWidth={syn.weight * 2.5}
                  strokeDasharray="6, 12"
                  animate={{ strokeDashoffset: [-50, 0] }}
                  transition={{ ease: 'linear', duration: 3, repeat: Infinity }}
                  data-testid="laser-line"
                />
              </g>
            ))}
          </g>

          <g>
            {tokens.map((token, idx) => (
              <g key={`l1-${idx}`} data-testid={`l1-node-${idx}`}>
                <circle cx={60} cy={layer1Y[idx]} r={20} fill="#fff" stroke="#000" strokeWidth="1.5" />
                <text x={60} y={layer1Y[idx] + 4} className="font-geist-mono text-[9px] font-bold" textAnchor="middle">
                  {token.substring(0, 5)}
                </text>
              </g>
            ))}
          </g>

          <g>
            {layer2Y.map((y, idx) => (
              <g key={`l2-${idx}`} data-testid={`l2-node-${idx}`}>
                <circle cx={200} cy={y} r={16} fill="#fff" stroke="#666" strokeWidth="1.5" />
                <text x={200} y={y + 3} className="font-geist-mono text-[8px] fill-brand-warm-grey" textAnchor="middle">
                  {`H${idx + 1}`}
                </text>
              </g>
            ))}
          </g>

          <g>
            {layer3Y.map((y, idx) => (
              <g key={`l3-${idx}`} data-testid={`l3-node-${idx}`}>
                <circle cx={340} cy={y} r={18} fill="#fff" stroke="#000" strokeWidth="1.5" />
                <text x={340} y={y + 3} className="font-geist-mono text-[8px] font-bold" textAnchor="middle">
                  {`OUT${idx + 1}`}
                </text>
              </g>
            ))}
          </g>
        </svg>
  );
};
