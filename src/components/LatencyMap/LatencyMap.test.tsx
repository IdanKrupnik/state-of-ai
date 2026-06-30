import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LatencyMap } from './LatencyMap';
import { LatencyMapDriver } from './LatencyMap.driver';

describe('LatencyMap Component', () => {
  it('should render the latency map layout and labels', () => {
    const { container } = render(<LatencyMap />);
    const driver = new LatencyMapDriver(container);

    expect(driver.getLabel()).toBe('REAL-TIME LATENCY MAPPING');
    expect(driver.getLatencyNodesCount()).toBeGreaterThan(0);
  });
});
