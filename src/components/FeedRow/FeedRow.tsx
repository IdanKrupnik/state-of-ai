import React from 'react';

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
      className="group border border-outline-variant/30 p-6 bg-brand-clay/5 rounded-xl hover:border-brand-black hover:shadow-sm transition-all duration-200"
    >
      <div className="flex flex-col gap-5 w-full">
        <div className="flex items-start justify-between gap-4 w-full">
          <h4 className="text-xl md:text-2xl font-bold font-inter tracking-tight text-brand-black flex-grow">
            {title}
          </h4>
          <span className="font-label-mono text-label-mono text-brand-warm-grey shrink-0 mt-1">
            {timestamp}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-stretch w-full">
          <div className="flex-1 flex flex-col gap-4">
            <div
              data-testid="feed-row-content"
              className="font-body-md text-on-surface-variant leading-relaxed"
            >
              <p className="mb-2 text-brand-warm-grey font-bold flex items-center gap-1.5 uppercase text-xs font-geist-mono tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-brand-warm-grey">smart_toy</span>
                AI SUMMARY
              </p>
              <div className="border-l-2 border-brand-black pl-4 mt-3">
                <p>{summary}</p>
              </div>
            </div>

            <div className="font-body-md leading-relaxed mt-auto pt-2">
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                Source material {sourceDisplay ? `(${sourceDisplay})` : ''}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>

          <div className="w-full md:w-56 lg:w-64 flex flex-col gap-4 shrink-0 items-end justify-between">
            {imageUrl && (
              <div className="w-full aspect-[16/9] overflow-hidden rounded-lg border border-brand-black/10 bg-brand-clay/5 relative group-hover:border-brand-black/25 transition-colors">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  data-testid="feed-row-image"
                />
              </div>
            )}
            
            <div className="mt-auto">
              <button
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 text-xs font-bold font-geist-mono uppercase tracking-wider bg-brand-black text-brand-offwhite hover:bg-brand-black/90 transition-all duration-200 rounded flex items-center gap-1.5 shadow-sm border border-brand-black/10 cursor-pointer whitespace-nowrap"
                data-testid="feed-row-more-btn"
              >
                <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                I want more like this
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
