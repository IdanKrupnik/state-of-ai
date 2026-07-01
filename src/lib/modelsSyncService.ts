import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Database } from '@/types/database.types';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const geminiApiKey = process.env.GEMINI_API_KEY || '';

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

export interface OpenRouterModel {
  id: string;
  name: string;
  context_length: number;
  created: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

export function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'test_secret';
  return authHeader === `Bearer ${cronSecret}`;
}

export async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  if (!res.ok) {
    throw new Error(`OpenRouter API error: ${res.status}`);
  }
  const data = await res.json();
  const rawModels: OpenRouterModel[] = data.data || [];
  
  return rawModels.filter((m) =>
    m.id.startsWith('openai/') ||
    m.id.startsWith('anthropic/') ||
    m.id.startsWith('google/')
  );
}

function getModelProvider(id: string): string {
  if (id.startsWith('openai/')) return 'OpenAI';
  if (id.startsWith('anthropic/')) return 'Anthropic';
  if (id.startsWith('google/')) return 'Google';
  return 'Other';
}

async function generateModelDescription(model: OpenRouterModel): Promise<string> {
  const geminiModel = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
  });

  const prompt = `Based on this model data: ${JSON.stringify(model)}, write a brief, razor-sharp, and highly practical description in English (up to 12 words) explaining to developers what this model is best used for or its main edge. Do not use corporate fluff. Output ONLY the raw English sentence.`;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text().trim();
}

async function getExistingModelsMap() {
  const { data } = await supabase
    .from('models')
    .select('id, name, prompt_token_price, completion_token_price, context_length, description');
  
  return new Map(data?.map((m) => [m.id, m]) || []);
}

export async function syncModels(req: Request): Promise<NextResponse> {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const openRouterModels = await fetchOpenRouterModels();
    const existingModelsMap = await getExistingModelsMap();

    const upsertRows = [];

    let processedCount = 0;
    const maxProcessPerRun = 5;

    for (const m of openRouterModels) {
      const existing = existingModelsMap.get(m.id);
      const rawPromptPrice = m.pricing?.prompt ? Number(m.pricing.prompt) : 0;
      const rawCompletionPrice = m.pricing?.completion ? Number(m.pricing.completion) : 0;
      
      const promptMPrice = rawPromptPrice * 1000000;
      const completionMPrice = rawCompletionPrice * 1000000;
      
      const isChanged = !existing ||
        existing.name !== m.name ||
        existing.context_length !== m.context_length ||
        existing.prompt_token_price !== promptMPrice ||
        existing.completion_token_price !== completionMPrice;

      let description = existing?.description || null;

      if (isChanged) {
        if (processedCount < maxProcessPerRun) {
          try {
            description = await generateModelDescription(m);
            processedCount++;
          } catch (err) {
            console.error(`Gemini failed for ${m.id}:`, err);
          }
        } else {
          continue;
        }
      }

      upsertRows.push({
        id: m.id,
        name: m.name,
        provider: getModelProvider(m.id),
        context_length: m.context_length,
        prompt_token_price: promptMPrice,
        completion_token_price: completionMPrice,
        description,
        updated_at: new Date().toISOString(),
        created: m.created ? new Date(m.created * 1000).toISOString() : null
      });
    }

    if (upsertRows.length > 0) {
      const { error } = await supabase.from('models').upsert(upsertRows);
      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${upsertRows.length} models`
    });

  } catch (error: any) {
    console.error('Error in models sync workflow:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
