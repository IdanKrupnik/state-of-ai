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

export const LLM_STEPS = [
  {
    title: 'Phase 1: Tokenization & Embeddings',
    description: 'Raw input text is split into tokens. Each token is mapped to a vector—a set of coordinates in a high-dimensional space—bringing similar concepts closer together.',
    panX: 800, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 2: Attention Mechanisms',
    description: 'The model calculates attention weights between tokens. Hub words dynamically shoot laser coordinates to nearby words, indicating how strongly they associate.',
    panX: 800, panY: 0, zoom: 1.6
  },
  {
    title: 'Phase 3: Neural Net Feed-Forward',
    description: 'Word coordinates pass through dense layer synapses. Multiplying vectors by weights and biases extracts complex contextual relationships.',
    panX: 0, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 4: Training via Backpropagation',
    description: 'During training, prediction errors trigger backward gradient flows. Red error signals propagate in reverse to adjust synaptic weights and improve accuracy.',
    panX: 0, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 5: Next-Token Generation',
    description: 'For inference, the model projects final probabilities for the next word. It commits the highest probability candidate, appends it, and repeats the process.',
    panX: -800, panY: 0, zoom: 1.3
  }
];
