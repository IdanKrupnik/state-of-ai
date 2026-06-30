import React from 'react';
import { Bell, Check } from 'lucide-react';

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
      <div className="absolute left-[-8px] top-[28px] w-4 h-4 bg-brand-offwhite border border-outline-variant rounded-full group-hover:border-secondary transition-colors z-10" />
      <div className="border border-outline-variant/30 p-5 bg-brand-clay/5 flex flex-col gap-3 hover:border-brand-black hover:shadow-sm transition-all duration-200">
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
          <div className="flex items-center gap-3">
            <span className="font-geist-mono text-xs px-2 py-0.5 bg-brand-clay/10 text-brand-warm-grey">
              {location}
            </span>
            {!isLive && (
              <button
                onClick={() => onToggleAlert(id)}
                className={`font-geist-mono text-[10px] border px-3 py-1 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  isAlertSet
                    ? 'bg-secondary text-brand-offwhite border-secondary hover:bg-secondary/90'
                    : 'border-brand-black bg-brand-clay/5 text-brand-black hover:bg-brand-black hover:text-brand-offwhite'
                }`}
                data-testid={`alert-btn-${id}`}
              >
                {isAlertSet ? (
                  <>
                    <Check className="w-3.5 h-3.5" data-testid="alert-icon-active" />
                    <span>[ ALERT ACTIVE ]</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" data-testid="alert-icon-inactive" />
                    <span>[ NOTIFY ME ]</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-black group-hover:text-secondary transition-colors">
          {title}
        </h2>
        <p className="text-brand-warm-grey text-sm md:text-base leading-relaxed">
          {description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-geist-mono text-[10px] text-brand-warm-grey uppercase tracking-widest" data-testid="event-type">
            {type}
          </span>
        </div>
      </div>
    </article>
  );
};
