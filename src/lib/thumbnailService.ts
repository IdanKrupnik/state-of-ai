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
      systemInstruction: `You are an expert UI/UX illustrator specializing in retro editorial graphics. Your sole task is to generate a text-to-image prompt for a new article.

You must output ONLY the final text-to-image prompt. No explanation, no quotes, no conversation.

The output prompt must adhere strictly to this style and layout template:
A retro digital illustration in a clean, minimalist comic book style with a hand-drawn feel, replicating an editorial newspaper graphic.

Composition & Subject: A conceptual layout representing an AI article summary. The visual focus is on [INSERT VISUAL METAPHOR HERE] drawn with clean, bold black ink outlines and flat, offset-print color blocking. Abstract, curving vector data streams and digital nodes connect the elements to represent server data collection and discovery.

Color Palette & Texture: Limited and muted color palette consisting of deep black, dark navy blue, light blue shading, and stark white highlights. The background is a solid, warm off-white beige with a very subtle, fine paper grain texture. No gradients.

Typography & Layout: Clean layout optimized for an article thumbnail. In the top-left, clean black sans-serif text reads: "[INSERT ARTICLE TITLE HERE]". Below the headline, a solid black rectangular text box contains white or light blue text reading: "[INSERT KEY PHRASE HERE]". In the top-right corner, minimalist branding text reads: "STATE OF AI".

Instructions for replacing placeholders:
1. Replace [INSERT VISUAL METAPHOR HERE] with a description of a cute, slightly amusing visual metaphor that depicts the main entities, logos, or concepts and action of the article. For example, for an article about HP and OpenAI, depict a stylized HP logo and OpenAI logo shaking hands. For an article about vLLM and HF Jobs, depict a cute rocket launch with a single command button.
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
