'use client';

import React, { useState, useMemo } from 'react';
import { SidebarSourceSwitcher } from '../ui/SidebarSourceSwitcher/SidebarSourceSwitcher';
import { SystemStatus } from '../ui/SystemStatus/SystemStatus';
import { Card } from '../ui/Card/Card';
import { InputField } from '../ui/InputField/InputField';
import { Button } from '../ui/Button/Button';
import { MetadataTag } from '../ui/MetadataTag/MetadataTag';

export interface Article {
  id: string | number;
  company: string;
  hype_score: number;
  simplified_title: string;
  short_summary: string;
  source_url: string;
  created_at?: string;
}

export interface FeedContainerProps {
  initialArticles: Article[];
}

export const FeedContainer: React.FC<FeedContainerProps> = ({ initialArticles = [] }) => {
  const [activeSourceId, setActiveSourceId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // 1. Get unique companies from articles to build source switcher dynamically
  const sourceItems = useMemo(() => {
    const companies = Array.from(new Set(initialArticles.map((a) => a.company.toLowerCase())));
    const items = [
      { id: 'all', label: 'All Sources', icon: '🌐' },
    ];
    
    companies.forEach((company) => {
      let icon = '📄';
      if (company.includes('supabase')) icon = '⚡';
      else if (company.includes('openai')) icon = '🤖';
      else if (company.includes('google')) icon = '🔍';
      else if (company.includes('anthropic')) icon = '🎨';
      else if (company.includes('meta')) icon = '♾️';
      
      items.push({
        id: company,
        label: company.charAt(0).toUpperCase() + company.slice(1),
        icon,
      });
    });
    
    return items;
  }, [initialArticles]);

  // 2. Filter articles based on active source and search query
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesSource = activeSourceId === 'all' || article.company.toLowerCase() === activeSourceId;
      const matchesSearch = 
        article.simplified_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.short_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.company.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSource && matchesSearch;
    });
  }, [initialArticles, activeSourceId, searchQuery]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-brand-offwhite">
      {/* Sidebar - Dark Theme */}
      <aside 
        data-testid="sidebar"
        className="w-64 bg-brand-black text-brand-offwhite/90 h-screen fixed top-0 left-0 flex flex-col justify-between border-r border-brand-offwhite/10 z-10"
      >
        <div className="flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-brand-offwhite/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-inter text-lg font-bold tracking-tight text-brand-offwhite">
                State of AI
              </span>
              <SystemStatus label="LIVE" isActive={true} className="text-brand-offwhite" />
            </div>
            <p className="text-[11px] text-brand-offwhite/50 leading-relaxed font-geist-mono">
              COMPLEX INSIGHTS EXPLAINED SIMPLY
            </p>
          </div>

          {/* Source Switcher */}
          <div className="py-4">
            <div className="px-6 pb-2 text-[10px] uppercase font-geist-mono tracking-widest text-brand-offwhite/40">
              Sources
            </div>
            <SidebarSourceSwitcher
              items={sourceItems}
              activeId={activeSourceId}
              onChange={setActiveSourceId}
            />
          </div>
        </div>

        {/* Sidebar Footer - Newsletter Signup */}
        <div className="p-6 border-t border-brand-offwhite/10 bg-brand-offwhite/[0.02]">
          {subscribed ? (
            <div className="text-xs text-brand-neon-green font-geist-mono">
              ✓ Subscribed successfully!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="text-[11px] font-geist-mono text-brand-offwhite/50 uppercase tracking-wider">
                Weekly Briefing
              </div>
              <InputField
                variant="bottom"
                type="email"
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-brand-offwhite placeholder-brand-offwhite/30 border-brand-offwhite/20 focus:border-brand-neon-green text-xs"
                required
                id="newsletter-email"
              />
              <Button type="submit" variant="secondary" className="text-xs py-1.5 border-brand-offwhite/30 text-brand-offwhite hover:bg-brand-offwhite/10">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex justify-center py-16 px-8 min-h-screen">
        <div className="w-full max-w-[42rem] flex flex-col gap-10">
          {/* Header */}
          <header className="flex flex-col gap-3 items-start">
            <MetadataTag>Market Analysis Feed</MetadataTag>
            <h1 className="text-3xl md:text-4xl font-bold font-inter tracking-tight text-brand-black leading-tight">
              State of AI Aggregator
            </h1>
            <p className="text-sm md:text-base text-brand-warm-grey font-inter max-w-[36rem] leading-relaxed">
              Complex AI releases and research breakthroughs simplified by marketing professionals for clear business value.
            </p>
          </header>

          {/* Search bar */}
          <div className="w-full">
            <InputField
              variant="bottom"
              placeholder="Search breakthroughs, companies, or insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-base"
              id="search-input"
            />
          </div>

          {/* Articles list */}
          <div className="flex flex-col gap-6" data-testid="articles-list">
            {filteredArticles.length === 0 ? (
              <div className="border-t border-brand-black/15 pt-8 text-center text-brand-warm-grey italic text-sm">
                No simplified articles found. Try another search or filter.
              </div>
            ) : (
              filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  title={article.simplified_title}
                  subtitle={
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-brand-black">{article.company}</span>
                      <span className="text-brand-warm-grey">|</span>
                      <span className="font-geist-mono">Hype Score: {article.hype_score}%</span>
                    </div>
                  }
                  footer={
                    <div className="flex justify-between items-center w-full">
                      <a
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold tracking-wider uppercase text-brand-black hover:text-brand-warm-grey transition-colors inline-flex items-center gap-1"
                      >
                        Read Original Source <span className="text-[10px]">→</span>
                      </a>
                    </div>
                  }
                >
                  <p className="text-brand-black/80 font-inter leading-relaxed">
                    {article.short_summary}
                  </p>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
