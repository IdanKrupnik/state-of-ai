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
          const providerModels = initialModels.filter((m) => m.provider === provider);
          if (providerModels.length === 0) return null;

          return (
            <div key={provider} className="flex flex-col gap-4" data-testid={`provider-group-${provider.toLowerCase()}`}>
              <h3 className="font-geist-mono text-xs uppercase tracking-wider font-semibold text-brand-black border-b border-brand-black/15 pb-2">
                {provider}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-brand-black text-sm">
                  <thead>
                    <tr className="border-b border-brand-black/10 text-xs font-semibold text-brand-warm-grey uppercase tracking-wider">
                      <th className="py-3 pr-4">Model Name</th>
                      <th className="py-3 px-4">Context</th>
                      <th className="py-3 px-4">Cost (Input / Output)</th>
                      <th className="py-3 pl-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-black/5">
                    {providerModels.map((model) => (
                      <tr key={model.id} className="hover:bg-brand-clay/5 transition-colors" data-testid={`model-row-${model.id.replace('/', '-')}`}>
                        <td className="py-4 pr-4 font-medium">{model.name}</td>
                        <td className="py-4 px-4 font-geist-mono text-xs">
                          {formatContextLength(model.context_length)}
                        </td>
                        <td className="py-4 px-4 font-geist-mono text-xs">
                          {formatPrice(model.prompt_token_price)} / {formatPrice(model.completion_token_price)}
                        </td>
                        <td className="py-4 pl-4 text-brand-warm-grey italic text-xs leading-relaxed max-w-md">
                          {model.description || 'No description available.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
