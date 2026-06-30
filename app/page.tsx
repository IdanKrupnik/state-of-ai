import { createClient } from '@supabase/supabase-js';
import { FeedContainer } from '../src/components/FeedContainer/FeedContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "State of AI - Complex Breakthroughs Explained Simply",
  description: "Aggregating and simplifying complex AI research, releases, and policy updates for developers and professionals.",
};

// 1. Initialize Supabase safely on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// 2. Database fetching logic (Runs securely on the backend)
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

// 3. The Server Component
export default async function HomePage() {
  const articles = await getArticles();

  return (
    <FeedContainer initialArticles={articles} />
  );
}