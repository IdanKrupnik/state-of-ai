import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from './Card';
import { CardDriver } from './Card.driver';

describe('Card Component', () => {
  it('should render content, title, and subtitle correctly', () => {
    const { container } = render(
      <Card 
        title="AI Regulations Passed" 
        subtitle="Policy" 
        footer={<span>Read more</span>}
      >
        Governments globally have aligned on a set of standards.
      </Card>
    );
    const driver = new CardDriver(container);

    expect(driver.getTitleText()).toBe('AI Regulations Passed');
    expect(driver.getSubtitleText()).toBe('Policy');
    expect(driver.getBodyText()).toBe('Governments globally have aligned on a set of standards.');
    expect(driver.getFooterText()).toBe('Read more');
  });

  it('should apply Warm Modern Minimalist styling correctly', () => {
    const { container } = render(<Card>Card content</Card>);
    const driver = new CardDriver(container);

    expect(driver.hasCorrectStyle()).toBe(true);
  });
});
