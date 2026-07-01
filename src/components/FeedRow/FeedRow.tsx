import React, { useState } from 'react';

export interface FeedRowProps {
  company: string;
  title: string;
  summary: string;
  sourceUrl: string;
  timestamp?: string;
}

export const FeedRow: React.FC<FeedRowProps> = ({
  company,
  title,
  summary,
  sourceUrl,
  timestamp = '12:00 UTC',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      data-testid="feed-row"
      className="group border-b border-outline-variant py-6 cursor-pointer hover:bg-surface-container-low transition-colors px-2 -mx-2"
    >
      <div className="flex items-start gap-4">
        <div className="flex-grow">
          <h4 className="font-headline-sm text-headline-sm group-hover:underline underline-offset-4 text-brand-black">
            {title}
          </h4>
          <div
            data-testid="feed-row-content"
            className={`${isOpen ? 'block' : 'hidden'} mt-4 font-body-md text-on-surface-variant leading-relaxed`}
          >
            <p className="mb-2 text-brand-warm-grey">
              {company.toUpperCase() === 'AI' ? 'AI SUMMARY' : company.toUpperCase()}
            </p>
            <p>{summary}</p>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-primary font-bold hover:gap-2 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              Source material
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>
        <span className="font-label-mono text-label-mono text-brand-warm-grey shrink-0 mt-1">
          {timestamp}
        </span>
      </div>
    </div>
  );
};
