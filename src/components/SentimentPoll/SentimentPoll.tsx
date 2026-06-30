import React from 'react';

export interface SentimentOption {
  label: string;
  percentage: number;
}

export interface SentimentPollProps {
  question?: string;
  options?: SentimentOption[];
}

export const SentimentPoll: React.FC<SentimentPollProps> = ({
  question = 'Native Context vs. RAG?',
  options = [
    { label: 'Native Context (1M+ Tokens)', percentage: 72 },
    { label: 'RAG (Retrieval Augmented)', percentage: 28 },
  ],
}) => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-geist-mono text-[11px] text-brand-warm-grey uppercase tracking-widest">// CURRENT SENTIMENT INDEX</h2>
      <div className="border-t border-brand-black pt-4">
        <h3 className="text-lg font-bold text-brand-black mb-6">{question}</h3>
        <div className="space-y-6">
          {options.map((option, idx) => (
            <div key={idx} data-testid="sentiment-option">
              <div className="flex justify-between font-geist-mono text-[11px] mb-2 uppercase text-brand-black">
                <span>{option.label}</span>
                <span className="font-bold">{option.percentage}%</span>
              </div>
              <div className="h-4 bg-brand-clay/40 border border-outline-variant">
                <div
                  data-testid="bar-fill"
                  className={idx === 0 ? 'h-full bg-brand-black' : 'h-full bg-brand-warm-grey'}
                  style={{ width: `${option.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
