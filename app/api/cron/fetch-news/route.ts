import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

const supabase = createClient<Database>(supabaseUrl || '', supabaseServiceKey || '');
const genAI = new GoogleGenerativeAI(geminiApiKey || '');

interface ParsedItem {
  title: string;
  link: string;
  description: string;
  source: string;
}

function parseRss(xml: string, sourceName: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const itemMatches = xml.match(/<item[\s\S]*?>([\s\S]*?)<\/item>/g);
  if (!itemMatches) return items;

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title[\s\S]*?>([\s\S]*?)<\/title>/);
    let title = titleMatch ? titleMatch[1] : '';

    const linkMatch = itemXml.match(/<link[\s\S]*?>([\s\S]*?)<\/link>/);
    let link = linkMatch ? linkMatch[1] : '';

    const descMatch = itemXml.match(/<description[\s\S]*?>([\s\S]*?)<\/description>/);
    let description = descMatch ? descMatch[1] : '';

    const cleanCdata = (str: string) => {
      if (str.startsWith('<![CDATA[')) {
        return str.substring(9, str.length - 3);
      }
      return str.trim();
    };

    title = cleanCdata(title);
    link = cleanCdata(link);
    description = cleanCdata(description);

    description = description.replace(/<[^>]*>?/gm, '').trim();

    if (title && link) {
      items.push({ title, link, description, source: sourceName });
    }
  }

  return items;
}

function detectCompany(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('openai') || t.includes('chatgpt')) return 'OpenAI';
  if (t.includes('google') || t.includes('deepmind') || t.includes('gemini')) return 'Google';
  if (t.includes('microsoft')) return 'Microsoft';
  if (t.includes('meta') || t.includes('llama')) return 'Meta';
  if (t.includes('anthropic') || t.includes('claude')) return 'Anthropic';
  if (t.includes('nvidia')) return 'Nvidia';
  if (t.includes('mistral')) return 'Mistral';
  if (t.includes('apple')) return 'Apple';
  return 'AI';
}

async function handleNewsIngestion(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'test_secret';

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseUrl || !supabaseServiceKey || !geminiApiKey) {
      return NextResponse.json(
        { error: 'Missing environment variables' },
        { status: 500 }
      );
    }

    let tcXml = '';
    try {
      const tcRes = await fetch('https://techcrunch.com/category/artificial-intelligence/feed/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        next: { revalidate: 0 }
      });
      if (tcRes.ok) {
        tcXml = await tcRes.text();
      }
    } catch (err) {
      console.error('TechCrunch fetch failed:', err);
    }

    let rundownXml = '';
    try {
      const rundownRes = await fetch('https://www.rundown.ai/feed', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        next: { revalidate: 0 }
      });
      if (rundownRes.ok) {
        rundownXml = await rundownRes.text();
      }
    } catch (err) {
      console.error('The Rundown AI fetch failed:', err);
    }

    const tcItems = tcXml ? parseRss(tcXml, 'TechCrunch') : [];
    const rundownItems = rundownXml ? parseRss(rundownXml, 'The Rundown AI') : [];

    const items: ParsedItem[] = [];
    const maxLen = Math.max(tcItems.length, rundownItems.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < tcItems.length) {
        items.push(tcItems[i]);
      }
      if (i < rundownItems.length) {
        items.push(rundownItems[i]);
      }
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch any articles from TechCrunch or The Rundown AI' },
        { status: 500 }
      );
    }

    const parsedLinks = items.map((item) => item.link);
    const { data: existingArticles, error: dbError } = await supabase
      .from('articles')
      .select('source_url')
      .in('source_url', parsedLinks);

    if (dbError) {
      throw dbError;
    }

    const existingUrlsSet = new Set(existingArticles?.map((a) => a.source_url) || []);
    const newArticles = items.filter((item) => !existingUrlsSet.has(item.link));

    if (newArticles.length === 0) {
      return NextResponse.json({ success: true, message: 'All articles are already ingested' });
    }

    const articlesToProcess = newArticles.slice(0, 3);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
      systemInstruction: 'You are an expert AI assistant who explains technology news in plain English. Your tone is simple, clear, engaging, and easy to read. Avoid generic salesman hype; instead, explain the specific news event and its direct impact using simple language.',
    });

    const processedArticles = [];

    for (const article of articlesToProcess) {
      try {
        const prompt = `
          Analyze this technical AI article.
          
          Article Title: "${article.title}"
          Article Description/Content: "${article.description}"
          
          Return a valid JSON object matching this exact schema:
          {
            "simplified_title": "A catchy, ultra-minimalist, simple title in English describing the news. Under 6 words.",
            "short_summary": "A very simple, easy-to-read 1-sentence explanation in English describing the specific news and its direct impact. Make it specific, avoiding generic filler or salesman jargon.",
            "hype_score": a calculated impact score between 1 and 100
          }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        if (!responseText) continue;

        const aiData = JSON.parse(responseText);

        processedArticles.push({
          original_title: article.title,
          simplified_title: aiData.simplified_title,
          short_summary: aiData.short_summary,
          hype_score: Number(aiData.hype_score) || 50,
          source_url: article.link,
          company: detectCompany(article.title),
          source: article.source
        });
      } catch (err) {
        console.error(`Failed to process article "${article.title}":`, err);
      }
    }

    if (processedArticles.length === 0) {
      return NextResponse.json({ success: true, message: 'No new articles were successfully processed' });
    }

    const { data: insertedData, error: insertError } = await supabase
      .from('articles')
      .insert(processedArticles)
      .select();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${processedArticles.length} new articles`,
      data: insertedData
    });

  } catch (error: any) {
    console.error('Error in news ingestion route:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return handleNewsIngestion(req);
}

export async function POST(req: Request) {
  return handleNewsIngestion(req);
}
