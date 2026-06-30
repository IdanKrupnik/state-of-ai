import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AIBasics } from './AIBasics';
import { AIBasicsDriver } from './AIBasics.driver';

describe('AIBasics Component', () => {
  it('should render main headers and technical subsections correctly', () => {
    const { container } = render(<AIBasics />);
    const driver = new AIBasicsDriver(container);

    expect(driver.getTitle()).toBe('AI Fundamentals');
    expect(driver.getSubtitle()).toBe(
      'A foundational inquiry into the mechanisms, architectures, and deployment paradigms governing contemporary synthetic intelligence.'
    );

    expect(driver.getSectionTitle(0)).toBe('What is Artificial Intelligence?');
    expect(driver.getSectionTitle(1)).toBe('Neural Networks');
    expect(driver.getSectionTitle(2)).toBe('Large Language Models (LLMs)');
    expect(driver.getSectionTitle(3)).toBe('What is Inference?');

    expect(driver.getLatencyText()).toContain('ms');
    expect(driver.getDatacenterTopologyImageAlt()).toBe('Conceptual datacenter topology');

    expect(driver.hasTOC()).toBe(true);
    expect(driver.getTOCLinks()).toEqual([
      '01 // Definition',
      '02 // Architecture',
      '03 // Capabilities',
      '04 // Deployment',
    ]);

    expect(driver.hasMobileTOC()).toBe(true);
    expect(driver.getMobileTOCLinks()).toEqual([
      '01 // Definition',
      '02 // Architecture',
      '03 // Capabilities',
      '04 // Deployment',
    ]);
  });
});
