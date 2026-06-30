import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TopNavBar } from './TopNavBar';
import { TopNavBarDriver } from './TopNavBar.driver';

describe('TopNavBar Component', () => {
  it('should render brand and handle click', () => {
    const handleTuneClick = vi.fn();
    const { container } = render(<TopNavBar onTuneClick={handleTuneClick} />);
    const driver = new TopNavBarDriver(container);

    expect(driver.getBrandText()).toBe('STATE OF AI');
    driver.clickTuneFilter();
    expect(handleTuneClick).toHaveBeenCalledTimes(1);
  });

  it('should toggle mobile menu and trigger filter click', () => {
    const handleTuneClick = vi.fn();
    const { container } = render(<TopNavBar onTuneClick={handleTuneClick} />);
    const driver = new TopNavBarDriver(container);

    expect(driver.isMobileMenuOpen()).toBe(false);

    driver.toggleMobileMenu();
    expect(driver.isMobileMenuOpen()).toBe(true);

    driver.clickMobileTuneFilter();
    expect(handleTuneClick).toHaveBeenCalledTimes(1);
    expect(driver.isMobileMenuOpen()).toBe(false);
  });
});
