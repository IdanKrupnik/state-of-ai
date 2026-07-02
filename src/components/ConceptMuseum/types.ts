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
  pendingWord: string;
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
    title: 'Phase 1: Reading Your Prompt',
    description: 'AI models cannot read raw text directly like humans do. When you type a prompt, the model reads it character-by-character to prepare it for processing. Look at the raw input string in Exhibit A on the left.',
    panX: 1200, panY: 0, zoom: 1.6
  },
  {
    title: 'Phase 2: Chopping Words (Tokenization)',
    description: 'The AI chops your sentence into bite-sized pieces called tokens (usually whole words or parts of words). It then assigns each token a unique number code. Click the word boxes in Exhibit A to flip them and see their secret ID codes!',
    panX: 1200, panY: 0, zoom: 1.6
  },
  {
    title: 'Phase 3: The Cosmic Dictionary (Embeddings)',
    description: 'Next, the AI maps these ID codes onto a coordinate grid. Look at the floating stars in Exhibit B: this is the embedding space! Words with similar meanings (like "cat" and "dog") park near each other, while unrelated words float far apart.',
    panX: 400, panY: 0, zoom: 1.6
  },
  {
    title: 'Phase 4: Understanding Context (Attention)',
    description: 'How does the AI know how words relate? It uses "Attention" to shine laser beams between words. Look at the lines firing in Exhibit B: this measures how strongly words connect (like linking the action "sat" to the object "mat").',
    panX: 400, panY: 0, zoom: 2.0
  },
  {
    title: 'Phase 5: Calculating the Answer (Neural Net)',
    description: 'The signals now travel through a dense web of wires (layer synapses) in Exhibit C. These wires act like volume dials, amplifying important clues and muting useless ones. Click the circular neuron nodes to fire test signals down the wires!',
    panX: -400, panY: 0, zoom: 1.6
  },
  {
    title: 'Phase 6: Learning From Mistakes (Backpropagation)',
    description: 'How does the AI get smarter? During training, it compares its guess with the correct answer. If it makes a mistake, it fires a red error pulse backward through the wires to recalibrate the dials (weights). Watch this happen in Exhibit C!',
    panX: -400, panY: 0, zoom: 1.6
  },
  {
    title: 'Phase 7: Predicting the Next Word',
    description: 'Based on all the clues, the AI creates a tree of candidate options for the next word. Look at the branch options in Exhibit D. You can override the AI by clicking any candidate option directly on the canvas to choose what it types next!',
    panX: -1200, panY: 0, zoom: 1.6
  },
  {
    title: 'Phase 8: The Endless Loop (Autoregressiveness)',
    description: 'Writing a sentence is just recycling! The AI takes the new word it just predicted, glues it to the end of your original prompt in green, and feeds the whole updated sentence back into Step 1 to guess the next word, repeating forever.',
    panX: -1200, panY: 0, zoom: 1.6
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
