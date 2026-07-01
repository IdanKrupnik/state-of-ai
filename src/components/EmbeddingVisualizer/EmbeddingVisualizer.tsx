import React from 'react';
import { motion } from 'framer-motion';

export interface EmbeddingVisualizerProps {
  prompt: string;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  category: string;
}

export const EmbeddingVisualizer: React.FC<EmbeddingVisualizerProps> = ({ prompt }) => {
  const tokens = prompt.split(/\s+/).filter(Boolean);

  const neighborhoods = [
    { name: 'Felines / Pets', x: 80, y: 80, r: 45 },
    { name: 'Furniture / Mat', x: 280, y: 150, r: 45 },
    { name: 'Transport / Aerospace', x: 180, y: 280, r: 50 },
  ];

  const presetNodes: Node[] = [
    { id: '1', label: 'dog', x: 60, y: 70, category: 'pets' },
    { id: '2', label: 'mouse', x: 110, y: 90, category: 'pets' },
    { id: '3', label: 'rug', x: 260, y: 130, category: 'furniture' },
    { id: '4', label: 'sofa', x: 310, y: 160, category: 'furniture' },
    { id: '5', label: 'airplane', x: 190, y: 260, category: 'transport' },
    { id: '6', label: 'rocket', x: 150, y: 300, category: 'transport' },
  ];

  const getDynamicNodes = (): Node[] => {
    return tokens.map((token, idx) => {
      const lower = token.toLowerCase();
      let x = 200 + (idx * 30) % 60;
      let y = 100 + (idx * 40) % 80;

      if (lower.includes('cat')) {
        x = 90;
        y = 65;
      } else if (lower.includes('mat')) {
        x = 290;
        y = 140;
      } else if (lower.includes('sat')) {
        x = 220;
        y = 120;
      }

      return {
        id: `dyn-${idx}`,
        label: token,
        x,
        y,
        category: 'dynamic',
      };
    });
  };

  const dynamicNodes = getDynamicNodes();
  const allNodes = [...presetNodes, ...dynamicNodes];

  return (
    <svg className="w-full h-full aspect-[4/3] overflow-hidden" viewBox="0 0 400 350" data-testid="embedding-visualizer">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {neighborhoods.map((n) => (
            <g key={n.name}>
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill="none"
                stroke="rgba(0,0,0,0.05)"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <text
                x={n.x}
                y={n.y - n.r - 5}
                className="font-geist-mono text-[9px] text-brand-warm-grey/60 text-middle text-center fill-current"
                textAnchor="middle"
              >
                {n.name}
              </text>
            </g>
          ))}

          {allNodes.map((node) => {
            const isDynamic = node.category === 'dynamic';
            return (
              <g key={node.id} data-testid={`node-${node.label}`}>
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  cx={node.x}
                  cy={node.y}
                  r={isDynamic ? 6 : 4}
                  className={isDynamic ? "fill-secondary stroke-brand-black stroke-1" : "fill-brand-warm-grey/40"}
                />
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={node.x}
                  y={node.y - 8}
                  className={`font-geist-mono text-[10px] text-center fill-current ${
                    isDynamic ? 'fill-brand-black font-bold' : 'fill-brand-warm-grey/60'
                  }`}
                  textAnchor="middle"
                >
                  {node.label}
                </motion.text>
              </g>
            );
          })}
        </svg>
  );
};
