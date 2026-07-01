import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

async function run() {
  const tcRes = await fetch('https://techcrunch.com/category/artificial-intelligence/feed/');
  const tcXml = await tcRes.text();
  const tcItems = parseRss(tcXml, 'TechCrunch');

  const rundownRes = await fetch('https://www.rundown.ai/feed');
  const rundownXml = await rundownRes.text();
  const rundownItems = parseRss(rundownXml, 'The Rundown AI');

  const items = [...tcItems, ...rundownItems];
  console.log('Total parsed items:', items.length);

  const parsedLinks = items.map((item) => item.link);
  const { data: existingArticles, error: dbError } = await supabase
    .from('articles')
    .select('source_url')
    .in('source_url', parsedLinks);

  if (dbError) {
    console.error('Database query error:', dbError);
    return;
  }

  console.log('Existing articles returned from DB:', existingArticles?.length);
  const existingUrlsSet = new Set(existingArticles?.map((a) => a.source_url) || []);
  const newArticles = items.filter((item) => !existingUrlsSet.has(item.link));
  console.log('New articles remaining after filtering:', newArticles.length);
  if (newArticles.length > 0) {
    console.log('First new article link:', newArticles[0].link);
  }
}

run();
