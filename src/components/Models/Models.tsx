import React from 'react';
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

export const Models: React.FC<ModelsProps> = ({ initialModels = [] }) => {
  const providers = ['OpenAI', 'Anthropic', 'Google'];

  const sortedByDate = [...initialModels].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  const newestIds = new Set(sortedByDate.slice(0, 3).map((m) => m.id));

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

      <div className="flex flex-col gap-10" data-testid="models-container">
        {providers.map((provider) => {
          const providerModels = initialModels.filter((m) => m.provider === provider);
          if (providerModels.length === 0) return null;

          return (
            <div key={provider} className="flex flex-col gap-3" data-testid={`provider-group-${provider.toLowerCase()}`}>
              <h3 className="font-geist-mono text-xs uppercase tracking-wider font-semibold text-brand-black border-b border-brand-black/15 pb-2">
                {provider}
              </h3>
              
              <div className="flex flex-col">
                {providerModels.map((model) => (
                  <div 
                    key={model.id} 
                    className="py-4 border-b border-brand-black/5 last:border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-brand-clay/5 px-2 -mx-2 transition-colors rounded-sm"
                    data-testid={`model-row-${model.id.replace('/', '-')}`}
                  >
                    <div className="flex flex-col gap-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-brand-black text-sm">{model.name}</span>
                        {newestIds.has(model.id) && (
                          <span className="px-1.5 py-0.5 text-[9px] font-geist-mono uppercase tracking-wider font-semibold border border-brand-black/25 text-brand-black rounded-sm scale-90 origin-left">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-brand-warm-grey text-xs italic">
                        {model.description || 'No description available.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-geist-mono text-brand-black/80 shrink-0">
                      <span className="px-2.5 py-1 bg-brand-clay/20 rounded-sm">
                        {formatContextLength(model.context_length)} ctx
                      </span>
                      <span className="px-2.5 py-1 bg-brand-clay/20 rounded-sm">
                        {formatPrice(model.prompt_token_price)} / {formatPrice(model.completion_token_price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
