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
}

function parseRss(xml: string): ParsedItem[] {
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
      items.push({ title, link, description });
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

    let xmlText = '';
    try {
      const tcRes = await fetch('https://techcrunch.com/category/artificial-intelligence/feed/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        next: { revalidate: 0 }
      });
      if (tcRes.ok) {
        xmlText = await tcRes.text();
      }
    } catch (err) {
      console.error('TechCrunch fetch failed:', err);
    }

    if (!xmlText) {
      try {
        const vbRes = await fetch('https://venturebeat.com/category/ai/feed/', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          next: { revalidate: 0 }
        });
        if (vbRes.ok) {
          xmlText = await vbRes.text();
        }
      } catch (err) {
        console.error('VentureBeat fetch failed:', err);
      }
    }

    if (!xmlText) {
      return NextResponse.json(
        { error: 'Failed to fetch any AI RSS feed' },
        { status: 500 }
      );
    }

    const items = parseRss(xmlText);
    if (items.length === 0) {
      return NextResponse.json({ success: true, message: 'No articles found in feed' });
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
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
      systemInstruction: 'אתה עוזר בינה מלאכותית מומחה שמנתח מאמרי טכנולוגיה ומציג אותם כמו איש שיווק כריזמטי שמסביר פשוט ובגובה העיניים לכולם. עליך לכתוב בעברית ברורה, מושכת ומלהיבה.',
    });

    const processedArticles = [];

    for (const article of articlesToProcess) {
      try {
        const prompt = `
          Analyze this technical AI article and rewrite it in Hebrew matching your persona.
          
          Article Title: "${article.title}"
          Article Description/Content: "${article.description}"
          
          Return a valid JSON object matching this exact schema:
          {
            "simplified_title": "Highly catchy, simplified, LinkedIn-influencer-style marketing headline in Hebrew.",
            "short_summary": "A 2-sentence explanation in Hebrew of what the news is and why it matters, using clear, exciting words that anyone can understand immediately.",
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
          company: detectCompany(article.title)
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
