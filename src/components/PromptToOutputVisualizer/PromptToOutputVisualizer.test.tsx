import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PromptToOutputVisualizer } from './PromptToOutputVisualizer';
import { PromptToOutputVisualizerDriver } from './PromptToOutputVisualizer.driver';

describe('PromptToOutputVisualizer Component', () => {
  it('should support step transitions, custom inputs, and preset updates', () => {
    const { container } = render(<PromptToOutputVisualizer />);
    const driver = new PromptToOutputVisualizerDriver(container);

    expect(driver.getActiveStepTitle()).toBe('Tokenization');

    driver.clickTab(2);
    expect(driver.getActiveStepTitle()).toBe('Vector Embedding');

    driver.clickTab(3);
    expect(driver.getActiveStepTitle()).toBe('The Attention Mechanism');

    driver.clickTab(4);
    expect(driver.getActiveStepTitle()).toBe('Next-Token Generation');

    const input = driver.getPromptInput();
    expect(input?.value).toBe('The cat sat on the mat');

    driver.setPromptInput('Custom input test');
    expect(input?.value).toBe('Custom input test');

    driver.clickPreset('Modern models scale');
    expect(input?.value).toBe('Modern models scale');
  });
});
