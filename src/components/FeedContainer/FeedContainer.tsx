'use client';

import React, { useState, useMemo } from 'react';
import { SidebarNewsletter } from '../SidebarNewsletter/SidebarNewsletter';
import { FeedHeader } from '../FeedHeader/FeedHeader';
import { SystemStatus } from '../ui/SystemStatus/SystemStatus';
import { InputField } from '../ui/InputField/InputField';
import { Button } from '../ui/Button/Button';
import { FeedRow } from '../FeedRow/FeedRow';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('algorithm');
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
      <header className="fixed top-0 w-full z-50 bg-brand-offwhite border-b border-outline-variant">
        <div className="max-w-[42rem] mx-auto flex justify-between items-center h-16 px-4">
          <div className="text-xl font-bold tracking-tighter text-brand-black">
            STATE OF AI
          </div>
          <nav className="hidden md:flex gap-8 text-[14px]">
            <a className="font-semibold text-brand-black border-b-2 border-brand-black pb-1" href="#">Research</a>
            <a className="text-brand-warm-grey hover:text-brand-black transition-colors" href="#">Signals</a>
            <a className="text-brand-warm-grey hover:text-brand-black transition-colors" href="#">Archive</a>
            <a className="text-brand-warm-grey hover:text-brand-black transition-colors" href="#">About</a>
          </nav>
          <Button
            variant="primary"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 text-xs py-1.5 px-3 uppercase tracking-wider"
          >
            <span>Tune Filter</span>
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </Button>
        </div>
      </header>

      <div className="mt-16 w-full bg-brand-clay/30 border-b border-outline-variant py-2.5 overflow-hidden whitespace-nowrap">
        <div className="max-w-[42rem] mx-auto px-4 flex justify-between items-center text-[11px] font-geist-mono text-brand-warm-grey uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <SystemStatus label="Pipeline Active" isActive={true} />
            <span className="text-[10px] text-brand-warm-grey/60">(Scanned 4m ago)</span>
          </div>
          <div className="hidden md:flex gap-6">
            <div>Best Model: <span className="text-brand-black font-semibold">Claude 3.5 Sonnet</span></div>
            <div>Market Index: <span className="text-brand-black font-semibold">64.2%</span></div>
            <div>Latest Block: <span className="text-brand-black font-semibold">#A1-9982</span></div>
          </div>
        </div>
      </div>

      <main className="max-w-[42rem] w-full mx-auto px-4 py-8 flex-grow flex flex-col gap-10">
        <section>
          <details className="group border border-outline-variant bg-brand-clay/20">
            <summary className="flex justify-between items-center p-4 cursor-pointer list-none select-none font-geist-mono text-[12px] font-bold text-brand-black">
              <span>[ ? ] NEW TO AI? CLICK TO UNWRAP</span>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="px-4 pb-6 text-sm text-brand-warm-grey leading-relaxed space-y-4">
              <p>Artificial Intelligence is not a monolithic entity but a convergence of probabilistic modeling and compute. This dashboard provides real-time telemetry on model weights, bias variance, and architectural shifts across the ecosystem.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-brand-offwhite border border-outline-variant">
                  <span className="block font-geist-mono text-[10px] text-brand-warm-grey mb-1 uppercase">Foundation</span>
                  <span className="text-sm font-semibold text-brand-black">Transformers</span>
                </div>
                <div className="p-3 bg-brand-offwhite border border-outline-variant">
                  <span className="block font-geist-mono text-[10px] text-brand-warm-grey mb-1 uppercase">Methodology</span>
                  <span className="text-sm font-semibold text-brand-black">Diffusion</span>
                </div>
              </div>
            </div>
          </details>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-geist-mono text-[11px] text-brand-warm-grey uppercase tracking-widest">// CURRENT SENTIMENT INDEX</h2>
          <div className="border-t border-brand-black pt-4">
            <h3 className="text-lg font-bold text-brand-black mb-6">Native Context vs. RAG?</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between font-geist-mono text-[11px] mb-2 uppercase text-brand-black">
                  <span>Native Context (1M+ Tokens)</span>
                  <span className="font-bold">72%</span>
                </div>
                <div className="h-4 bg-brand-clay/40 border border-outline-variant">
                  <div className="h-full bg-brand-black" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-geist-mono text-[11px] mb-2 uppercase text-brand-black">
                  <span>RAG (Retrieval Augmented)</span>
                  <span className="font-bold">28%</span>
                </div>
                <div className="h-4 bg-brand-clay/40 border border-outline-variant">
                  <div className="h-full bg-brand-warm-grey" style={{ width: '28%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="aspect-[21/9] bg-brand-clay/20 border border-outline-variant overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute bottom-4 left-4 z-10">
              <span className="bg-brand-black text-brand-offwhite font-geist-mono text-[10px] px-2 py-1 uppercase tracking-wider">REAL-TIME LATENCY MAPPING</span>
            </div>
            <div className="flex items-center gap-8 font-geist-mono text-xs text-brand-warm-grey">
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-neon-green"></span>US-EAST: 12ms</div>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-neon-green"></span>EU-WEST: 45ms</div>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-warm-grey animate-pulse"></span>AP-SOUTH: 180ms</div>
            </div>
          </div>
        </section>

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

      <footer className="w-full py-8 bg-brand-clay/10 border-t border-outline-variant">
        <div className="max-w-[42rem] mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-6 text-[11px] font-geist-mono text-brand-warm-grey">
          <div className="tracking-tighter uppercase font-bold text-brand-black">
            © 2026 STATE OF AI. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 uppercase">
            <a className="hover:text-brand-black underline transition-colors" href="#">Privacy</a>
            <a className="hover:text-brand-black underline transition-colors" href="#">Terms</a>
            <a className="hover:text-brand-black underline transition-colors" href="#">API</a>
            <a className="hover:text-brand-black underline transition-colors" href="#">Status</a>
          </div>
        </div>
      </footer>

      <div
        className={`fixed right-0 top-0 h-screen w-80 z-[60] bg-brand-black border-l border-brand-offwhite/10 flex flex-col justify-between p-6 text-brand-offwhite/70 transition-transform duration-300 font-geist-mono text-xs ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="side-drawer"
      >
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-brand-offwhite">Tuning Drawer</h2>
              <p className="text-[10px] text-brand-warm-grey uppercase tracking-widest">Algorithm Programming</p>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="material-symbols-outlined text-brand-offwhite hover:text-brand-neon-green transition-colors cursor-pointer"
            >
              close
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-[11px] uppercase tracking-wider text-brand-warm-grey">Active Filters</div>
            <div className="bg-brand-clay/5 p-4 border border-brand-offwhite/10 text-[11px] leading-relaxed">
              <div className="text-brand-neon-green">root@state-ai:~$ set --match 0.90</div>
              <div className="text-brand-offwhite/60">&gt; Applied: High Fidelity Filter</div>
              <div className="mt-2 text-brand-neon-green">root@state-ai:~$ ignore --category hype</div>
              <div className="text-brand-offwhite/60">&gt; Logic: Suppressing marketing fluff</div>
              <div className="mt-2 animate-pulse text-brand-neon-green">root@state-ai:~$ _</div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('algorithm')}
              className={`w-full flex items-center gap-3 p-3 transition-colors text-left ${
                activeTab === 'algorithm' ? 'text-brand-neon-green bg-brand-offwhite/5 font-bold' : 'hover:bg-brand-offwhite/5 text-brand-offwhite/60'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">settings_input_component</span>
              <span>Algorithm</span>
            </button>
            <button
              onClick={() => setActiveTab('weights')}
              className={`w-full flex items-center gap-3 p-3 transition-colors text-left ${
                activeTab === 'weights' ? 'text-brand-neon-green bg-brand-offwhite/5 font-bold' : 'hover:bg-brand-offwhite/5 text-brand-offwhite/60'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">balance</span>
              <span>Weights</span>
            </button>
            <button
              onClick={() => setActiveTab('bias')}
              className={`w-full flex items-center gap-3 p-3 transition-colors text-left ${
                activeTab === 'bias' ? 'text-brand-neon-green bg-brand-offwhite/5 font-bold' : 'hover:bg-brand-offwhite/5 text-brand-offwhite/60'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">query_stats</span>
              <span>Bias</span>
            </button>
            <button
              onClick={() => setActiveTab('entropy')}
              className={`w-full flex items-center gap-3 p-3 transition-colors text-left ${
                activeTab === 'entropy' ? 'text-brand-neon-green bg-brand-offwhite/5 font-bold' : 'hover:bg-brand-offwhite/5 text-brand-offwhite/60'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grain</span>
              <span>Entropy</span>
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-6">
          <SidebarNewsletter />
          <Button
            variant="secondary"
            onClick={() => setIsDrawerOpen(false)}
            className="w-full py-3 bg-brand-neon-green border-brand-neon-green text-brand-black hover:bg-brand-neon-green/90 font-bold uppercase tracking-widest text-[11px]"
          >
            Commit Changes
          </Button>
          <div className="flex justify-between px-2 text-brand-warm-grey">
            <a className="hover:text-brand-offwhite flex items-center gap-1.5 transition-colors" href="#">
              <span className="material-symbols-outlined text-[14px]">description</span> Docs
            </a>
            <a className="hover:text-brand-offwhite flex items-center gap-1.5 transition-colors" href="#">
              <span className="material-symbols-outlined text-[14px]">logout</span> Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
