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
