import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
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
    expect(driver.getSectionTitle(3)).toBe('How AI Generates Answers');
    expect(driver.getSectionTitle(4)).toBe('AI Terminology');

    expect(driver.hasTOC()).toBe(true);
    expect(driver.getTOCLinks()).toEqual([
      '01 // Definition',
      '02 // Architecture',
      '03 // Capabilities',
      '04 // Visualizer',
      '05 // Glossary',
    ]);

    expect(driver.hasMobileTOC()).toBe(true);
    expect(driver.isMobileTOCDropdownVisible()).toBe(false);

    act(() => {
      driver.clickMobileTOCToggle();
    });
    expect(driver.isMobileTOCDropdownVisible()).toBe(true);
    expect(driver.getMobileTOCLinks()).toEqual([
      '01 // Definition',
      '02 // Architecture',
      '03 // Capabilities',
      '04 // Visualizer',
      '05 // Glossary',
    ]);

    act(() => {
      driver.clickMobileTOCClose();
    });
    expect(driver.isMobileTOCDropdownVisible()).toBe(false);

    act(() => {
      driver.clickMobileTOCToggle();
    });
    expect(driver.isMobileTOCDropdownVisible()).toBe(true);

    act(() => {
      driver.clickMobileTOCBackdrop();
    });
    expect(driver.isMobileTOCDropdownVisible()).toBe(false);

    expect(driver.hasPromptToOutputVisualizer()).toBe(true);
    const visDriver = driver.getPromptToOutputVisualizerDriver();
    expect(visDriver.getActiveStepTitle()).toBe('Tokenization');
    act(() => {
      visDriver.clickTab(2);
    });
    expect(visDriver.getActiveStepTitle()).toBe('Vector Embedding');
  });
});
