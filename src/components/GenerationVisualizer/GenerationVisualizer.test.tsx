import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { GenerationVisualizer } from './GenerationVisualizer';
import { GenerationVisualizerDriver } from './GenerationVisualizer.driver';

describe('GenerationVisualizer Component', () => {
  it('should render candidates and predicted token placeholder', async () => {
    vi.useFakeTimers();
    const { container } = render(<GenerationVisualizer prompt="The cat sat" />);
    const driver = new GenerationVisualizerDriver(container);

    expect(driver.getCandidatesCount()).toBe(4);
    expect(driver.getCandidateText(0)).toBe('on');

    const span = driver.getPredictedTokenSpan();
    expect(span?.textContent).toBe('_');

    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    expect(span?.textContent).toBe(' on');
    vi.useRealTimers();
  });
});
