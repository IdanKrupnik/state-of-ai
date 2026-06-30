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

  it('should highlight active tab and trigger tab change on click', () => {
    const handleTabChange = vi.fn();
    const { container, rerender } = render(
      <TopNavBar onTuneClick={vi.fn()} activeTab="feed" onTabChange={handleTabChange} />
    );
    const driver = new TopNavBarDriver(container);

    expect(driver.isTabActive('feed')).toBe(true);
    expect(driver.isTabActive('benchmarks')).toBe(false);
    expect(driver.isTabActive('events')).toBe(false);
    expect(driver.isTabActive('about')).toBe(false);
    expect(driver.isTabActive('learn')).toBe(false);

    driver.clickTab('benchmarks');
    expect(handleTabChange).toHaveBeenCalledWith('benchmarks');

    rerender(
      <TopNavBar onTuneClick={vi.fn()} activeTab="benchmarks" onTabChange={handleTabChange} />
    );

    expect(driver.isTabActive('feed')).toBe(false);
    expect(driver.isTabActive('benchmarks')).toBe(true);
  });

  it('should toggle tabs in mobile menu', () => {
    const handleTabChange = vi.fn();
    const { container } = render(
      <TopNavBar onTuneClick={vi.fn()} activeTab="feed" onTabChange={handleTabChange} />
    );
    const driver = new TopNavBarDriver(container);

    driver.toggleMobileMenu();
    expect(driver.isMobileMenuOpen()).toBe(true);
    expect(driver.isMobileTabActive('feed')).toBe(true);
    expect(driver.isMobileTabActive('learn')).toBe(false);

    driver.clickMobileTab('learn');
    expect(handleTabChange).toHaveBeenCalledWith('learn');
    expect(driver.isMobileMenuOpen()).toBe(false);
  });
});
