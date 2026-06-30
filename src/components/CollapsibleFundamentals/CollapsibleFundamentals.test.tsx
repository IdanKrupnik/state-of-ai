import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CollapsibleFundamentals } from './CollapsibleFundamentals';
import { CollapsibleFundamentalsDriver } from './CollapsibleFundamentals.driver';

describe('CollapsibleFundamentals Component', () => {
  it('should render and toggle open state', () => {
    const { container } = render(<CollapsibleFundamentals />);
    const driver = new CollapsibleFundamentalsDriver(container);

    expect(driver.getSummaryText()).toContain('NEW TO AI?');
    expect(driver.isOpen()).toBe(false);

    driver.toggle();
    expect(driver.getContentText()).toContain('Transformers');
  });
});
