import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { AIBubbleTensionIndex } from './AIBubbleTensionIndex';
import { AIBubbleTensionIndexDriver } from './AIBubbleTensionIndex.driver';

describe('AIBubbleTensionIndex Component', () => {
  const testData = {
    bubblePercentage: 68,
    structuralShiftPercentage: 32,
    statusDirection: 'increasing' as const,
    lastSynced: '2026-07-01T17:15:00Z',
  };

  it('should render the AI bubble index widget and elements correctly', () => {
    const { container } = render(<AIBubbleTensionIndex data={testData} />);
    const driver = new AIBubbleTensionIndexDriver(container);

    expect(driver.hasWidget()).toBe(true);
    expect(driver.getTitle()).toBe('Is AI a Bubble?');
    expect(driver.getBubblePercentageText()).toBe('68%');
    expect(driver.getTrackerPin()).not.toBeNull();
  });

  it('should toggle accordion open/close when clicking metrics', async () => {
    const { container } = render(<AIBubbleTensionIndex data={testData} />);
    const driver = new AIBubbleTensionIndexDriver(container);

    expect(driver.isMetricDetailsVisible(0)).toBe(false);
    
    act(() => {
      driver.clickMetricButton(0);
    });
    expect(driver.isMetricDetailsVisible(0)).toBe(true);
    
    act(() => {
      driver.clickMetricButton(0);
    });

    await vi.waitFor(() => {
      expect(driver.isMetricDetailsVisible(0)).toBe(false);
    });
  });
});
