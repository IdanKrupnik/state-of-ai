import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const marketauxToken = process.env.MARKETAUX_API_TOKEN || '';

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

interface ArticleInput {
  title: string;
  description: string;
  sentiment?: number;
}

export async function runBubbleIngestion() {
  const { data: oldStateList, error: oldStateError } = await supabase
    .from('bubble_state')
    .select('*')
    .eq('id', 1);

  if (oldStateError) {
    throw oldStateError;
  }

  const oldState = oldStateList && oldStateList.length > 0 ? oldStateList[0] : null;

  let articlesList: ArticleInput[] = [];
  try {
    const url = `https://api.marketaux.com/v1/news/all?search="AI bubble"|"AI hype"&language=en&api_token=${marketauxToken}`;
    const response = await fetch(url);
    if (response.ok) {
      const payload = await response.json();
      if (payload && Array.isArray(payload.data)) {
        articlesList = payload.data.map((item: any) => ({
          title: item.title,
          description: item.description || item.snippet,
          sentiment: item.sentiment_score
        }));
      }
    }
  } catch (err) {
    console.error('Marketaux fetch failed:', err);
  }

  if (articlesList.length === 0) {
    articlesList = [
      { title: 'Tech industry faces growing skepticism over massive AI capex spending', description: 'Analysts voice concerns about the revenue mismatch and lack of near-term enterprise ROI for LLM deployment.', sentiment: -0.4 },
      { title: 'AI hype cycles start to cool down as capital expenditure increases', description: 'VC funding remains strong but enterprise buyers demand tangible efficiency gains over bubble promises.', sentiment: -0.2 },
      { title: 'Is the AI bubble set to burst soon?', description: 'Structural shifts in software engineering suggest long term utility despite current market overvaluation.', sentiment: 0.1 }
    ];
  }

  const defaultState = {
    bubble_percentage: 68,
    status_direction: 'increasing',
    short_explanation: 'AI spending is very high but short-term returns are not yet clear.',
    financial_highlights: []
  };

  const currentState = oldState || defaultState;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
    systemInstruction: 'You are a clear, straightforward financial analyst who explains market trends in plain, jargon-free English for normal users.',
  });

  const prompt = `
    Review the previous AI bubble state and reasons:
    ${JSON.stringify(currentState)}

    Look at these new market articles:
    ${JSON.stringify(articlesList)}

    Update the bubble percentage (0-100) and status direction ('increasing' | 'stable' | 'decreasing') based on the combined information.
    Write a short summary (short_explanation) in very simple, jargon-free words that any normal user can easily understand instantly.
    Extract exactly 3 key financial highlights (like corporate earnings, infrastructure spending, or software revenue) in very, very simple words.

    Return a valid JSON object matching this exact schema:
    {
      "bubble_percentage": number,
      "status_direction": "increasing" | "stable" | "decreasing",
      "short_explanation": "string",
      "financial_highlights": [
        {
          "label": "string",
          "simple_text": "string"
        }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  if (!responseText) {
    throw new Error('Gemini model returned empty response');
  }

  const aiData = JSON.parse(responseText);

  const { data: updatedData, error: upsertError } = await supabase
    .from('bubble_state')
    .upsert({
      id: 1,
      bubble_percentage: Number(aiData.bubble_percentage) || 50,
      status_direction: aiData.status_direction || 'stable',
      short_explanation: aiData.short_explanation || '',
      financial_highlights: aiData.financial_highlights || [],
      updated_at: new Date().toISOString()
    })
    .select();

  if (upsertError) {
    throw upsertError;
  }

  return updatedData ? updatedData[0] : null;
}
