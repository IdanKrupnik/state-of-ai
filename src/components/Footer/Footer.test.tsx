import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';
import { FooterDriver } from './Footer.driver';

describe('Footer Component', () => {
  it('should render copyright and links', () => {
    const { container } = render(<Footer />);
    const driver = new FooterDriver(container);

    expect(driver.getCopyrightText()).toContain('© 2026 STATE OF AI');
    expect(driver.getLinksCount()).toBe(4);
  });
});
