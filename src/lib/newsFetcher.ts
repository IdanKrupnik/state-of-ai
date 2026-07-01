export interface ParsedItem {
  title: string;
  link: string;
  description: string;
  source: string;
}

export function parseRss(xml: string, sourceName: string): ParsedItem[] {
  const itemMatches = xml.match(/<item[\s\S]*?>([\s\S]*?)<\/item>/g) || [];
  const cleanCdata = (str: string) =>
    str.startsWith('<![CDATA[') ? str.substring(9, str.length - 3) : str.trim();

  return itemMatches
    .map((itemXml) => {
      const titleMatch = itemXml.match(/<title[\s\S]*?>([\s\S]*?)<\/title>/);
      const linkMatch = itemXml.match(/<link[\s\S]*?>([\s\S]*?)<\/link>/);
      const descMatch = itemXml.match(/<description[\s\S]*?>([\s\S]*?)<\/description>/);

      const title = cleanCdata(titleMatch ? titleMatch[1] : '');
      const link = cleanCdata(linkMatch ? linkMatch[1] : '');
      const description = cleanCdata(descMatch ? descMatch[1] : '')
        .replace(/<[^>]*>?/gm, '')
        .trim();

      return { title, link, description, source: sourceName };
    })
    .filter((item) => item.title && item.link)
    .slice(0, 15);
}

export function detectCompany(title: string): string {
  const t = title.toLowerCase();
  const rules = [
    { key: 'openai', label: 'OpenAI' },
    { key: 'chatgpt', label: 'OpenAI' },
    { key: 'google', label: 'Google' },
    { key: 'deepmind', label: 'Google' },
    { key: 'gemini', label: 'Google' },
    { key: 'microsoft', label: 'Microsoft' },
    { key: 'meta', label: 'Meta' },
    { key: 'llama', label: 'Meta' },
    { key: 'anthropic', label: 'Anthropic' },
    { key: 'claude', label: 'Anthropic' },
    { key: 'nvidia', label: 'Nvidia' },
    { key: 'mistral', label: 'Mistral' },
    { key: 'apple', label: 'Apple' }
  ];
  return rules.find((rule) => t.includes(rule.key))?.label || 'AI';
}

async function fetchFeedXml(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 }
    });
    return res.ok ? await res.text() : '';
  } catch (err) {
    console.error(`Fetch failed for URL: ${url}`, err);
    return '';
  }
}

export async function fetchAndCombineFeeds(): Promise<ParsedItem[]> {
  const [tcXml, openaiXml, hfXml, rundownXml] = await Promise.all([
    fetchFeedXml('https://techcrunch.com/category/artificial-intelligence/feed/'),
    fetchFeedXml('https://openai.com/news/rss.xml'),
    fetchFeedXml('https://huggingface.co/blog/feed.xml'),
    fetchFeedXml('https://www.rundown.ai/feed')
  ]);

  const feeds = [
    tcXml ? parseRss(tcXml, 'TechCrunch') : [],
    openaiXml ? parseRss(openaiXml, 'OpenAI') : [],
    hfXml ? parseRss(hfXml, 'Hugging Face') : [],
    rundownXml ? parseRss(rundownXml, 'The Rundown AI') : []
  ];

  const maxLen = Math.max(...feeds.map((f) => f.length));

  return Array.from({ length: maxLen })
    .flatMap((_, i) =>
      feeds.map((feed) => feed[i]).filter((item): item is ParsedItem => !!item)
    );
}
