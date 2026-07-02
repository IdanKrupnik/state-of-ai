import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="flex flex-col gap-12 py-4" data-testid="about-section">
      <header className="border-b border-outline-variant pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-secondary dot-glow animate-pulse" />
          <span className="font-geist-mono text-xs uppercase tracking-[0.2em] text-brand-warm-grey">
            Vision & Philosophy
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-black">
          About State of AI
        </h1>
        <p className="text-brand-warm-grey text-base leading-relaxed max-w-prose mt-2">
          Demystifying the artificial intelligence landscape through clear, hype-free, and high-fidelity coverage.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-outline-variant p-6 bg-brand-clay/5 hover:border-brand-black hover:shadow-sm transition-all duration-200">
          <span className="font-geist-mono text-[10px] text-brand-warm-grey uppercase tracking-widest block mb-2">
            01 / MISSION
          </span>
          <h3 className="text-lg font-bold text-brand-black mb-3">AI for Everyone</h3>
          <p className="text-brand-warm-grey text-sm leading-relaxed">
            Our goal is to make cutting-edge artificial intelligence accessible to people of all backgrounds and skill levels. Whether you are a curious learner, an industry professional, or a seasoned developer, we keep you informed without the noise.
          </p>
        </div>

        <div className="border border-outline-variant p-6 bg-brand-clay/5 hover:border-brand-black hover:shadow-sm transition-all duration-200">
          <span className="font-geist-mono text-[10px] text-brand-warm-grey uppercase tracking-widest block mb-2">
            02 / PHILOSOPHY
          </span>
          <h3 className="text-lg font-bold text-brand-black mb-3">Clarity Over Hype</h3>
          <p className="text-brand-warm-grey text-sm leading-relaxed">
            The AI landscape is saturated with sensationalism and unnecessary buzzwords. We filter through the noise to explain the actual mechanics, practical use cases, and tangible impacts of breakthroughs in plain, simple terms.
          </p>
        </div>
      </section>

      <section className="border-t border-outline-variant pt-10 flex flex-col gap-6">
        <h2 className="text-xl font-bold tracking-tight text-brand-black uppercase">
          Our Core Pillars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-brand-black font-geist-mono">[ Simplified News ]</h4>
            <p className="text-xs text-brand-warm-grey leading-relaxed">
              Real-time feed translating complex model updates and research papers into clear, easy-to-read highlights.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-brand-black font-geist-mono">[ AI Fundamentals ]</h4>
            <p className="text-xs text-brand-warm-grey leading-relaxed">
              Curated lessons covering foundational elements like embeddings, tokens, and attention layers.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-brand-black font-geist-mono">[ Telemetry & Events ]</h4>
            <p className="text-xs text-brand-warm-grey leading-relaxed">
              Tracking key developmental milestones, model releases, and regulatory policies globally.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
