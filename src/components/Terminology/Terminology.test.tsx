import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Terminology } from './Terminology';
import { TerminologyDriver } from './Terminology.driver';

describe('Terminology Component', () => {
  it('should render sorted terms alphabetically and support search filtering', () => {
    const { container } = render(<Terminology />);
    const driver = new TerminologyDriver(container);

    const titles = driver.getTermTitles();
    expect(titles).toHaveLength(14);
    expect(titles[0]).toBe('Agent');
    expect(titles[1]).toBe('Context Window');
    expect(titles[titles.length - 1]).toBe('Weights');

    driver.setSearchQuery('rag');
    expect(driver.getTermsCount()).toBe(1);
    expect(driver.getTermTitles()[0]).toBe('RAG');

    driver.setSearchQuery('Factually incorrect');
    expect(driver.getTermsCount()).toBe(1);
    expect(driver.getTermTitles()[0]).toBe('Hallucination');

    driver.setSearchQuery('NonExistentTermSearch');
    expect(driver.getTermsCount()).toBe(0);
    expect(driver.hasEmptyState()).toBe(true);
    expect(driver.getEmptyStateText()).toBe('NO MATCHING TERMS FOUND.');
  });

  it('should filter terms by clicked letter tab and disable empty letter tabs', () => {
    const { container } = render(<Terminology />);
    const driver = new TerminologyDriver(container);

    expect(driver.getSelectedLetter()).toBe('ALL');
    expect(driver.isLetterDisabled('B')).toBe(true);
    expect(driver.isLetterDisabled('A')).toBe(false);

    driver.selectLetter('A');
    expect(driver.getSelectedLetter()).toBe('A');
    expect(driver.getTermsCount()).toBe(1);
    expect(driver.getTermTitles()[0]).toBe('Agent');

    driver.selectLetter('T');
    expect(driver.getSelectedLetter()).toBe('T');
    expect(driver.getTermsCount()).toBe(2);
    expect(driver.getTermTitles()).toEqual(['Token', 'Transformer']);
  });

  it('should search globally across all letters even when a specific letter tab is selected', () => {
    const { container } = render(<Terminology />);
    const driver = new TerminologyDriver(container);

    driver.selectLetter('A');
    expect(driver.getTermsCount()).toBe(1);
    expect(driver.getTermTitles()[0]).toBe('Agent');

    driver.setSearchQuery('rag');
    expect(driver.getTermsCount()).toBe(1);
    expect(driver.getTermTitles()[0]).toBe('RAG');

    driver.setSearchQuery('');
    expect(driver.getTermsCount()).toBe(1);
    expect(driver.getTermTitles()[0]).toBe('Agent');
  });
});

