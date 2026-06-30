'use client';

import React, { useState, useMemo } from 'react';
import { TopNavBar } from '../TopNavBar/TopNavBar';
import { TelemetryTicker } from '../TelemetryTicker/TelemetryTicker';
import { CollapsibleFundamentals } from '../CollapsibleFundamentals/CollapsibleFundamentals';
import { SentimentPoll } from '../SentimentPoll/SentimentPoll';
import { LatencyMap } from '../LatencyMap/LatencyMap';
import { FeedHeader } from '../FeedHeader/FeedHeader';
import { InputField } from '../ui/InputField/InputField';
import { FeedRow } from '../FeedRow/FeedRow';
import { Footer } from '../Footer/Footer';
import { TuningDrawer } from '../TuningDrawer/TuningDrawer';

import { Tables } from '@/types/database.types';

export type Article = Tables<'articles'>;

export interface AppProps {
  initialArticles: Article[];
}

export const App: React.FC<AppProps> = ({ initialArticles = [] }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesSearch =
        article.simplified_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.short_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.company.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [initialArticles, searchQuery]);

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-black flex flex-col font-inter antialiased">
      <TopNavBar onTuneClick={() => setIsDrawerOpen(true)} />
      <TelemetryTicker />

      <main className="max-w-[42rem] w-full mx-auto px-4 py-8 flex-grow flex flex-col gap-10">
        <CollapsibleFundamentals />
        <SentimentPoll />
        <LatencyMap />

        <section className="flex flex-col gap-6">
          <FeedHeader
            category="CURATION FEED_v4.2"
            title="State of AI Intelligence"
            description="High fidelity technical feed with matching metrics and real-time sub-layer reasoning telemetry."
          />

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

          <div className="flex flex-col" data-testid="articles-list">
            {filteredArticles.length === 0 ? (
              <div className="border-t border-brand-black/15 pt-8 text-center text-brand-warm-grey italic text-sm">
                No simplified articles found. Try another search or filter.
              </div>
            ) : (
              filteredArticles.map((article) => (
                <FeedRow
                  key={article.id}
                  company={article.company}
                  hypeScore={article.hype_score}
                  title={article.simplified_title}
                  summary={article.short_summary}
                  sourceUrl={article.source_url}
                  timestamp={article.created_at ? new Date(article.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : '12:00 UTC'}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
      <TuningDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};
