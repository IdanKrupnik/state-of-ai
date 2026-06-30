import React, { useState } from 'react';
import { EventCard } from '../EventCard/EventCard';

interface MockEvent {
  id: string;
  date: string;
  location: string;
  isLive?: boolean;
  title: string;
  description: string;
  type: string;
  category: string;
}

const MOCK_EVENTS: MockEvent[] = [
  {
    id: 'nvidia-gtc-2024',
    date: 'MAR 18-21, 2024',
    location: 'SAN JOSE, CA',
    isLive: true,
    title: 'NVIDIA GTC 2024',
    description: 'The "Woodstock of AI." Expected focus on Blackwell architecture and sovereign AI infrastructure.',
    type: 'Type: Hardware / Compute',
    category: 'HARDWARE_ARCH',
  },
  {
    id: 'google-io-2024',
    date: 'MAY 14, 2024',
    location: 'MOUNTAIN VIEW, CA',
    title: 'Google I/O',
    description: 'Gemini ecosystem expansion across Android and Workspace. Integration of multimodality at scale.',
    type: 'Type: Developer Ecosystem',
    category: 'DEVELOPER_OPS',
  },
  {
    id: 'openai-devday-2024',
    date: 'TBA Q2 2024',
    location: 'VIRTUAL / SF',
    title: 'OpenAI DevDay',
    description: 'Anticipated GPT-5 developer preview and Sora API accessibility roadmap.',
    type: 'Type: Model Research',
    category: 'DEVELOPER_OPS',
  },
  {
    id: 'apple-wwdc-2024',
    date: 'JUN 10-14, 2024',
    location: 'CUPERTINO, CA',
    title: 'Apple WWDC24',
    description: "The \"AI Pivot.\" Massive LLM integration into iOS 18 and Siri's foundational rewrite.",
    type: 'Type: Consumer AI / Edge',
    category: 'GLOBAL_POLICY',
  },
];

interface PastEvent {
  id: string;
  date: string;
  location: string;
  title: string;
  description: string;
  youtubeUrl: string;
  aiSummary: string;
}

const PAST_EVENTS: PastEvent[] = [
  {
    id: 'openai-devday-2023',
    date: 'NOV 6, 2023',
    location: 'SAN FRANCISCO, CA',
    title: 'OpenAI DevDay 2023',
    description: "OpenAI's inaugural developer conference showcasing major API upgrades and custom agent builders.",
    youtubeUrl: 'https://youtube.com',
    aiSummary: 'Unveiled GPT-4 Turbo with a 128K context window, custom GPT creators, and the Assistants API, drastically lowering API access costs.',
  },
  {
    id: 'google-io-2023',
    date: 'MAY 10, 2023',
    location: 'MOUNTAIN VIEW, CA',
    title: 'Google I/O 2023',
    description: 'Keynote focused on AI integration across workspace products and next-generation model introductions.',
    youtubeUrl: 'https://youtube.com',
    aiSummary: 'Announced PaLM 2, expanded Gemini availability worldwide, and integrated generative AI overlays across Google Search (SGE).',
  },
];

export const Events: React.FC = () => {
  const [alerts, setAlerts] = useState<string[]>([]);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const handleToggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-14 py-4" data-testid="events-section">
      <header className="border-b border-outline-variant/30 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-secondary dot-glow animate-pulse" />
          <span className="font-geist-mono text-xs uppercase tracking-[0.2em] text-brand-warm-grey">
            Live Telemetry / Events
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-black">
          Upcoming Events
        </h1>
        <p className="text-brand-warm-grey text-base leading-relaxed max-w-prose mt-2">
          Tracking the pivotal moments in artificial intelligence. From foundational model releases to global regulatory summits.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-bold tracking-tight text-brand-black uppercase">
          Timeline Stream
        </h2>
        <div className="relative pl-8 space-y-12">
          <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-outline-variant/40" />
          {MOCK_EVENTS.map((evt) => (
            <EventCard
              key={evt.id}
              id={evt.id}
              date={evt.date}
              location={evt.location}
              isLive={evt.isLive}
              title={evt.title}
              description={evt.description}
              type={evt.type}
              isAlertSet={alerts.includes(evt.id)}
              onToggleAlert={handleToggleAlert}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-outline-variant/30 pt-10 flex flex-col gap-6" data-testid="past-events-log">
        <h2 className="text-xl font-bold tracking-tight text-brand-black uppercase">
          Past Events Log
        </h2>
        <div className="flex flex-col gap-6">
          {PAST_EVENTS.map((evt) => {
            const isExpanded = expandedEventId === evt.id;
            return (
              <div
                key={evt.id}
                className="border border-outline-variant/30 p-5 bg-brand-clay/5 flex flex-col gap-3 hover:border-brand-black hover:shadow-sm transition-all duration-200"
                data-testid={`past-event-card-${evt.id}`}
              >
                <div className="flex justify-between items-baseline flex-wrap gap-2 text-xs font-geist-mono text-brand-warm-grey">
                  <span>{evt.date}</span>
                  <span>{evt.location}</span>
                </div>
                <h3 className="text-lg font-bold text-brand-black">{evt.title}</h3>
                <p className="text-brand-warm-grey text-sm leading-relaxed">
                  {evt.description}
                </p>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                      className="font-geist-mono text-xs border border-brand-black px-4 py-1.5 hover:bg-brand-black hover:text-brand-offwhite transition-all active:scale-95 bg-brand-clay/5 hover:border-secondary"
                      data-testid={`past-details-toggle-${evt.id}`}
                    >
                      {isExpanded ? '[ HIDE DETAILS ]' : '[ VIEW DETAILS ]'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 border-t border-outline-variant/30 pt-4 flex flex-col gap-4" data-testid={`past-details-dropdown-${evt.id}`}>
                      <div className="flex flex-col gap-1">
                        <span className="font-geist-mono text-[10px] text-brand-warm-grey uppercase tracking-widest">
                          RECORDING /
                        </span>
                        <a
                          href={evt.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-geist-mono text-xs text-secondary hover:underline flex items-center gap-1"
                          data-testid={`past-youtube-link-${evt.id}`}
                        >
                          ↗ WATCH STREAM RECORDING ON YOUTUBE
                        </a>
                      </div>

                      <div className="flex flex-col gap-1 bg-brand-clay/10 p-4 border-l-2 border-brand-black">
                        <span className="font-geist-mono text-[10px] text-brand-black uppercase tracking-widest font-bold">
                          AI SUMMARY //
                        </span>
                        <p className="text-brand-warm-grey text-xs md:text-sm leading-relaxed mt-1" data-testid={`past-ai-summary-${evt.id}`}>
                          {evt.aiSummary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
