export interface NeuralNode {
  x: number;
  y: number;
  flare: number;
}

export interface LightPulse {
  fromLayer: number;
  fromIndex: number;
  toLayer: number;
  toIndex: number;
  progress: number;
  speed: number;
}

export interface NeuralNetState {
  nodes: NeuralNode[][];
  pulses: LightPulse[];
}

export interface StarNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
}

export interface VectorWord {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isHub: boolean;
  clusterId: number;
}

export interface VectorSpaceState {
  stars: StarNode[];
  words: VectorWord[];
  activeIndex: number;
  timer: number;
}

export interface BranchOption {
  word: string;
  prob: number;
}

export interface TreeStep {
  text: string;
  branches: BranchOption[];
}

export interface TokenTreeState {
  stepIndex: number;
  typedText: string;
  targetText: string;
  state: 'typing' | 'branching' | 'committing' | 'finished';
  timer: number;
  cursorBlink: boolean;
}

export interface TokenBox {
  text: string;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isFlipped: boolean;
}

export interface TokenizationState {
  sentence: string;
  tokens: TokenBox[];
  scanIndex: number;
  timer: number;
}

export const LLM_STEPS = [
  {
    title: 'Phase 1: Input Text Parsing',
    description: 'A Large Language Model cannot process letters directly. When you enter a prompt, the raw string is read character-by-character to prepare for word division.',
    panX: 1200, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 2: Tokenization & Vocab Mapping',
    description: 'The text is chopped into tokens (words or sub-words). Each token is assigned a unique index number from a massive Vocabulary ID database. Click boxes to toggle between text and ID.',
    panX: 1200, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 3: Coordinate Vector Embeddings',
    description: 'Vocabulary IDs are looked up in a massive matrix to extract coordinates. Similar tokens (like "King" and "Queen") float near each other, capturing initial definitions.',
    panX: 400, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 4: Attention Relationships',
    description: 'The model calculates attention layers. Query words shoot laser links to context keys, measuring how strongly words in the prompt relate to one another.',
    panX: 400, panY: 0, zoom: 1.6
  },
  {
    title: 'Phase 5: Neural Net Feed-Forward',
    description: 'Token vectors pass through dense layer synapses. Multiplying values by weights and biases captures high-level logic, grammar, and reasoning patterns.',
    panX: -400, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 6: Backpropagation & Training',
    description: 'During training, target differences trigger gradient flows. Red error signals traverse connections backward to optimize node biases and connection strengths.',
    panX: -400, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 7: Next-Token Selection',
    description: 'The final vectors map to a probability list. The model builds a branching options tree, commits the highest percentage word, and repeats to predict the next word.',
    panX: -1200, panY: 0, zoom: 1.3
  }
];
