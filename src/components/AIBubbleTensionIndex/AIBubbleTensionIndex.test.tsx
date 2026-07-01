import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AIBubbleTensionIndex } from './AIBubbleTensionIndex';
import { AIBubbleTensionIndexDriver } from './AIBubbleTensionIndex.driver';

describe('AIBubbleTensionIndex Component', () => {
  const testData = {
    bubble_percentage: 68,
    status_direction: 'increasing' as const,
    short_explanation: 'AI spending is very high but short-term returns are not yet clear.',
    financial_highlights: [
      { label: 'Hardware Sales', simple_text: 'Sales of advanced computer chips are growing rapidly but software sales are slower.' },
      { label: 'Corporate Spending', simple_text: 'Companies are spending billions on new data centers without immediate revenue.' },
      { label: 'Stock Volatility', simple_text: 'AI startup valuations are shifting up and down as investors evaluate long-term value.' }
    ],
    updated_at: '2026-07-01T17:15:00Z',
  };

  it('should render the AI bubble index widget and elements correctly', () => {
    const { container } = render(<AIBubbleTensionIndex data={testData} />);
    const driver = new AIBubbleTensionIndexDriver(container);

    expect(driver.hasWidget()).toBe(true);
    expect(driver.getTitle()).toBe('Is AI a Bubble?');
    expect(driver.getBubblePercentageText()).toBe('68%');
    expect(driver.getTrackerPin()).not.toBeNull();
    expect(driver.getExplanationText()).toContain('AI spending is very high');
    expect(driver.getHighlightText(0)).toContain('Hardware Sales');
    expect(driver.getHighlightText(0)).toContain('Sales of advanced computer chips');
  });
});
