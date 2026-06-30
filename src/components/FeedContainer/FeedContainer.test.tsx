import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FeedContainer, Article } from './FeedContainer';
import { FeedContainerDriver } from './FeedContainer.driver';

describe('FeedContainer Component', () => {
  const mockArticles: Article[] = [
    {
      id: 1,
      company: 'Supabase',
      hype_score: 45,
      simplified_title: 'Database backups automated',
      short_summary: 'Supabase has introduced point-in-time recovery for databases.',
      source_url: 'https://supabase.com/blog/pitr',
    },
    {
      id: 2,
      company: 'OpenAI',
      hype_score: 90,
      simplified_title: 'GPT-5 teaser released',
      short_summary: 'OpenAI previewed its next-generation reasoning model.',
      source_url: 'https://openai.com/blog/gpt5',
    },
    {
      id: 3,
      company: 'Google',
      hype_score: 75,
      simplified_title: 'Gemini 2.0 now live',
      short_summary: 'Google released Gemini 2.0 Flash in public preview.',
      source_url: 'https://deepmind.google/gemini',
    },
  ];

  it('should render the list of articles correctly', () => {
    const { container } = render(<FeedContainer initialArticles={mockArticles} />);
    const driver = new FeedContainerDriver(container);

    const cards = driver.getArticleCardDrivers();
    expect(cards).toHaveLength(3);
    expect(cards[0].getTitleText()).toBe('Database backups automated');
    expect(cards[1].getTitleText()).toBe('GPT-5 teaser released');
    expect(cards[2].getTitleText()).toBe('Gemini 2.0 now live');
  });

  it('should filter articles by search query', () => {
    const { container } = render(<FeedContainer initialArticles={mockArticles} />);
    const driver = new FeedContainerDriver(container);

    const searchInput = driver.getSearchInputDriver();
    searchInput.setValue('Gemini');

    const cards = driver.getArticleCardDrivers();
    expect(cards).toHaveLength(1);
    expect(cards[0].getTitleText()).toBe('Gemini 2.0 now live');
  });

  it('should filter articles by company source switcher', () => {
    const { container } = render(<FeedContainer initialArticles={mockArticles} />);
    const driver = new FeedContainerDriver(container);

    const switcher = driver.getSidebarSourceSwitcherDriver();
    switcher.clickItem('supabase');

    const cards = driver.getArticleCardDrivers();
    expect(cards).toHaveLength(1);
    expect(cards[0].getTitleText()).toBe('Database backups automated');
  });

  it('should display empty state if no articles match', () => {
    const { container } = render(<FeedContainer initialArticles={mockArticles} />);
    const driver = new FeedContainerDriver(container);

    const searchInput = driver.getSearchInputDriver();
    searchInput.setValue('Unobtainium');

    const cards = driver.getArticleCardDrivers();
    expect(cards).toHaveLength(0);
    expect(driver.getEmptyStateText()).toContain('No simplified articles found');
  });

  it('should allow newsletter subscriptions', () => {
    const { container } = render(<FeedContainer initialArticles={mockArticles} />);
    const driver = new FeedContainerDriver(container);

    const newsletterDriver = driver.getSidebarNewsletterDriver();
    const emailInput = newsletterDriver.getEmailInputDriver();
    const submitBtn = newsletterDriver.getSubmitButtonDriver();

    emailInput.setValue('test@example.com');
    submitBtn.click();

    expect(newsletterDriver.getSuccessMessage()).toBe('✓ Subscribed successfully!');
  });
});
