import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Pricing } from './Pricing';
import { PricingDriver } from './Pricing.driver';

describe('Pricing Component', () => {
  it('should render Free and Pro subscription cards side-by-side with disabled buttons', () => {
    const { container } = render(<Pricing />);
    const driver = new PricingDriver(container);

    expect(driver.getPriceText()).toBe('$0');
    expect(driver.hasFreePlanCard()).toBe(true);
    expect(driver.hasProPlanCard()).toBe(true);
    expect(driver.isSubscribeButtonDisabled()).toBe(true);
  });
});
