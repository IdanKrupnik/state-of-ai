import React, { useState } from 'react';

export interface FeedRowProps {
  company: string;
  title: string;
  summary: string;
  sourceUrl: string;
  timestamp?: string;
  source?: string;
  imageUrl?: string | null;
}

export const FeedRow: React.FC<FeedRowProps> = ({
  company,
  title,
  summary,
  sourceUrl,
  timestamp = '12:00 UTC',
  source,
  imageUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSourceDisplay = () => {
    if (source) return source;
    try {
      return new URL(sourceUrl).hostname.replace('www.', '');
    } catch {
      return '';
    }
  };

  const sourceDisplay = getSourceDisplay();

  return (
    <div
      data-testid="feed-row"
      className="group border-b border-outline-variant py-6 px-2 -mx-2 hover:bg-surface-container-low transition-colors"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h4
            onClick={() => setIsOpen(!isOpen)}
            className="font-headline-sm text-headline-sm hover:underline underline-offset-4 text-brand-black flex-grow cursor-pointer"
          >
            {title}
          </h4>
          <span className="font-label-mono text-label-mono text-brand-warm-grey shrink-0 mt-1">
            {timestamp}
          </span>
        </div>

        <div
          data-testid="feed-row-content"
          className={`${isOpen ? 'block' : 'hidden'} font-body-md text-on-surface-variant leading-relaxed mt-2`}
        >
          <p className="mb-2 text-brand-warm-grey font-bold">
            AI SUMMARY
          </p>
          <div className="border-l-2 border-brand-black pl-4 mt-3">
            <p>{summary}</p>
          </div>
        </div>

        {imageUrl && (
          <div className="w-full max-w-md mx-auto aspect-[16/9] overflow-hidden rounded-lg border border-brand-black/10 bg-brand-clay/5 relative group-hover:border-brand-black/25 transition-colors">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              data-testid="feed-row-image"
            />
          </div>
        )}

        <div className={`${isOpen ? 'block' : 'hidden'} font-body-md leading-relaxed`}>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-primary font-bold hover:gap-2 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            Source material {sourceDisplay ? `(${sourceDisplay})` : ''}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  );
};
