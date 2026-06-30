import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App, Article } from './App';
import { AppDriver } from './App.driver';

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

  it('should allow opening and closing side drawer and subscribing to newsletter', () => {
    const { container } = render(<App initialArticles={mockArticles} />);
    const driver = new AppDriver(container);

    const nav = driver.getTopNavBarDriver();
    const drawer = driver.getTuningDrawerDriver();

    expect(drawer.isOpen()).toBe(false);

    nav.clickTuneFilter();
    expect(drawer.isOpen()).toBe(true);

    const newsletter = drawer.getNewsletterDriver();
    const input = newsletter.getEmailInputDriver();
    const submit = newsletter.getSubmitButtonDriver();

    input.setValue('test@example.com');
    submit.click();
    expect(newsletter.getSuccessMessage()).toBe('✓ Subscribed successfully!');

    drawer.clickClose();
    expect(drawer.isOpen()).toBe(false);
  });
});
