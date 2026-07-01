import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EmbeddingVisualizer } from './EmbeddingVisualizer';
import { EmbeddingVisualizerDriver } from './EmbeddingVisualizer.driver';

describe('EmbeddingVisualizer Component', () => {
  it('should render standard neighborhoods and specific nodes', () => {
    const { container } = render(<EmbeddingVisualizer prompt="cat mat" />);
    const driver = new EmbeddingVisualizerDriver(container);

    expect(driver.getNodes().length).toBeGreaterThan(0);
    expect(driver.hasNode('cat')).toBe(true);
    expect(driver.hasNode('mat')).toBe(true);
    expect(driver.hasNode('dog')).toBe(true);
  });
});
