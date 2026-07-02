import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const togetherApiKey = process.env.TOGETHER_API_KEY || '';

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

type Article = Database['public']['Tables']['articles']['Row'];

async function generateMetaphor(article: Article): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { temperature: 0.0 },
    systemInstruction: `You are an expert UI/UX illustrator specializing in strict graphic minimalism. Your sole task is to translate a long article into a single, dead-simple visual metaphor for a text-to-image AI. 

The image must be simple enough that a user can understand the core concept of the article within exactly 1 second of glancing at it on a mobile feed.

Strict rules for your output:
1. Output ONLY the final image prompt in English. No conversation, no introductory phrases, no explanations, and no quotes.
2. Focus on ONE central, recognizable object or basic geometric concept.
3. Completely avoid human faces or detailed bodies; prefer abstract silhouettes or iconic symbols.
4. Always enforce a flat 2D style.
5. Absolute ban on text, letters, slogans, complex textures, shadows, shading, realism, gradients, or blur.`,
  });

  const content = `Title: ${article.original_title}\nSummary: ${article.short_summary}`;
  const result = await model.generateContent(content);
  return result.response.text().trim();
}

async function generateFluxImage(prompt: string): Promise<Buffer> {
  const finalPrompt = `${prompt}, ultra-minimalist vector art, flat 2D design, simple iconic line art, solid shapes, sharp outlines, maximum 2 solid colors, textless, no shadows, no gradients, clean crisp solid white background.`;
  const response = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${togetherApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'black-forest-labs/FLUX.1-schnell',
      prompt: finalPrompt,
      width: 512,
      height: 512,
      steps: 4,
      n: 1,
      response_format: 'url',
    }),
  });
  if (!response.ok) {
    throw new Error(`Together API failed: ${response.statusText}`);
  }
  const data = await response.json();
  const imageUrl = data.data?.[0]?.url;
  if (!imageUrl) {
    throw new Error('No image URL returned from Together API');
  }
  const imgRes = await fetch(imageUrl, { headers: { 'User-Agent': 'state-of-ai/1.0' } });
  if (!imgRes.ok) {
    throw new Error(`Failed to fetch image data: ${imgRes.statusText}`);
  }
  return Buffer.from(await imgRes.arrayBuffer());
}

async function uploadAndGetUrl(articleId: string, buffer: Buffer): Promise<string> {
  const filename = `minimal-${articleId}-${Date.now()}.png`;
  const { error: uploadError } = await supabase.storage
    .from('article-thumbnails')
    .upload(filename, buffer, { contentType: 'image/png' });
  if (uploadError) {
    throw uploadError;
  }
  const { data } = supabase.storage.from('article-thumbnails').getPublicUrl(filename);
  if (!data.publicUrl) {
    throw new Error('Failed to retrieve public URL');
  }
  return data.publicUrl;
}

export async function processArticle(article: Article): Promise<void> {
  try {
    console.log(`Processing article ${article.id}: ${article.original_title}`);
    const metaphor = await generateMetaphor(article);
    const buffer = await generateFluxImage(metaphor);
    const publicUrl = await uploadAndGetUrl(article.id, buffer);
    const { error: updateError } = await supabase
      .from('articles')
      .update({ image_url: publicUrl })
      .eq('id', article.id);
    if (updateError) {
      throw updateError;
    }
    console.log(`Successfully generated thumbnail for article ${article.id}`);
  } catch (err) {
    console.error(`Failed to generate thumbnail for article ${article.id}:`, err);
  }
}

export async function runThumbnailCron(): Promise<void> {
  await supabase.storage.createBucket('article-thumbnails', { public: true }).catch(() => {});
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .is('image_url', null);
  if (error) {
    throw error;
  }
  if (!articles || articles.length === 0) {
    console.log('No unrefined articles found');
    return;
  }
  for (const article of articles) {
    await processArticle(article);
  }
}
