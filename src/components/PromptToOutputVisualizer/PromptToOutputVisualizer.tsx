import React, { useState } from 'react';
import { Stepper } from '../ui/Stepper/Stepper';
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
      desc: "AI cannot read whole words. It acts like scissors, chopping your sentence into tiny puzzle pieces called 'tokens' (which can be parts of words) and numbers them to keep track.",
    },
    {
      num: 2,
      title: 'Vector Embedding',
      desc: "Next, the AI places these numbered pieces on an invisible map of meanings. Similar words (like 'cat' and 'dog') sit close together, while different words (like 'airplane') sit far away.",
    },
    {
      num: 3,
      title: 'The Attention Mechanism',
      desc: "To understand the context of the sentence, the AI draws connections (lasers) between all the words. This helps it see the big picture and understand how they relate.",
    },
    {
      num: 4,
      title: 'Next-Token Generation',
      desc: "Finally, the AI plays autocomplete. It guesses which word should come next, lists candidates with percentage scores, and selects the winner with the highest score.",
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
            {presets.map((p) => {
              const isActive = prompt === p;
              return (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className={`font-geist-mono text-[9px] px-2.5 py-1.5 border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-brand-black border-brand-black text-brand-offwhite'
                      : 'bg-brand-clay/10 border-outline-variant text-brand-warm-grey hover:bg-brand-black hover:text-brand-offwhite'
                  }`}
                  data-testid={`preset-btn-${p.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <div className="py-2">
          <Stepper
            steps={steps.map(s => s.title)}
            currentStep={step}
            onStepChange={setStep}
          />
        </div>

        <div className="flex flex-col gap-2.5 min-h-[140px]" data-testid="step-content">
          <span className="font-geist-mono text-xs text-brand-warm-grey font-bold">STEP 0{steps[step - 1].num} // {steps[step - 1].title.toUpperCase()}</span>
          <h3 className="text-xl font-black text-brand-black leading-tight">{steps[step - 1].title}</h3>
          <p className="text-sm text-brand-warm-grey leading-relaxed">{steps[step - 1].desc}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center border border-outline-variant p-6 bg-brand-offwhite min-h-[320px] relative overflow-hidden" data-testid="canvas-area">
        {step === 1 && <TokenVisualizer prompt={prompt} />}
        {step === 2 && <EmbeddingVisualizer prompt={prompt} />}
        {step === 3 && <AttentionVisualizer prompt={prompt} />}
        {step === 4 && <GenerationVisualizer prompt={prompt} />}
      </div>
    </div>
  );
};
