'use client';

import React, { useState, useEffect } from 'react';
import { TopNavBar } from '../TopNavBar/TopNavBar';
import { TelemetryTicker } from '../TelemetryTicker/TelemetryTicker';
import { CollapsibleFundamentals } from '../CollapsibleFundamentals/CollapsibleFundamentals';
import { SentimentPoll } from '../SentimentPoll/SentimentPoll';
import { LatencyMap } from '../LatencyMap/LatencyMap';
import { FeedHeader } from '../FeedHeader/FeedHeader';
import { FeedRow } from '../FeedRow/FeedRow';
import { Footer } from '../Footer/Footer';
import { TuningDrawer } from '../TuningDrawer/TuningDrawer';
import { AIBasics } from '../AIBasics/AIBasics';
import { Events } from '../Events/Events';

import { Tables } from '@/types/database.types';

export type Article = Tables<'articles'>;

export interface AppProps {
  initialArticles: Article[];
}

export const App: React.FC<AppProps> = ({ initialArticles = [] }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const parts = hash.split('/');
      const primaryTab = parts[0];
      const validTabs = ['feed', 'benchmarks', 'events', 'about', 'learn'];
      if (validTabs.includes(primaryTab)) {
        setActiveTab(primaryTab);
        
        const sectionId = parts[1];
        if (sectionId) {
          setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    handleHashChange();
    setIsMounted(true);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-black flex flex-col font-inter antialiased">
      <TopNavBar
        onTuneClick={() => setIsDrawerOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <TelemetryTicker />

      <main className="max-w-[72rem] w-full mx-auto px-4 py-8 flex-grow flex flex-col gap-10">
        {!isMounted ? (
          <div className="flex-grow flex items-center justify-center py-20" data-testid="app-loader">
            <div className="w-8 h-8 border-2 border-brand-black border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'feed' && (
              <>
                <CollapsibleFundamentals />
                <SentimentPoll />
                <LatencyMap />

                <section className="flex flex-col gap-6">
                  <FeedHeader
                    category="CURATION FEED_v4.2"
                    title="State of AI Intelligence"
                    description="High fidelity technical feed with matching metrics and real-time sub-layer reasoning telemetry."
                  />

                  <div className="flex flex-col" data-testid="articles-list">
                    {initialArticles.length === 0 ? (
                      <div className="border-t border-brand-black/15 pt-8 text-center text-brand-warm-grey italic text-sm">
                        No simplified articles found. Try another search or filter.
                      </div>
                    ) : (
                      initialArticles.map((article) => (
                        <FeedRow
                          key={article.id}
                          company={article.company}
                          title={article.simplified_title}
                          summary={article.short_summary}
                          sourceUrl={article.source_url}
                          timestamp={article.created_at ? new Date(article.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : '12:00 UTC'}
                        />
                      ))
                    )}
                  </div>
                </section>
              </>
            )}

            {activeTab === 'learn' && <AIBasics />}

            {activeTab === 'events' && <Events />}

            {(activeTab === 'benchmarks' || activeTab === 'about') && (
              <div className="border-t border-brand-black/15 pt-8 flex flex-col gap-4" data-testid={`placeholder-section-${activeTab}`}>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-brand-black uppercase">
                  {activeTab}
                </h2>
                <p className="text-brand-warm-grey text-sm">
                  This section is currently under active development. High-fidelity telemetry coming soon.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      <TuningDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};
