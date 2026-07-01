import { createClient } from '@supabase/supabase-js';
import { App } from '../src/components/App/App';
import type { Metadata } from 'next';

import { Database } from '@/types/database.types';

export const metadata: Metadata = {
  title: "State of AI - Complex Breakthroughs Explained Simply",
  description: "Aggregating and simplifying complex AI research, releases, and policy updates for developers and professionals.",
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '');

import fs from 'fs';
import path from 'path';

async function getArticles() {
  const { data, count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .neq('company', 'BUBBLE_INDEX_CACHE')
    .order('created_at', { ascending: false })
    .range(0, 4);

  if (error) {
    console.error('Database fetch error:', error);
    return { articles: [], totalCount: 0 };
  }
  return { articles: data || [], totalCount: count || 0 };
}

async function getBubbleIndexData() {
  const token = process.env.MARKETAUX_API_TOKEN;
  if (!token) {
    return {
      bubblePercentage: 68,
      structuralShiftPercentage: 32,
      statusDirection: 'increasing',
      lastSynced: new Date().toISOString()
    };
  }

  let articlesList: any[] = [];
  try {
    const url = `https://api.marketaux.com/v1/news/all?search="AI bubble"|"AI hype"&language=en&api_token=${token}`;
    const response = await fetch(url, { next: { revalidate: 21600 } });
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
    console.error('Failed to fetch from Marketaux in server component:', err);
  }

  if (articlesList.length === 0) {
    articlesList = [
      { title: 'Tech industry faces growing skepticism over massive AI capex spending', description: 'Analysts voice concerns about the revenue mismatch and lack of near-term enterprise ROI for LLM deployment.', sentiment: -0.4 },
      { title: 'AI hype cycles start to cool down as capital expenditure increases', description: 'VC funding remains strong but enterprise buyers demand tangible efficiency gains over bubble promises.', sentiment: -0.2 },
      { title: 'Is the AI bubble set to burst soon?', description: 'Structural shifts in software engineering suggest long term utility despite current market overvaluation.', sentiment: 0.1 }
    ];
  }

  let totalWeight = 0;
  let weightedBubbleScore = 0;

  for (const article of articlesList) {
    const text = `${article.title} ${article.description || ''}`.toLowerCase();
    let weight = 1.0;
    
    if (text.includes('revenue mismatch') || text.includes('lack of enterprise roi') || text.includes('capital expenditure fatigue') || text.includes('unsustainable capital expenditure') || text.includes('capex')) {
      weight = 2.5;
    }

    const sentimentRisk = ((1.0 - (article.sentiment ?? 0)) / 2.0) * 100;
    
    weightedBubbleScore += sentimentRisk * weight;
    totalWeight += weight;
  }

  const bubblePercentage = Math.round(weightedBubbleScore / (totalWeight || 1));
  const structuralShiftPercentage = Math.max(10, 100 - bubblePercentage);
  const statusDirection = bubblePercentage > 60 ? 'increasing' : bubblePercentage < 40 ? 'decreasing' : 'stable';

  return {
    bubblePercentage,
    structuralShiftPercentage,
    statusDirection,
    lastSynced: new Date().toISOString()
  };
}

export default async function HomePage() {
  const { articles, totalCount } = await getArticles();
  const bubbleIndexData = await getBubbleIndexData();

  return (
    <App 
      initialArticles={articles} 
      initialTotalCount={totalCount} 
      bubbleIndexData={bubbleIndexData} 
    />
  );
}