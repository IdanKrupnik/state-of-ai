import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { About } from './About';
import { AboutDriver } from './About.driver';

describe('About Component', () => {
  it('should render vision, philosophy and mission headers correctly', () => {
    const { container } = render(<About />);
    const driver = new AboutDriver(container);

    expect(driver.hasSection()).toBe(true);
    expect(driver.getTitleText()).toBe('About State of AI');
    expect(driver.getMissionHeadingText()).toBe('AI for Everyone');
  });
});
