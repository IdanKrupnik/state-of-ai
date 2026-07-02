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
      systemInstruction: `You are an expert artist and illustrator specializing in strict, extreme editorial sketch minimalism. Your sole task is to generate a text-to-image prompt for a new article.

You must output ONLY the final text-to-image prompt. No explanation, no quotes, no conversation.

The output prompt must adhere strictly to this style and layout template:
A hand-drawn pencil sketch by a professional editorial artist on a clean, technical canvas background, replicating an extremely minimalist, slightly amusing newspaper drawing.

Composition & Subject: The visual focus is on a single, extremely simple, cute, and slightly amusing visual metaphor representing the article. The metaphor must be drawn with a few clean, simple pencil outlines and very light graphite shading. Keep the illustration extremely simple and clean, using only a single cute character, object, or interaction to convey the general idea at a glance.
- If the article is about a partnership between two companies, draw a simple, cute partnership symbol (like a handshake, or a bridge) with the actual company names (e.g. "HP" and "OpenAI") neatly handwritten next to their respective sides. Do not draw complex brand logos; use simple handwritten text labels for the company names.
- If the article is about a specific AI model, system, or algorithm (e.g. "DiScoFormer"), draw a simple, cute robot character performing a multi-task metaphor (like juggling different geometric shapes, or wearing multiple hats to represent versatility) with the model's actual name (e.g. "DiScoFormer") neatly handwritten next to it.
- If the article is about a new app or device, draw a minimalist generic phone outline with a simple app icon inside it.
- Absolutely no other text, no cluttered backgrounds, and no complex decorations.

Color Palette & Texture: Limited color palette consisting of deep black, dark navy blue, light blue shading, and stark white highlights. The background is a solid, warm off-white beige with a very subtle, fine paper grain texture. No gradients.`,
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
