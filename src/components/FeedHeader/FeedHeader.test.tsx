import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FeedHeader } from './FeedHeader';
import { FeedHeaderDriver } from './FeedHeader.driver';

describe('FeedHeader Component', () => {
  it('should render details correctly', () => {
    const { container } = render(
      <FeedHeader 
        category="Tech Updates" 
        title="Breaking News" 
        description="This is the description." 
      />
    );
    const driver = new FeedHeaderDriver(container);

    expect(driver.getTitleText()).toBe('Breaking News');
    expect(driver.getDescriptionText()).toBe('This is the description.');
    
    const tagDriver = driver.getMetadataTagDriver();
    expect(tagDriver.getText()).toBe('Tech Updates');
  });
});
