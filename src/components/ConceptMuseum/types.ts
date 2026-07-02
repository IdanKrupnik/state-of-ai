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
    description: 'A Large Language Model cannot process letters directly. When you enter a prompt, the raw string is read character-by-character. Look at Exhibit A on the left: the raw string represents the prompt typed by the user, waiting to be sliced into computational chunks.',
    panX: 1200, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 2: Tokenization & Vocab Mapping',
    description: 'The text is chopped into tokens (words or sub-words), visible as box partitions in Exhibit A. Each token is assigned a unique index number from a massive Vocabulary ID database. Click the token boxes on the canvas to toggle them and see how text strings convert to integers.',
    panX: 1200, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 3: Coordinate Vector Embeddings',
    description: 'Vocabulary IDs are looked up in a massive matrix to extract coordinate values. In Exhibit B, look at the floating stars: this represents the embedding space. Words with similar meanings occupy nearby coordinates, mapping semantic relationships.',
    panX: 400, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 4: Attention Relationships',
    description: 'The model calculates attention layers. In Exhibit B, watch lasers fire from hub words: this represents attention weights highlighting context links dynamically, measuring how strongly words in the prompt relate to one another.',
    panX: 400, panY: 0, zoom: 1.6
  },
  {
    title: 'Phase 5: Neural Net Feed-Forward',
    description: 'Word coordinates pass through dense layer synapses (lines in Exhibit C). Active neuron nodes process signals forward, multiplying input values by weights and biases to capture high-level logic, grammar, and reasoning patterns.',
    panX: -400, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 6: Backpropagation & Training',
    description: 'During training, target differences trigger gradient flows. Watch the red error signals traverse synaptic connections backward in Exhibit C: this represents backpropagation calibration to optimize synaptic weights and improve accuracy.',
    panX: -400, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 7: Next-Token Selection',
    description: 'The final vectors map to a probability list. In Exhibit D, look at the predicted options tree branching from the typewriter text. Click a candidate word option directly on the canvas to commit it manually and see how the winning token is selected.',
    panX: -1200, panY: 0, zoom: 1.3
  },
  {
    title: 'Phase 8: Autoregressive Loop (Repetition)',
    description: 'Once the next word is committed, it is appended to the input prompt context in Exhibit D. See the large curved blue dashed line circling back across the museum: this represents the autoregressive feedback loop recycling the output back as the new input, repeating the entire 8-phase cycle to generate text word-by-word.',
    panX: -1200, panY: 0, zoom: 1.3
  }
];

export interface CanvasTooltipItem {
  id: string;
  exhibitX: number;
  lx: number;
  ly: number;
  term: string;
  definition: string;
}
