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
});
