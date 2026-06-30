import { fireEvent, screen } from '@testing-library/react';
import { ButtonDriver } from '../ui/Button/Button.driver';

export class TopNavBarDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('header');
    } else {
      el = screen.queryByRole('banner');
    }
    
    if (!el) {
      throw new Error('TopNavBar element not found');
    }
    this.element = el;
    return el;
  }

  getBrandText(): string | null {
    const brand = this.elementToUse.querySelector('.tracking-tighter');
    return brand ? brand.textContent : null;
  }

  getButtonDriver(): ButtonDriver {
    return new ButtonDriver(this.elementToUse);
  }

  clickTuneFilter(): this {
    this.getButtonDriver().click();
    return this;
  }

  toggleMobileMenu(): this {
    const btn = this.elementToUse.querySelector('[data-testid="hamburger-button"]');
    if (!btn) throw new Error('Hamburger button not found');
    fireEvent.click(btn);
    return this;
  }

  isMobileMenuOpen(): boolean {
    return !!this.elementToUse.querySelector('[data-testid="mobile-dropdown"]');
  }

  clickMobileTuneFilter(): this {
    const dropdown = this.elementToUse.querySelector('[data-testid="mobile-dropdown"]');
    if (!dropdown) throw new Error('Mobile dropdown not open');
    const btn = dropdown.querySelector('button');
    if (!btn) throw new Error('Tune Filter button inside mobile dropdown not found');
    fireEvent.click(btn);
    return this;
  }

  clickTab(tabId: string): this {
    const tab = this.elementToUse.querySelector(`[data-testid="nav-tab-${tabId}"]`);
    if (!tab) throw new Error(`Tab "${tabId}" not found`);
    fireEvent.click(tab);
    return this;
  }

  clickMobileTab(tabId: string): this {
    const tab = this.elementToUse.querySelector(`[data-testid="mobile-nav-tab-${tabId}"]`);
    if (!tab) throw new Error(`Mobile tab "${tabId}" not found`);
    fireEvent.click(tab);
    return this;
  }

  getActiveTabId(): string | null {
    const activeLink = this.elementToUse.querySelector('nav a.text-brand-black');
    if (!activeLink) return null;
    const testId = activeLink.getAttribute('data-testid');
    return testId ? testId.replace('nav-tab-', '') : null;
  }

  isTabActive(tabId: string): boolean {
    const tab = this.elementToUse.querySelector(`[data-testid="nav-tab-${tabId}"]`);
    if (!tab) return false;
    return tab.className.includes('text-brand-black') && tab.className.includes('font-semibold');
  }

  isMobileTabActive(tabId: string): boolean {
    const tab = this.elementToUse.querySelector(`[data-testid="mobile-nav-tab-${tabId}"]`);
    if (!tab) return false;
    return tab.className.includes('text-brand-black') && tab.className.includes('font-bold');
  }
}
