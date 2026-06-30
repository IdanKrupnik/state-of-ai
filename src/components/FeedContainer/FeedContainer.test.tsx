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

  it('should render the list of article rows correctly', () => {
    const { container } = render(<FeedContainer initialArticles={mockArticles} />);
    const driver = new FeedContainerDriver(container);

    const rows = driver.getArticleRowDrivers();
    expect(rows).toHaveLength(3);
    expect(rows[0].getTitleText()).toBe('Database backups automated');
    expect(rows[1].getTitleText()).toBe('GPT-5 teaser released');
    expect(rows[2].getTitleText()).toBe('Gemini 2.0 now live');
  });

  it('should filter articles by search query', () => {
    const { container } = render(<FeedContainer initialArticles={mockArticles} />);
    const driver = new FeedContainerDriver(container);

    const searchInput = driver.getSearchInputDriver();
    searchInput.setValue('Gemini');

    const rows = driver.getArticleRowDrivers();
    expect(rows).toHaveLength(1);
    expect(rows[0].getTitleText()).toBe('Gemini 2.0 now live');
  });

  it('should display empty state if no articles match', () => {
    const { container } = render(<FeedContainer initialArticles={mockArticles} />);
    const driver = new FeedContainerDriver(container);

    const searchInput = driver.getSearchInputDriver();
    searchInput.setValue('Unobtainium');

    const rows = driver.getArticleRowDrivers();
    expect(rows).toHaveLength(0);
    expect(driver.getEmptyStateText()).toContain('No simplified articles found');
  });

  it('should allow newsletter subscriptions in the side drawer', () => {
    const { container } = render(<FeedContainer initialArticles={mockArticles} />);
    const driver = new FeedContainerDriver(container);

    const newsletterDriver = driver.getSidebarNewsletterDriver();
    const emailInput = newsletterDriver.getEmailInputDriver();
    const submitBtn = newsletterDriver.getSubmitButtonDriver();

    emailInput.setValue('test@example.com');
    submitBtn.click();

    expect(newsletterDriver.getSuccessMessage()).toBe('✓ Subscribed successfully!');
  });

  it('should open and close the side tuning drawer', () => {
    const { container } = render(<FeedContainer initialArticles={mockArticles} />);
    const driver = new FeedContainerDriver(container);

    expect(driver.isDrawerVisible()).toBe(false);

    driver.openDrawer();
    expect(driver.isDrawerVisible()).toBe(true);

    driver.closeDrawer();
    expect(driver.isDrawerVisible()).toBe(false);
  });
});
