'use client';

import React, { useState } from 'react';
import { InputField } from '../ui/InputField/InputField';

export interface Term {
  word: string;
  definition: string;
}

export const Terminology: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const lettersWithTerms = new Set(
    terms.map((t) => t.word.charAt(0).toUpperCase())
  );

  const sortedTerms = [...terms].sort((a, b) => a.word.localeCompare(b.word));

  const filteredTerms = sortedTerms.filter((term) => {
    const matchesSearch =
      term.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (searchQuery) return true;

    if (selectedLetter === 'ALL') return true;
    return term.word.toUpperCase().startsWith(selectedLetter);
  });

  return (
    <div className="flex flex-col gap-8 w-full" data-testid="terminology-section">
      <div className="flex flex-col gap-6">
        <div className="max-w-md w-full">
          <InputField
            id="terminology-search"
            variant="full"
            label="Search Terminology"
            placeholder="SEARCH TERMINOLOGY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="terminology-search-input"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-geist-mono text-xs text-brand-warm-grey uppercase tracking-wider">
            Filter by Letter
          </span>
          <div className="flex flex-wrap gap-1 md:gap-1.5 items-center" data-testid="terminology-alphabet-nav">
            <button
              onClick={() => setSelectedLetter('ALL')}
              className={`px-3 h-8 text-xs font-geist-mono uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                selectedLetter === 'ALL'
                  ? 'bg-brand-black text-brand-offwhite border-brand-black font-bold'
                  : 'text-brand-warm-grey border-outline-variant hover:text-brand-black hover:border-brand-nav-text/45 bg-transparent'
              }`}
              data-testid="letter-tab-all"
            >
              ALL
            </button>
            {alphabet.map((letter) => {
              const hasTerms = lettersWithTerms.has(letter);
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  disabled={!hasTerms}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-geist-mono uppercase border transition-all duration-200 ${
                    !hasTerms
                      ? 'text-brand-warm-grey/30 border-outline-variant/30 cursor-not-allowed bg-transparent'
                      : isSelected
                      ? 'bg-brand-black text-brand-offwhite border-brand-black font-bold cursor-pointer'
                      : 'text-brand-warm-grey border-outline-variant hover:text-brand-black hover:border-brand-nav-text/45 cursor-pointer bg-transparent'
                  }`}
                  data-testid={`letter-tab-${letter.toLowerCase()}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {searchQuery && (
        <div className="text-xs font-geist-mono text-brand-warm-grey uppercase tracking-wide italic">
          Showing search results matching "{searchQuery}" across all letters.
        </div>
      )}

      {filteredTerms.length === 0 ? (
        <div className="border border-outline-variant p-8 text-center text-brand-warm-grey italic text-sm" data-testid="terminology-empty-state">
          NO MATCHING TERMS FOUND.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="terminology-grid">
          {filteredTerms.map((term) => (
            <div
              key={term.word}
              className="border border-outline-variant p-5 bg-brand-offwhite flex flex-col gap-2 transition-all duration-300 hover:border-brand-nav-text/45"
              data-testid={`term-card-${term.word.toLowerCase()}`}
            >
              <h3 className="font-geist-mono font-bold text-sm text-brand-black uppercase tracking-wide">
                {term.word}
              </h3>
              <p className="text-brand-warm-grey text-xs leading-relaxed">
                {term.definition}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const terms: Term[] = [
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

