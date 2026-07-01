import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TopNavBar } from './TopNavBar';
import { TopNavBarDriver } from './TopNavBar.driver';

describe('TopNavBar Component', () => {
  it('should render brand and support theme toggling', () => {
    const { container } = render(<TopNavBar />);
    const driver = new TopNavBarDriver(container);

    expect(driver.getBrandText()).toBe('STATE OF AI');
    expect(driver.hasThemeSwitch()).toBe(true);

    driver.clickThemeSwitch();
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    driver.clickThemeSwitch();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should toggle mobile menu', () => {
    const { container } = render(<TopNavBar />);
    const driver = new TopNavBarDriver(container);

    expect(driver.isMobileMenuOpen()).toBe(false);

    driver.toggleMobileMenu();
    expect(driver.isMobileMenuOpen()).toBe(true);

    driver.toggleMobileMenu();
    expect(driver.isMobileMenuOpen()).toBe(false);
  });

  it('should highlight active tab and trigger tab change on click', () => {
    const handleTabChange = vi.fn();
    const { container, rerender } = render(
      <TopNavBar activeTab="feed" onTabChange={handleTabChange} />
    );
    const driver = new TopNavBarDriver(container);

    expect(driver.isTabActive('feed')).toBe(true);
    expect(driver.isTabActive('models')).toBe(false);
    expect(driver.isTabActive('events')).toBe(false);
    expect(driver.isTabActive('about')).toBe(false);
    expect(driver.isTabActive('learn')).toBe(false);

    driver.clickTab('models');
    expect(handleTabChange).toHaveBeenCalledWith('models');

    rerender(
      <TopNavBar activeTab="models" onTabChange={handleTabChange} />
    );

    expect(driver.isTabActive('feed')).toBe(false);
    expect(driver.isTabActive('models')).toBe(true);
  });

  it('should toggle tabs in mobile menu', () => {
    const handleTabChange = vi.fn();
    const { container } = render(
      <TopNavBar activeTab="feed" onTabChange={handleTabChange} />
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
