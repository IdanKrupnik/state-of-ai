import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { App, Article } from './App';
import { AppDriver } from './App.driver';

vi.mock('../../lib/supabaseClient', () => {
  return {
    supabaseClient: {
      from: () => ({
        select: () => ({
          neq: () => ({
            order: () => ({
              range: vi.fn().mockResolvedValue({
                data: [
                  {
                    id: '4',
                    company: 'Microsoft',
                    hype_score: 80,
                    simplified_title: 'Windows Copilot Released',
                    short_summary: 'Microsoft released Windows Copilot integration.',
                    source_url: 'https://microsoft.com',
                    original_title: 'Windows Copilot Released original',
                    created_at: '2026-06-30T14:00:00Z',
                    source: 'Microsoft',
                    image_url: null,
                  }
                ],
                count: 4,
                error: null
              })
            })
          })
        })
      })
    }
  };
});

describe('App Component', () => {
  const mockArticles: Article[] = [
    {
      id: '1',
      company: 'Supabase',
      hype_score: 45,
      simplified_title: 'Database backups automated',
      short_summary: 'Supabase has introduced point-in-time recovery for databases.',
      source_url: 'https://supabase.com/blog/pitr',
      original_title: 'Database backups automated original',
      created_at: '2026-06-30T14:00:00Z',
      source: 'Supabase',
      image_url: null,
    },
    {
      id: '2',
      company: 'OpenAI',
      hype_score: 90,
      simplified_title: 'GPT-5 teaser released',
      short_summary: 'OpenAI previewed its next-generation reasoning model.',
      source_url: 'https://openai.com/blog/gpt5',
      original_title: 'GPT-5 teaser released original',
      created_at: '2026-06-30T14:00:00Z',
      source: 'OpenAI',
      image_url: null,
    },
    {
      id: '3',
      company: 'Google',
      hype_score: 75,
      simplified_title: 'Gemini 2.0 now live',
      short_summary: 'Google released Gemini 2.0 Flash in public preview.',
      source_url: 'https://deepmind.google/gemini',
      original_title: 'Gemini 2.0 now live original',
      created_at: '2026-06-30T14:00:00Z',
      source: 'Google',
      image_url: null,
    },
  ];

  it('should render the list of article rows correctly', () => {
    const { container } = render(<App initialArticles={mockArticles} />);
    const driver = new AppDriver(container);

    const rows = driver.getArticleRowDrivers();
    expect(rows).toHaveLength(3);
    expect(rows[0].getTitleText()).toBe('Database backups automated');
    expect(rows[1].getTitleText()).toBe('GPT-5 teaser released');
    expect(rows[2].getTitleText()).toBe('Gemini 2.0 now live');
  });

  it('should switch tabs and render appropriate active sections', () => {
    const { container } = render(<App initialArticles={mockArticles} />);
    const driver = new AppDriver(container);
    const nav = driver.getTopNavBarDriver();

    expect(driver.getArticleRowDrivers()).toHaveLength(3);

    nav.clickTab('models');
    expect(container.querySelector('[data-testid="models-container"]')).toBeTruthy();

    nav.clickTab('events');
    const eventsDriver = driver.getEventsDriver();
    expect(eventsDriver.hasEventsSection()).toBe(true);

    nav.clickTab('about');
    const aboutDriver = driver.getAboutDriver();
    expect(aboutDriver.hasSection()).toBe(true);
    expect(aboutDriver.getTitleText()).toBe('About State of AI');

    nav.clickTab('learn');
    const basicsDriver = driver.getAIBasicsDriver();
    expect(basicsDriver.getTitle()).toBe('AI Fundamentals');

    nav.clickTab('pricing');
    expect(container.querySelector('[data-testid="pricing-container"]')).toBeTruthy();

    nav.clickTab('feed');
    expect(driver.getArticleRowDrivers()).toHaveLength(3);
  });

  it('should support pagination and load more items', async () => {
    const { container } = render(<App initialArticles={mockArticles} initialTotalCount={4} />);
    const driver = new AppDriver(container);

    expect(driver.getArticleRowDrivers()).toHaveLength(3);
    expect(driver.hasLoadMoreButton()).toBe(true);
    expect(driver.getLoadMoreButtonText()).toBe('Load More');

    await act(async () => {
      driver.clickLoadMoreButton();
    });

    await vi.waitFor(() => {
      expect(driver.getArticleRowDrivers()).toHaveLength(4);
    });

    expect(driver.hasLoadMoreButton()).toBe(false);
  });
});
