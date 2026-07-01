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
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('company', 'BUBBLE_INDEX_CACHE')
      .maybeSingle();

    if (!error && data && data.simplified_title) {
      return JSON.parse(data.simplified_title);
    }
  } catch (err) {
    console.error('Failed to fetch bubble index from Supabase:', err);
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'bubble-index-cache.json');
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (err) {
    console.error('Failed to read bubble index from local cache:', err);
  }

  return {
    bubblePercentage: 68,
    structuralShiftPercentage: 32,
    statusDirection: 'increasing',
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