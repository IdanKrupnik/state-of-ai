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

export const Events: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL_SIGNALS');
  const [alerts, setAlerts] = useState<string[]>([]);

  const handleToggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredEvents =
    selectedCategory === 'ALL_SIGNALS'
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((e) => e.category === selectedCategory);

  const categories = [
    { id: 'ALL_SIGNALS', label: 'ALL_SIGNALS' },
    { id: 'GLOBAL_POLICY', label: 'GLOBAL_POLICY' },
    { id: 'DEVELOPER_OPS', label: 'DEVELOPER_OPS' },
    { id: 'HARDWARE_ARCH', label: 'HARDWARE_ARCH' },
  ];

  return (
    <div className="flex flex-col gap-10 py-4" data-testid="events-section">
      <header className="border-b border-outline-variant/30 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-secondary dot-glow animate-pulse" />
          <span className="font-geist-mono text-xs uppercase tracking-[0.2em] text-brand-warm-grey">
            Live Telemetry / Events
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-black">
          Upcoming Signals
        </h1>
        <p className="text-brand-warm-grey text-base leading-relaxed max-w-prose mt-2">
          Tracking the pivotal moments in artificial intelligence. From foundational model releases to global regulatory summits.
        </p>
      </header>

      <div className="flex items-center gap-6 border-b border-outline-variant/30 pb-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`font-geist-mono text-xs pb-2 transition-all uppercase tracking-wider ${
              selectedCategory === cat.id
                ? 'text-brand-black font-bold border-b-2 border-brand-black'
                : 'text-brand-warm-grey hover:text-brand-black'
            }`}
            data-testid={`category-btn-${cat.id}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="relative pl-8 space-y-12">
        <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-outline-variant/40" />
        {filteredEvents.map((evt) => (
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
    </div>
  );
};
