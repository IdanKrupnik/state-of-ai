import React, { useState, useEffect } from 'react';

interface SectionProps {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}

const LearnSection: React.FC<SectionProps> = ({ id, number, title, children }) => (
  <section id={id} className="flex flex-col gap-4 border-t border-outline-variant/30 pt-8" data-testid={`learn-section-${id}`}>
    <span className="font-geist-mono text-[10px] text-brand-warm-grey">{number}</span>
    <h2 className="text-xl font-bold text-brand-black">{title}</h2>
    {children}
  </section>
);

export const AIBasics: React.FC = () => {
  const [latency, setLatency] = useState(12.4);

  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(12.0 + Math.random() * 0.8);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-12 py-4" data-testid="ai-basics-section">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-geist-mono text-[10px] text-brand-warm-grey tracking-wider">
            LIVE_DOCUMENT // v4.0.2
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-black">
          AI Fundamentals
        </h1>
        <p className="text-brand-warm-grey text-base leading-relaxed max-w-prose">
          A foundational inquiry into the mechanisms, architectures, and deployment paradigms governing contemporary synthetic intelligence.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-10 items-start">
        <aside className="hidden md:flex flex-col gap-4 sticky top-24 font-geist-mono text-[10px] uppercase tracking-wider text-brand-warm-grey" data-testid="learn-toc">
          <span className="font-bold text-brand-black pb-2 border-b border-outline-variant/30">
            Navigation
          </span>
          <a href="#definition" className="hover:text-brand-black transition-colors">01 // Definition</a>
          <a href="#architecture" className="hover:text-brand-black transition-colors">02 // Architecture</a>
          <a href="#capabilities" className="hover:text-brand-black transition-colors">03 // Capabilities</a>
          <a href="#deployment" className="hover:text-brand-black transition-colors">04 // Deployment</a>
        </aside>

        <div className="flex flex-col gap-12">
          <LearnSection id="definition" number="01 // DEFINITION" title="What is Artificial Intelligence?">
            <div className="text-brand-warm-grey text-sm space-y-4 leading-relaxed max-w-prose">
              <p>
                Artificial Intelligence (AI) encompasses systems designed to perform tasks that typically require human cognition. Rather than static code, modern AI utilizes autonomous agents that adapt through experience.
              </p>
              <p>
                Machine Learning (ML) acts as the engine, allowing algorithms to parse vast datasets, identify patterns, and make high-probability decisions without explicit instruction.
              </p>
            </div>
          </LearnSection>

          <LearnSection id="architecture" number="02 // ARCHITECTURE" title="Neural Networks">
            <p className="text-brand-warm-grey text-sm leading-relaxed max-w-prose">
              At the core of deep learning are neural networks—computational structures loosely inspired by the biological connectivity of the human brain. These layers of "neurons" process information non-linearly, enabling the mapping of complex inputs to specific outputs.
            </p>
            <div className="bg-brand-clay/10 p-4 border-l-2 border-brand-black font-geist-mono text-[10px] text-brand-warm-grey">
              [ ARCH_TYPE: TRANSFORMER_MODEL_V4 ]
            </div>
          </LearnSection>

          <section className="w-full aspect-[21/9] bg-brand-clay/10 border border-outline-variant relative overflow-hidden group">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Conceptual datacenter topology"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCidcdwOGwwl6kuCqioATRKPTpUuTw3r8GhWiiY7O6gWyXFISugMvHy1ncZ6iykqFJOGOTOTT2jSFDSvjVX49Cf80wyqkKlRCXkNquTwbU3vyFBSMC1egTfiP3c4b6MvoFXFqi6b28FAALj4Pzs6ZvHQCzomGN4HSTdHkqnYSzZTjkb-mbhpk8bhSliCI4_XFJM1pctkLhSr53wGRw6mJCu6XLhCU9N2rJ_oUNxNZEWolHYe_9krodQMuJ7RDhRDrFwlQj94zR9VawT"
            />
            <div className="absolute bottom-3 left-3 bg-brand-black text-brand-offwhite text-[10px] font-geist-mono px-2.5 py-1">
              FIG_01: CONCEPTUAL DATACENTER TOPOLOGY
            </div>
          </section>

          <LearnSection id="capabilities" number="03 // CAPABILITIES" title="Large Language Models (LLMs)">
            <p className="text-brand-warm-grey text-sm leading-relaxed max-w-prose">
              LLMs represent the current frontier of natural language processing. By predicting the next token in a sequence, these models exhibit emergent properties such as logical reasoning, creative synthesis, and multi-step problem solving.
            </p>
            <div className="flex gap-2 font-geist-mono text-[10px] text-brand-warm-grey">
              <span className="px-2.5 py-1 bg-brand-clay/10 border border-outline-variant/30">[ PARAMETER_COUNT: 1.8T+ ]</span>
              <span className="px-2.5 py-1 bg-brand-clay/10 border border-outline-variant/30">[ TOKEN_WINDOW: 128K ]</span>
            </div>
          </LearnSection>

          <LearnSection id="deployment" number="04 // DEPLOYMENT" title="What is Inference?">
            <p className="text-brand-warm-grey text-sm leading-relaxed max-w-prose">
              While "Training" is the process of building a model's knowledge, "Inference" is the execution of that knowledge. It is the real-time "thinking" process where a trained model applies its learned patterns to new, unseen data to generate an output.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-4 border border-outline-variant hover:border-brand-black transition-colors">
                <span className="font-geist-mono text-[10px] text-brand-warm-grey block mb-1">MEAN LATENCY</span>
                <span className="font-geist-mono text-lg font-bold text-brand-black" data-testid="latency-value">
                  {latency.toFixed(1)}ms
                </span>
              </div>
              <div className="p-4 border border-outline-variant hover:border-brand-black transition-colors">
                <span className="font-geist-mono text-[10px] text-brand-warm-grey block mb-1">ACTIVE NODES</span>
                <span className="font-geist-mono text-lg font-bold text-brand-black">1,024</span>
              </div>
            </div>
          </LearnSection>
        </div>
      </div>
    </div>
  );
};
