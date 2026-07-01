import React, { useState, useEffect } from 'react';
import { PromptToOutputVisualizer } from '../PromptToOutputVisualizer/PromptToOutputVisualizer';

interface SectionProps {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}

const LearnSection: React.FC<SectionProps> = ({ id, number, title, children }) => (
  <section id={id} className="flex flex-col gap-5 border-t border-outline-variant pt-10" data-testid={`learn-section-${id}`}>
    <span className="font-geist-mono text-xs text-brand-warm-grey">{number}</span>
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-black">{title}</h2>
    {children}
  </section>
);

export const AIBasics: React.FC = () => {
  const [isTocOpen, setIsTocOpen] = useState(false);

  const handleTocClick = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.location.hash = `learn/${sectionId}`;
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const tocItems = [
    { id: 'definition', label: '01 // Definition' },
    { id: 'architecture', label: '02 // Architecture' },
    { id: 'capabilities', label: '03 // Capabilities' },
    { id: 'visualizer', label: '04 // Visualizer' },
    { id: 'glossary', label: '05 // Glossary' },
  ];

  return (
    <div className="flex flex-col gap-16 py-4" data-testid="ai-basics-section">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-geist-mono text-xs text-brand-warm-grey tracking-wider">
            LIVE_DOCUMENT // v4.0.2
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-black">
          AI Fundamentals
        </h1>
        <p className="text-brand-warm-grey text-lg md:text-xl font-medium leading-relaxed max-w-prose">
          A foundational inquiry into the mechanisms, architectures, and deployment paradigms governing contemporary synthetic intelligence.
        </p>
      </section>

      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40" data-testid="learn-toc-mobile-container">
        <button
          onClick={() => setIsTocOpen(true)}
          className="bg-brand-black text-brand-offwhite px-5 py-3 rounded-full flex items-center gap-2.5 shadow-xl border border-brand-offwhite/10 hover:scale-105 active:scale-95 transition-all text-xs font-geist-mono uppercase tracking-wider cursor-pointer"
          data-testid="learn-toc-mobile-toggle"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span>Sections</span>
        </button>
      </div>

      {isTocOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end" data-testid="learn-toc-mobile-dropdown">
          <div
            className="absolute inset-0 bg-brand-black/45 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
            onClick={() => setIsTocOpen(false)}
            data-testid="learn-toc-mobile-backdrop"
          />

          <div className="relative bg-brand-offwhite w-full rounded-t-2xl p-6 flex flex-col gap-6 shadow-2xl border-t border-outline-variant transform translate-y-0 transition-transform duration-300 z-10">
            <div className="w-12 h-1 bg-brand-clay/40 rounded-full mx-auto" />

            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
              <span className="font-geist-mono text-xs font-bold text-brand-black tracking-wider">
                DOCUMENT INDEX
              </span>
              <button
                onClick={() => setIsTocOpen(false)}
                className="text-brand-warm-grey hover:text-brand-black p-1 cursor-pointer"
                aria-label="Close index"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#learn/${item.id}`}
                  onClick={(e) => {
                    handleTocClick(item.id, e);
                    setIsTocOpen(false);
                  }}
                  className="py-4 border-b border-outline-variant/20 font-geist-mono text-sm uppercase tracking-wide text-brand-warm-grey hover:text-brand-black active:text-brand-black transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-12 items-start">
        <aside className="hidden md:flex flex-col gap-4 sticky top-24 font-geist-mono text-xs uppercase tracking-wider text-brand-warm-grey" data-testid="learn-toc">
          <span className="font-bold text-brand-black pb-2 border-b border-outline-variant/30">
            Navigation
          </span>
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#learn/${item.id}`}
              onClick={(e) => handleTocClick(item.id, e)}
              className="hover:text-brand-black transition-colors"
            >
              {item.label}
            </a>
          ))}
        </aside>

        <div className="flex flex-col gap-16">
          <LearnSection id="definition" number="01 // DEFINITION" title="What is Artificial Intelligence?">
            <div className="text-brand-warm-grey text-base md:text-lg space-y-6 leading-relaxed max-w-prose">
              <p>
                Artificial Intelligence (AI) encompasses systems designed to perform tasks that typically require human cognition. Rather than static code, modern AI utilizes autonomous agents that adapt through experience.
              </p>
              <p>
                Machine Learning (ML) acts as the engine, allowing algorithms to parse vast datasets, identify patterns, and make high-probability decisions without explicit instruction.
              </p>
            </div>
          </LearnSection>

          <LearnSection id="architecture" number="02 // ARCHITECTURE" title="Neural Networks">
            <p className="text-brand-warm-grey text-base md:text-lg leading-relaxed max-w-prose">
              At the core of deep learning are neural networks—computational structures loosely inspired by the biological connectivity of the human brain. These layers of "neurons" process information non-linearly, enabling the mapping of complex inputs to specific outputs.
            </p>
            <div className="bg-brand-clay/10 p-4 border-l-2 border-brand-black font-geist-mono text-xs text-brand-warm-grey">
              [ ARCH_TYPE: TRANSFORMER_MODEL_V4 ]
            </div>
          </LearnSection>

          <LearnSection id="capabilities" number="03 // CAPABILITIES" title="Large Language Models (LLMs)">
            <p className="text-brand-warm-grey text-base md:text-lg leading-relaxed max-w-prose">
              LLMs represent the current frontier of natural language processing. By predicting the next token in a sequence, these models exhibit emergent properties such as logical reasoning, creative synthesis, and multi-step problem solving.
            </p>
          </LearnSection>
          <LearnSection id="visualizer" number="04 // INTERACTIVE" title="How AI Generates Answers">
            <PromptToOutputVisualizer />
          </LearnSection>

          <LearnSection id="glossary" number="05 // GLOSSARY" title="AI Terminology">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {glossaryTerms.map((term) => (
                <div key={term.word} className="border border-outline-variant p-5 bg-brand-offwhite">
                  <h3 className="font-geist-mono font-bold text-sm text-brand-black mb-2 uppercase tracking-wide">
                    {term.word}
                  </h3>
                  <p className="text-brand-warm-grey text-xs leading-relaxed">
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          </LearnSection>
        </div>
      </div>
    </div>
  );
};

const glossaryTerms = [
  {
    word: 'LLM',
    definition: 'Large Language Model. An AI model trained on massive text datasets that understands and generates human-like text.',
  },
  {
    word: 'Transformer',
    definition: 'The underlying neural network architecture that powers modern generative AI models using self-attention mechanisms.',
  },
  {
    word: 'Token',
    definition: 'A small piece of text (like a word or a syllable) that an AI model processes as a single basic unit of data.',
  },
  {
    word: 'Fine-Tuning',
    definition: 'The process of taking a pre-trained model and training it further on a smaller, specific dataset for a specialized task.',
  },
  {
    word: 'Prompt',
    definition: 'The input instructions, text, or questions provided by a user to direct the AI model on what output to generate.',
  },
  {
    word: 'Weights',
    definition: 'Numerical values within the neural network layers that determine how information is processed and transformed.',
  },
  {
    word: 'Hallucination',
    definition: 'A phenomenon where an AI model generates factually incorrect, false, or nonsensical information with high confidence.',
  },
  {
    word: 'RAG',
    definition: 'Retrieval-Augmented Generation. A framework that retrieves facts from an external database to provide as context to the LLM, reducing factual errors.',
  },
  {
    word: 'Agent',
    definition: 'An autonomous AI system equipped with planning, memory, and access to tools to execute multi-step workflows independently.',
  },
  {
    word: 'RLHF',
    definition: 'Reinforcement Learning from Human Feedback. A method that aligns AI models with human values by tuning them using human ratings.',
  },
  {
    word: 'Embeddings',
    definition: 'Mathematical vectors that represent words or concepts in high-dimensional space, measuring their semantic similarity.',
  },
  {
    word: 'Parameters',
    definition: 'The internal variables (weights and biases) that a model optimizes during training to learn specific patterns.',
  },
  {
    word: 'Quantization',
    definition: 'A model compression method that reduces the numerical precision of parameters to speed up generation and save memory.',
  },
  {
    word: 'Context Window',
    definition: 'The maximum limit of tokens (text chunks) a model can read and process in a single conversational round-trip.',
  },
];
