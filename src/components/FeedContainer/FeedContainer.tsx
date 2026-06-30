'use client';

import React, { useState, useMemo } from 'react';
import { SidebarSourceSwitcher } from '../ui/SidebarSourceSwitcher/SidebarSourceSwitcher';
import { SidebarHeader } from '../SidebarHeader/SidebarHeader';
import { SidebarNewsletter } from '../SidebarNewsletter/SidebarNewsletter';
import { FeedHeader } from '../FeedHeader/FeedHeader';
import { Card } from '../ui/Card/Card';
import { InputField } from '../ui/InputField/InputField';

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

  return (
    <div className="flex min-h-screen w-full bg-brand-offwhite">
      {/* Sidebar - Dark Theme */}
      <aside 
        data-testid="sidebar"
        className="w-64 bg-brand-black text-brand-offwhite/90 h-screen fixed top-0 left-0 flex flex-col justify-between border-r border-brand-offwhite/10 z-10"
      >
        <div className="flex flex-col">
          {/* Extracted Sidebar Header */}
          <SidebarHeader />

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

        {/* Extracted Sidebar Newsletter Signup */}
        <SidebarNewsletter />
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex justify-center py-16 px-8 min-h-screen">
        <div className="w-full max-w-[42rem] flex flex-col gap-10">
          {/* Extracted Feed Header */}
          <FeedHeader 
            category="Market Analysis Feed"
            title="State of AI Aggregator"
            description="Complex AI releases and research breakthroughs simplified by marketing professionals for clear business value."
          />

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
