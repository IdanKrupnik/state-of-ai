import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AttentionVisualizer } from './AttentionVisualizer';
import { AttentionVisualizerDriver } from './AttentionVisualizer.driver';

describe('AttentionVisualizer Component', () => {
  it('should render network layers and laser lines', () => {
    const { container } = render(<AttentionVisualizer prompt="cat sat mat" />);
    const driver = new AttentionVisualizerDriver(container);

    expect(driver.getL1Nodes().length).toBe(3);
    expect(driver.getL2Nodes().length).toBe(4);
    expect(driver.getL3Nodes().length).toBe(2);
    expect(driver.getLaserLines().length).toBeGreaterThan(0);
  });
});
