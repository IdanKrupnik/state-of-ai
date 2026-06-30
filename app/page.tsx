import { createClient } from '@supabase/supabase-js';

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
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2.5rem 1rem',
      maxWidth: '650px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      color: '#1a1a1a'
    }}>
      <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid #eaeaea', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
          State of AI
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>
          Complex AI breakdowns explained simply by marketing pros.
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {articles.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            No simplified articles found. Trigger the pipeline at <code>/api/cron</code> first!
          </p>
        ) : (
          articles.map((article: any) => (
            <article key={article.id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                <span style={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {article.company}
                </span>
                <span>
                  Hype: <strong>{article.hype_score}%</strong>
                </span>
              </div>

              <h2 style={{ fontSize: '1.35rem', margin: '0 0 0.75rem 0', lineHeight: 1.3, color: '#0f172a' }}>
                {article.simplified_title}
              </h2>

              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                {article.short_summary}
              </p>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.875rem' }}>
                <a href={article.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                  Read original technical source →
                </a>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}