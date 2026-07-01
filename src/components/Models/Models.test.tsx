import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Models, ModelRow } from './Models';
import { ModelsDriver } from './Models.driver';

describe('Models Component', () => {
  const mockModels: ModelRow[] = [
    {
      id: 'openai/gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      context_length: 128000,
      prompt_token_price: 5.0,
      completion_token_price: 15.0,
      description: 'Standard OpenAI frontier multimodal model.',
      updated_at: '2026-07-01T12:00:00Z',
      created: '2026-07-01T12:00:00Z',
    },
    {
      id: 'anthropic/claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      context_length: 200000,
      prompt_token_price: 3.0,
      completion_token_price: 15.0,
      description: 'Excellent programming capabilities and speed.',
      updated_at: '2026-07-01T11:00:00Z',
      created: '2026-07-01T11:00:00Z',
    },
    {
      id: 'openai/gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      context_length: 128000,
      prompt_token_price: 10.0,
      completion_token_price: 30.0,
      description: 'Previous gen OpenAI smart model.',
      updated_at: '2026-07-01T12:00:00Z',
      created: '2026-06-30T12:00:00Z',
    },
  ];

  it('should render the list of models grouped by their providers and flag the newest ones', () => {
    const { container } = render(<Models initialModels={mockModels} />);
    const driver = new ModelsDriver(container);

    expect(driver.hasStatusIndicator()).toBe(true);
    expect(driver.hasProviderGroup('openai')).toBe(true);
    expect(driver.hasProviderGroup('anthropic')).toBe(true);
    expect(driver.hasProviderGroup('google')).toBe(false);

    const openaiRows = driver.getModelRows('openai');
    expect(openaiRows).toHaveLength(2);
    expect(driver.getModelName(openaiRows[0])).toBe('GPT-4o');
    expect(driver.getContextText(openaiRows[0])).toBe('128k ctx');
    expect(driver.getPriceText(openaiRows[0])).toBe('$5.00 / $15.00');
    expect(driver.getDescriptionText(openaiRows[0])).toBe('Standard OpenAI frontier multimodal model.');
    expect(driver.hasNewBadge(openaiRows[0])).toBe(true);
  });

  it('should sort models by created date descending inside provider groups', () => {
    const { container } = render(<Models initialModels={mockModels} />);
    const driver = new ModelsDriver(container);

    const openaiRows = driver.getModelRows('openai');
    expect(driver.getModelName(openaiRows[0])).toBe('GPT-4o');
    expect(driver.getModelName(openaiRows[1])).toBe('GPT-4 Turbo');
  });

  it('should support collapsing and expanding provider groups', () => {
    const { container } = render(<Models initialModels={mockModels} />);
    const driver = new ModelsDriver(container);

    expect(driver.isProviderExpanded('openai')).toBe(true);

    driver.toggleProvider('openai');
    expect(driver.isProviderExpanded('openai')).toBe(false);

    driver.toggleProvider('openai');
    expect(driver.isProviderExpanded('openai')).toBe(true);
  });
});
