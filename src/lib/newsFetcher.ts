export interface ParsedItem {
  title: string;
  link: string;
  description: string;
  source: string;
  pubDate?: string;
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
      const pubDateMatch = itemXml.match(/<pubDate[\s\S]*?>([\s\S]*?)<\/pubDate>/) ||
                           itemXml.match(/<dc:date[\s\S]*?>([\s\S]*?)<\/dc:date>/) ||
                           itemXml.match(/<published[\s\S]*?>([\s\S]*?)<\/published>/);

      const title = cleanCdata(titleMatch ? titleMatch[1] : '');
      const link = cleanCdata(linkMatch ? linkMatch[1] : '');
      const description = cleanCdata(descMatch ? descMatch[1] : '')
        .replace(/<[^>]*>?/gm, '')
        .trim();
      const pubDate = pubDateMatch ? cleanCdata(pubDateMatch[1]) : undefined;

      return { title, link, description, source: sourceName, pubDate };
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

const RSS_FEEDS = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
  { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml' },
  { name: 'The Rundown AI', url: 'https://www.rundown.ai/feed' },
  { name: 'Google Research', url: 'https://research.google/blog/rss/' },
  { name: 'Anthropic Engineering', url: 'https://raw.githubusercontent.com/conoro/anthropic-engineering-rss-feed/main/anthropic_engineering_rss.xml' }
];

export async function fetchAndCombineFeeds(): Promise<ParsedItem[]> {
  const feedPromises = RSS_FEEDS.map(async (feedConf) => {
    try {
      const xml = await fetchFeedXml(feedConf.url);
      return xml ? parseRss(xml, feedConf.name) : [];
    } catch (err) {
      console.error(`Error processing feed ${feedConf.name}:`, err);
      return [];
    }
  });

  const feeds = await Promise.all(feedPromises);
  const maxLen = Math.max(...feeds.map((f) => f.length), 0);

  return Array.from({ length: maxLen })
    .flatMap((_, i) =>
      feeds.map((feed) => feed[i]).filter((item): item is ParsedItem => !!item)
    );
}
