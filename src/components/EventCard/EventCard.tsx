import React from 'react';

export interface EventProps {
  id: string;
  date: string;
  location: string;
  isLive?: boolean;
  title: string;
  description: string;
  type: string;
  isAlertSet: boolean;
  onToggleAlert: (id: string) => void;
}

export const EventCard: React.FC<EventProps> = ({
  id,
  date,
  location,
  isLive,
  title,
  description,
  type,
  isAlertSet,
  onToggleAlert,
}) => {
  return (
    <article className="relative group pl-8" data-testid={`event-card-${id}`}>
      <div className="absolute left-[-8.5px] top-[7px] w-4 h-4 bg-brand-offwhite border border-outline-variant rounded-full group-hover:border-secondary transition-colors z-10" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="font-geist-mono text-xs text-brand-warm-grey">{date}</span>
            {isLive && (
              <div className="flex items-center gap-1.5" data-testid="live-indicator">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-geist-mono text-xs text-secondary font-bold">[ LIVE ]</span>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-geist-mono text-xs text-secondary hover:underline ml-2"
                  data-testid="live-stream-link"
                >
                  ↗ WATCH STREAM
                </a>
              </div>
            )}
          </div>
          <span className="font-geist-mono text-xs px-2 py-0.5 bg-brand-clay/10 text-brand-warm-grey">
            {location}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-black group-hover:text-secondary transition-colors">
          {title}
        </h2>
        <p className="text-brand-warm-grey text-sm md:text-base leading-relaxed">
          {description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-4">
          <span className="font-geist-mono text-[10px] text-brand-warm-grey uppercase tracking-widest">
            {type}
          </span>
          <button
            onClick={() => onToggleAlert(id)}
            className="font-geist-mono text-xs border border-brand-black px-4 py-1.5 hover:bg-brand-black hover:text-brand-offwhite transition-all active:scale-95 bg-brand-clay/5 hover:border-secondary"
            data-testid={`alert-btn-${id}`}
          >
            {isLive ? (isAlertSet ? '[ SILENCED ]' : '[ NOTIFY ME ]') : (isAlertSet ? '[ ALERT SET ]' : '[ SET ALERT ]')}
          </button>
        </div>
      </div>
    </article>
  );
};
