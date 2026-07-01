import { createClient } from '@supabase/supabase-js';
import { App } from '../src/components/App/App';
import type { Metadata } from 'next';

import { Database } from '@/types/database.types';

export const metadata: Metadata = {
  title: "State of AI - Complex Breakthroughs Explained Simply",
  description: "Aggregating and simplifying complex AI research, releases, and policy updates for developers and professionals.",
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient<Database>(supabaseUrl || '', supabaseServiceKey || '');

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
  const { data, error } = await supabase
    .from('bubble_state')
    .select('*')
    .eq('id', 1);

  if (error || !data || data.length === 0) {
    return {
      bubble_percentage: 68,
      status_direction: 'increasing' as const,
      short_explanation: 'AI spending is very high but short-term returns are not yet clear.',
      financial_highlights: []
    };
  }

  const state = data[0];
  return {
    bubble_percentage: state.bubble_percentage,
    status_direction: state.status_direction as 'increasing' | 'stable' | 'decreasing',
    short_explanation: state.short_explanation,
    financial_highlights: Array.isArray(state.financial_highlights)
      ? (state.financial_highlights as unknown as { label: string; simple_text: string }[])
      : [],
    updated_at: state.updated_at
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