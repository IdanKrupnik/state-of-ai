import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FeedRow } from './FeedRow';
import { FeedRowDriver } from './FeedRow.driver';

describe('FeedRow Component', () => {
  it('should render details immediately by default', () => {
    const { container } = render(
      <FeedRow
        company="OpenAI"
        title="GPT-4 Release"
        summary="A major update to our LLM model."
        sourceUrl="https://openai.com"
        timestamp="10:00 UTC"
      />
    );
    const driver = new FeedRowDriver(container);

    expect(driver.getTitleText()).toBe('GPT-4 Release');
    expect(driver.getTimestampText()).toBe('10:00 UTC');
    expect(driver.isContentVisible()).toBe(true);
    expect(driver.getContentText()).toContain('A major update to our LLM model.');
  });

  it('should render the image when provided', () => {
    const { container } = render(
      <FeedRow
        company="OpenAI"
        title="GPT-4 Release"
        summary="A major update to our LLM model."
        sourceUrl="https://openai.com"
        timestamp="10:00 UTC"
        imageUrl="https://supabase.com/image.png"
      />
    );
    const driver = new FeedRowDriver(container);
    expect(driver.hasImage()).toBe(true);
    expect(driver.getImageSrc()).toBe('https://supabase.com/image.png');
  });

  it('should render the more-like-this button and support click interaction', () => {
    const { container } = render(
      <FeedRow
        company="OpenAI"
        title="GPT-4 Release"
        summary="A major update to our LLM model."
        sourceUrl="https://openai.com"
        timestamp="10:00 UTC"
      />
    );
    const driver = new FeedRowDriver(container);
    expect(driver.hasMoreButton()).toBe(true);
    driver.clickMoreButton();
  });
});
