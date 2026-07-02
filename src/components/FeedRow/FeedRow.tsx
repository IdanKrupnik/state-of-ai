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
      onClick={() => setIsOpen(!isOpen)}
      data-testid="feed-row"
      className="group border-b border-outline-variant py-6 cursor-pointer hover:bg-surface-container-low transition-colors px-2 -mx-2"
    >
      <div className="flex items-start gap-4 md:gap-6">
        <div className="flex-grow">
          <h4 className="font-headline-sm text-headline-sm group-hover:underline underline-offset-4 text-brand-black">
            {title}
          </h4>
          <div
            data-testid="feed-row-content"
            className={`${isOpen ? 'block' : 'hidden'} mt-4 font-body-md text-on-surface-variant leading-relaxed`}
          >
            <p className="mb-2 text-brand-warm-grey font-bold">
              AI SUMMARY
            </p>
            <div className="border-l-2 border-brand-black pl-4 mt-3">
              <p>{summary}</p>
            </div>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-primary font-bold hover:gap-2 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              Source material {sourceDisplay ? `(${sourceDisplay})` : ''}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <span className="font-label-mono text-label-mono text-brand-warm-grey shrink-0 mt-1">
            {timestamp}
          </span>
          {imageUrl && (
            <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-md border border-brand-black/10 bg-brand-clay/10 relative group-hover:border-brand-black/25 transition-colors">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-testid="feed-row-image"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
