import React, { useState } from 'react';
import { Tables } from '@/types/database.types';

export type ModelRow = Tables<'models'>;

export interface ModelsProps {
  initialModels: ModelRow[];
}

const formatContextLength = (val: number | null): string => {
  if (val === null) return '-';
  if (val >= 1000000) return `${(val / 1000000).toFixed(0)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
  return val.toString();
};

const formatPrice = (val: number | null): string => {
  if (val === null) return '-';
  if (val === 0) return 'Free';
  return `$${val.toFixed(2)}`;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const Models: React.FC<ModelsProps> = ({ initialModels = [] }) => {
  const providers = ['OpenAI', 'Anthropic', 'Google'];

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    OpenAI: true,
    Anthropic: true,
    Google: true
  });

  const toggleExpanded = (provider: string) => {
    setExpanded((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const newestIds = new Set(
    providers.flatMap((p) => {
      const pModels = initialModels.filter((m) => m.provider === p);
      if (pModels.length === 0) return [];
      const maxDate = Math.max(...pModels.map((m) => m.created ? new Date(m.created).getTime() : 0));
      return pModels.filter((m) => (m.created ? new Date(m.created).getTime() : 0) === maxDate).map((m) => m.id);
    })
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="border-t border-brand-black/15 pt-8 flex flex-col gap-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-brand-black uppercase font-geist-mono">
          Model Directory
        </h2>
        <p className="text-brand-warm-grey text-sm max-w-xl">
          A minimalist catalog of current LLM models, grouped by provider. Pricing is shown per million tokens.
        </p>
      </div>

      <div className="flex flex-col gap-12" data-testid="models-container">
        {providers.map((provider) => {
          const providerModels = initialModels
            .filter((m) => m.provider === provider)
            .sort((a, b) => {
              const aTime = a.created ? new Date(a.created).getTime() : 0;
              const bTime = b.created ? new Date(b.created).getTime() : 0;
              return bTime - aTime;
            });
          if (providerModels.length === 0) return null;

          const isExpanded = expanded[provider];

          return (
            <div key={provider} className="flex flex-col gap-5" data-testid={`provider-group-${provider.toLowerCase()}`}>
              <button
                onClick={() => toggleExpanded(provider)}
                className="w-full flex items-center justify-between font-geist-mono text-xs uppercase tracking-wider font-semibold text-brand-black border-b border-brand-black/15 pb-2 hover:text-brand-warm-grey transition-colors select-none focus:outline-none cursor-pointer"
                data-testid={`provider-toggle-${provider.toLowerCase()}`}
              >
                <span>{provider}</span>
                <svg 
                  className={`w-3 h-3 text-brand-black transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid={`provider-grid-${provider.toLowerCase()}`}>
                  {providerModels.map((model) => {
                    const isNew = newestIds.has(model.id);
                    return (
                      <div 
                        key={model.id} 
                        className={`relative border rounded-lg p-5 flex flex-col justify-between gap-4 transition-all duration-300 ${
                          isNew 
                            ? 'border-brand-black bg-white shadow-md ring-1 ring-brand-black/5' 
                            : 'border-brand-black/10 bg-white/40 hover:border-brand-black/25 hover:bg-white/60'
                        }`}
                        data-testid={`model-row-${model.id.replace('/', '-')}`}
                      >
                        {isNew && (
                          <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[9px] font-geist-mono uppercase tracking-widest font-extrabold bg-brand-black text-white rounded-sm shadow-sm">
                            New Model
                          </span>
                        )}

                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-brand-black text-sm block leading-tight">{model.name}</span>
                          {model.created && (
                            <span className="text-[10px] text-brand-warm-grey font-medium">
                              Released: {formatDate(model.created)}
                            </span>
                          )}
                          <p className="text-brand-warm-grey text-xs italic leading-relaxed">
                            {model.description || 'No description available.'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-geist-mono text-brand-black/80 mt-auto">
                          <span className="px-2 py-0.5 bg-brand-clay/20 rounded-sm">
                            {formatContextLength(model.context_length)} ctx
                          </span>
                          <span className="px-2 py-0.5 bg-brand-clay/20 rounded-sm">
                            {formatPrice(model.prompt_token_price)} / {formatPrice(model.completion_token_price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
