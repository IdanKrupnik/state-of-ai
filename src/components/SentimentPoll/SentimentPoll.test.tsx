import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SentimentPoll } from './SentimentPoll';
import { SentimentPollDriver } from './SentimentPoll.driver';

describe('SentimentPoll Component', () => {
  it('should render custom question and options', () => {
    const customOptions = [
      { label: 'Option A', percentage: 60 },
      { label: 'Option B', percentage: 40 },
    ];
    const { container } = render(
      <SentimentPoll question="A or B?" options={customOptions} />
    );
    const driver = new SentimentPollDriver(container);

    expect(driver.getQuestionText()).toBe('A or B?');
    const opts = driver.getOptions();
    expect(opts).toHaveLength(2);
    expect(opts[0].label).toBe('Option A');
    expect(opts[0].percentage).toBe('60%');
    expect(opts[0].width).toBe('60%');
  });
});
