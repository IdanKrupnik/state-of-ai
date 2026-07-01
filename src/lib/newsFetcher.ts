export interface ParsedItem {
  title: string;
  link: string;
  description: string;
  source: string;
}

export function parseRss(xml: string, sourceName: string): ParsedItem[] {
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

  return items.slice(0, 15);
}

export function detectCompany(title: string): string {
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

async function fetchFeedXml(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 }
    });
    if (res.ok) {
      return await res.text();
    }
  } catch (err) {
    console.error(`Fetch failed for URL: ${url}`, err);
  }
  return '';
}

export async function fetchAndCombineFeeds(): Promise<ParsedItem[]> {
  const [tcXml, openaiXml, hfXml, rundownXml] = await Promise.all([
    fetchFeedXml('https://techcrunch.com/category/artificial-intelligence/feed/'),
    fetchFeedXml('https://openai.com/news/rss.xml'),
    fetchFeedXml('https://huggingface.co/blog/feed.xml'),
    fetchFeedXml('https://www.rundown.ai/feed')
  ]);

  const tcItems = tcXml ? parseRss(tcXml, 'TechCrunch') : [];
  const openaiItems = openaiXml ? parseRss(openaiXml, 'OpenAI') : [];
  const hfItems = hfXml ? parseRss(hfXml, 'Hugging Face') : [];
  const rundownItems = rundownXml ? parseRss(rundownXml, 'The Rundown AI') : [];

  const items: ParsedItem[] = [];
  const maxLen = Math.max(tcItems.length, openaiItems.length, hfItems.length, rundownItems.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < tcItems.length) {
      items.push(tcItems[i]);
    }
    if (i < openaiItems.length) {
      items.push(openaiItems[i]);
    }
    if (i < hfItems.length) {
      items.push(hfItems[i]);
    }
    if (i < rundownItems.length) {
      items.push(rundownItems[i]);
    }
  }

  return items;
}
