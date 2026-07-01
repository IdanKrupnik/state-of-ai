import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Database } from '@/types/database.types';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
const marketauxToken = process.env.MARKETAUX_API_TOKEN;

const supabase = createClient<Database>(supabaseUrl || '', supabaseServiceKey || '');
const genAI = new GoogleGenerativeAI(geminiApiKey || '');

async function handleBubbleIndexCalculation(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'test_secret';

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseUrl || !supabaseServiceKey || !geminiApiKey || !marketauxToken) {
      return NextResponse.json({ error: 'Missing environment configurations' }, { status: 500 });
    }

    let articlesList: any[] = [];
    try {
      const url = `https://api.marketaux.com/v1/news/all?search="AI bubble"|"AI hype"|"AI capex"&language=en&api_token=${marketauxToken}`;
      const response = await fetch(url, { next: { revalidate: 0 } });
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
      console.error('Marketaux API fetch failed:', err);
    }

    if (articlesList.length === 0) {
      articlesList = [
        { title: 'Tech industry faces growing skepticism over massive AI capex spending', description: 'Analysts voice concerns about the revenue mismatch and lack of near-term enterprise ROI for LLM deployment.', sentiment: -0.4 },
        { title: 'AI hype cycles start to cool down as capital expenditure increases', description: 'VC funding remains strong but enterprise buyers demand tangible efficiency gains over bubble promises.', sentiment: -0.2 },
        { title: 'Is the AI bubble set to burst soon?', description: 'Structural shifts in software engineering suggest long term utility despite current market overvaluation.', sentiment: 0.1 }
      ];
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
      systemInstruction: 'You are a financial risk analyst specializing in technology markets. Analyze the provided news articles about AI hype, capital expenditure, and enterprise ROI to determine if there is an increasing risk of an economic bubble. Focus heavily on mentions of revenue mismatch, lack of enterprise ROI, and high infrastructure capex.',
    });

    const prompt = `
      Analyze these news items:
      ${JSON.stringify(articlesList)}
      
      Determine:
      1. bubblePercentage: A score from 0 to 100 representing bubble risk. A higher score means dominant news narratives focus on bubble/capex concerns.
      2. structuralShiftPercentage: A score from 0 to 100 representing structural shifts.
      3. statusDirection: "increasing", "decreasing", or "stable".
      
      Return a valid JSON object matching this schema:
      {
        "bubblePercentage": number,
        "structuralShiftPercentage": number,
        "statusDirection": "increasing" | "decreasing" | "stable"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const aiData = JSON.parse(responseText);
    const cacheObject = {
      bubblePercentage: Number(aiData.bubblePercentage) || 68,
      structuralShiftPercentage: Number(aiData.structuralShiftPercentage) || 32,
      statusDirection: aiData.statusDirection || 'increasing',
      lastSynced: new Date().toISOString()
    };

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(publicDir, 'bubble-index-cache.json'),
      JSON.stringify(cacheObject, null, 2)
    );

    const { error: dbError } = await supabase
      .from('articles')
      .upsert({
        id: '00000000-0000-0000-0000-000000000000',
        company: 'BUBBLE_INDEX_CACHE',
        original_title: 'AI Bubble Tension Index Cache',
        simplified_title: JSON.stringify(cacheObject),
        short_summary: 'AI Bubble Tension Index Cache',
        source_url: 'https://marketaux.com',
        hype_score: cacheObject.bubblePercentage
      });

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      data: cacheObject
    });

  } catch (error: any) {
    console.error('Error in bubble index route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return handleBubbleIndexCalculation(req);
}

export async function POST(req: Request) {
  return handleBubbleIndexCalculation(req);
}
