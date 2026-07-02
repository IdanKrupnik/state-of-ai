import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const geminiApiKey = process.env.GEMINI_API_KEY || '';

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

type Article = Database['public']['Tables']['articles']['Row'];

async function generateMetaphor(article: Article): Promise<string> {
  const content = `Title: ${article.original_title}\nSummary: ${article.short_summary}`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: content,
    config: {
      temperature: 0.0,
      systemInstruction: `You are an expert UI/UX illustrator specializing in strict, extreme graphic sketch minimalism. Your sole task is to generate a text-to-image prompt for a new article.

You must output ONLY the final text-to-image prompt. No explanation, no quotes, no conversation.

The output prompt must adhere strictly to this style and layout template:
A hand-drawn pencil sketch illustration on a technical canvas background, replicating a clean, minimalist editorial newspaper graphic.

Composition & Subject: A conceptual layout representing an AI article summary. The visual focus is on [INSERT EXTREMELY MINIMALIST METAPHOR HERE] drawn with clean, simple pencil lines, graphite shading, and flat, offset-print color blocking. Absolutely no complex corporate logos that do not exist; DO NOT invent brand logos. Instead of complex brand logos, represent companies with simple, universally recognized generic symbols (e.g. a simple box monitor, a gear, a generic stylized letter, or two simple interlocking shapes).

Color Palette & Texture: Limited and muted color palette consisting of deep black, dark navy blue, light blue shading, and stark white highlights. The background is a solid, warm off-white beige with a very subtle, fine paper grain texture. No gradients.

Typography & Layout: Clean layout optimized for an article thumbnail. In the top-left, clean black sans-serif text reads: "[INSERT ARTICLE TITLE HERE]". Below the headline, a solid black rectangular text box contains white or light blue text reading: "[INSERT KEY PHRASE HERE]". In the top-right corner, minimalist branding text reads: "STATE OF AI".

Instructions for replacing placeholders:
1. Replace [INSERT EXTREMELY MINIMALIST METAPHOR HERE] with an extremely simple visual concept containing only one or two simple hand-drawn icons depicting the main entities or action. Keep it extremely clean, uncluttered, and simple.
2. Replace [INSERT ARTICLE TITLE HERE] with the simplified title of the article (maximum 6 words).
3. Replace [INSERT KEY PHRASE HERE] with a 2-4 word key phrase summarizing the topic of the article.`,
    },
  });
  if (!response.text) {
    throw new Error('No text returned from Gemini');
  }
  return response.text.trim();
}

async function generateImagenImage(prompt: string): Promise<Buffer> {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: '16:9',
      outputMimeType: 'image/png',
    },
  });
  const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
  if (!base64Image) {
    throw new Error('No image bytes returned from Imagen API');
  }
  return Buffer.from(base64Image, 'base64');
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
    const buffer = await generateImagenImage(metaphor);
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
