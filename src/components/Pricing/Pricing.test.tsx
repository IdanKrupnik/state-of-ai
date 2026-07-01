import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Pricing } from './Pricing';
import { PricingDriver } from './Pricing.driver';

describe('Pricing Component', () => {
  it('should render subscription card with correct price and disabled CTA button', () => {
    const { container } = render(<Pricing />);
    const driver = new PricingDriver(container);

    expect(driver.getPriceText()).toBe('$3.99');
    expect(driver.hasSubscribeButton()).toBe(true);
    expect(driver.isSubscribeButtonDisabled()).toBe(true);
  });
});
