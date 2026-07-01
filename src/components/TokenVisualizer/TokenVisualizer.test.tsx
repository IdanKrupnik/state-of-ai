import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TokenVisualizer } from './TokenVisualizer';
import { TokenVisualizerDriver } from './TokenVisualizer.driver';

describe('TokenVisualizer Component', () => {
  it('should split prompt into tokens and render them', () => {
    const { container } = render(<TokenVisualizer prompt="The cat sat" />);
    const driver = new TokenVisualizerDriver(container);

    const boxes = driver.getTokenBoxes();
    expect(boxes.length).toBe(3);

    expect(driver.getTokenText(0)).toBe('The');
    expect(driver.getTokenText(1)).toBe('cat');
    expect(driver.getTokenText(2)).toBe('sat');

    expect(driver.getTokenId(0)).toContain('ID:');
  });
});
