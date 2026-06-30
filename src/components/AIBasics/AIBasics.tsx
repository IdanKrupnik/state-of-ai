import React from 'react';

export const AIBasics: React.FC = () => {
  const concepts = [
    {
      id: 'neural-networks',
      title: 'Neural Networks',
      description: 'Layered nodes processing computational signals similar to biological synapses.',
      visual: (
        <div className="flex justify-between items-center h-12 px-4 bg-brand-clay/10 border border-outline-variant/30">
          <div className="w-3 h-3 bg-brand-black rounded-full" />
          <div className="h-[1px] flex-grow bg-brand-black/30 mx-2 border-t border-dashed" />
          <div className="w-3 h-3 bg-brand-black rounded-full" />
          <div className="h-[1px] flex-grow bg-brand-black/30 mx-2 border-t border-dashed" />
          <div className="w-3 h-3 bg-brand-black rounded-full" />
        </div>
      ),
    },
    {
      id: 'weights-biases',
      title: 'Weights & Biases',
      description: 'Numerical parameters adjusting node activation strength during model tuning.',
      visual: (
        <div className="flex flex-col gap-2 p-2 bg-brand-clay/10 border border-outline-variant/30 font-geist-mono text-[10px]">
          <div className="flex justify-between items-center">
            <span>WEIGHTS [W]</span>
            <span className="font-bold">0.824</span>
          </div>
          <div className="h-2 bg-brand-clay/35 w-full relative">
            <div className="h-full bg-brand-black w-[82.4%]" />
          </div>
        </div>
      ),
    },
    {
      id: 'cost-optimization',
      title: 'Cost & Optimization',
      description: 'Mathematical loss minimization algorithms ensuring target model calibration.',
      visual: (
        <div className="flex gap-1.5 items-end h-12 p-2 bg-brand-clay/10 border border-outline-variant/30">
          <div className="w-full bg-brand-black/20 h-[80%]" />
          <div className="w-full bg-brand-black/40 h-[60%]" />
          <div className="w-full bg-brand-black/60 h-[40%]" />
          <div className="w-full bg-brand-black h-[20%]" />
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-8 py-4" data-testid="ai-basics-section">
      <div className="border-b border-brand-black pb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-brand-black">
          AI Fundamentals Primer
        </h2>
        <p className="text-brand-warm-grey text-sm mt-1">
          A minimalist introduction to standard structural architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {concepts.map((concept) => (
          <div
            key={concept.id}
            className="border border-outline-variant p-5 flex flex-col gap-4 bg-brand-offwhite"
            data-testid={`concept-card-${concept.id}`}
          >
            <div>
              <h3 className="font-semibold text-[15px] text-brand-black">
                {concept.title}
              </h3>
              <p className="text-brand-warm-grey text-xs mt-1.5 leading-relaxed text-left">
                {concept.description}
              </p>
            </div>
            <div className="mt-auto pt-2">
              {concept.visual}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
