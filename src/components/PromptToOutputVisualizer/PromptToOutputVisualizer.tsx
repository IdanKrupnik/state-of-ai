import React, { useState } from 'react';
import { TokenVisualizer } from '../TokenVisualizer/TokenVisualizer';
import { EmbeddingVisualizer } from '../EmbeddingVisualizer/EmbeddingVisualizer';
import { AttentionVisualizer } from '../AttentionVisualizer/AttentionVisualizer';
import { GenerationVisualizer } from '../GenerationVisualizer/GenerationVisualizer';

interface StepData {
  num: number;
  title: string;
  desc: string;
}

export const PromptToOutputVisualizer: React.FC = () => {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('The cat sat on the mat');

  const steps: StepData[] = [
    {
      num: 1,
      title: 'Tokenization',
      desc: "AI cannot read whole words like humans do. Instead, it acts like a pair of scissors, chopping your sentence into tiny puzzle pieces called 'tokens'—sometimes splitting a single word into chunks—and assigns a unique number to each piece so it can keep track of them.",
    },
    {
      num: 2,
      title: 'Vector Embedding',
      desc: "Next, the AI takes those numbered puzzle pieces and places them on a massive, invisible map of meanings. Words that are similar (like 'cat' and 'dog') are placed right next to each other in the same neighborhood, while unrelated words (like 'airplane') are sent far away.",
    },
    {
      num: 3,
      title: 'The Attention Mechanism',
      desc: "Words change their meaning depending on the sentence. To figure out the right context, the AI shoots glowing laser lines between all the words at the same time. This allows it to look at the big picture and understand exactly how the words relate to one another.",
    },
    {
      num: 4,
      title: 'Next-Token Generation',
      desc: "Finally, the AI plays a highly advanced game of autocomplete. It looks at its map of connected words and calculates a list of percentage guesses for what the absolute best next word should be. It picks the winner with the highest score, types it out, and repeats the whole loop.",
    },
  ];

  const presets = ['The cat sat on the mat', 'Synthetic intelligence adapts', 'Modern models scale'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border border-outline-variant p-6 bg-brand-offwhite shadow-sm" data-testid="prompt-to-output-visualizer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <label className="font-geist-mono text-xs text-brand-warm-grey uppercase font-bold">Input Prompt</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border border-outline-variant focus:outline-none focus:border-brand-black text-sm bg-brand-clay/5 font-medium text-brand-black"
            data-testid="prompt-input"
          />
          <div className="flex gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="font-geist-mono text-[9px] px-2.5 py-1.5 border border-outline-variant bg-brand-clay/10 text-brand-warm-grey hover:bg-brand-black hover:text-brand-offwhite transition-colors cursor-pointer"
                data-testid={`preset-btn-${p.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <nav className="flex border-b border-outline-variant" data-testid="visualizer-tabs">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex-1 pb-3 text-xs font-geist-mono uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                step === s.num
                  ? 'border-brand-black text-brand-black font-bold'
                  : 'border-transparent text-brand-warm-grey hover:text-brand-black'
              }`}
              data-testid={`step-tab-${s.num}`}
            >
              Step {s.num}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-2.5 min-h-[140px]" data-testid="step-content">
          <span className="font-geist-mono text-xs text-brand-warm-grey font-bold">STEP 0{steps[step - 1].num} // {steps[step - 1].title.toUpperCase()}</span>
          <h3 className="text-xl font-black text-brand-black leading-tight">{steps[step - 1].title}</h3>
          <p className="text-sm text-brand-warm-grey leading-relaxed">{steps[step - 1].desc}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center border border-outline-variant/60 bg-brand-clay/5 rounded overflow-hidden" data-testid="canvas-area">
        {step === 1 && <TokenVisualizer prompt={prompt} />}
        {step === 2 && <EmbeddingVisualizer prompt={prompt} />}
        {step === 3 && <AttentionVisualizer prompt={prompt} />}
        {step === 4 && <GenerationVisualizer prompt={prompt} />}
      </div>
    </div>
  );
};
