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

async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database fetch error:', error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const articles = await getArticles();

  return (
    <App initialArticles={articles} />
  );
}