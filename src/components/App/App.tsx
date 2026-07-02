'use client';

import React, { useState, useEffect } from 'react';
import { TopNavBar } from '../TopNavBar/TopNavBar';
import { TelemetryTicker } from '../TelemetryTicker/TelemetryTicker';

import { FeedHeader } from '../FeedHeader/FeedHeader';
import { FeedRow } from '../FeedRow/FeedRow';
import { Footer } from '../Footer/Footer';
import { AIBasics } from '../AIBasics/AIBasics';
import { Events } from '../Events/Events';
import { About } from '../About/About';
import { Pricing } from '../Pricing/Pricing';

import { Tables } from '@/types/database.types';

export type Article = Tables<'articles'>;

const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return '1 hour ago';
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

import { supabaseClient } from '../../lib/supabaseClient';
import { Models, ModelRow } from '../Models/Models';

export interface AppProps {
  initialArticles: Article[];
  initialTotalCount?: number;
  initialModels?: ModelRow[];
}

export const App: React.FC<AppProps> = ({ initialArticles = [], initialTotalCount = 0, initialModels = [] }) => {
  const [activeTab, setActiveTab] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialTotalCount ? initialArticles.length < initialTotalCount : initialArticles.length >= 5
  );

  const ITEMS_PER_PAGE = 5;

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const from = articles.length;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count, error } = await supabaseClient
      .from('articles')
      .select('*', { count: 'exact' })
      .neq('company', 'BUBBLE_INDEX_CACHE')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      const combined = [...articles, ...data];
      const uniqueArticles = Array.from(
        new Map(combined.map((art) => [art.id, art])).values()
      );
      setArticles(uniqueArticles);
      if (count !== null) {
        setHasMore(uniqueArticles.length < count);
      } else {
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const parts = hash.split('/');
      const primaryTab = parts[0];
      const validTabs = ['feed', 'models', 'events', 'about', 'learn', 'pricing'];
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
      } else {
        setActiveTab('feed');
      }
    };

    handleHashChange();
    setIsMounted(true);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-brand-black flex flex-col font-inter antialiased">
      <TopNavBar
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
                <section className="flex flex-col gap-6">
                  <FeedHeader
                    category="CURATION FEED_v4.2"
                    title="Latest AI News"
                    description="A simple, curated feed of the latest developments in artificial intelligence."
                  />

                  <div className="flex flex-col gap-6" data-testid="articles-list">
                    {articles.length === 0 ? (
                      <div className="border-t border-brand-black/15 pt-8 text-center text-brand-warm-grey italic text-sm">
                        No simplified articles found. Try another search or filter.
                      </div>
                    ) : (
                      articles.map((article) => (
                        <FeedRow
                          key={article.id}
                          company={article.company}
                          title={article.simplified_title}
                          summary={article.short_summary}
                          sourceUrl={article.source_url}
                          timestamp={formatRelativeTime(article.created_at)}
                          source={article.source}
                          imageUrl={article.image_url}
                        />
                      ))
                    )}
                  </div>

                  {hasMore ? (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={loadMore}
                        disabled={isLoading}
                        data-testid="load-more-btn"
                        className="px-6 py-2.5 font-geist-mono text-xs uppercase tracking-wider border border-brand-black bg-brand-clay/5 text-brand-black hover:bg-brand-black hover:text-brand-offwhite disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                      >
                        {isLoading ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  ) : (
                    articles.length > 0 && (
                      <div className="text-center mt-6 text-brand-warm-grey text-xs font-geist-mono uppercase tracking-wider" data-testid="no-more-items-message">
                        No more articles to load
                      </div>
                    )
                  )}
                </section>


              </>
            )}

            {activeTab === 'learn' && <AIBasics />}

            {activeTab === 'events' && <Events />}

            {activeTab === 'about' && <About />}

            {activeTab === 'pricing' && <Pricing />}

            {activeTab === 'models' && <Models initialModels={initialModels} />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};
