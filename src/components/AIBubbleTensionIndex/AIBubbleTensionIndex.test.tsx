import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AIBubbleTensionIndex, BubbleIndexData } from './AIBubbleTensionIndex';
import { AIBubbleTensionIndexDriver } from './AIBubbleTensionIndex.driver';

describe('AIBubbleTensionIndex Component', () => {
  const testData: BubbleIndexData = {
    bubblePercentage: 68,
    structuralShiftPercentage: 32,
    statusDirection: 'increasing',
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
});
