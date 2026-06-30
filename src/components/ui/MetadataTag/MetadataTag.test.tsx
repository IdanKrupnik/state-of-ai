import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MetadataTag } from './MetadataTag';
import { MetadataTagDriver } from './MetadataTag.driver';

describe('MetadataTag Component', () => {
  it('should render the children content correctly', () => {
    const { container } = render(<MetadataTag>AI Technology</MetadataTag>);
    const driver = new MetadataTagDriver(container);

    expect(driver.getText()).toBe('AI Technology');
  });

  it('should have the correct styling according to Warm Modern Minimalist guidelines', () => {
    const { container } = render(<MetadataTag>Hype: 80%</MetadataTag>);
    const driver = new MetadataTagDriver(container);

    expect(driver.hasCorrectStyle()).toBe(true);
  });
});
