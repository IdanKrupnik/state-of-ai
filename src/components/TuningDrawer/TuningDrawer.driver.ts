import { fireEvent, screen } from '@testing-library/react';
import { SidebarNewsletterDriver } from '../SidebarNewsletter/SidebarNewsletter.driver';

export class TuningDrawerDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="side-drawer"]');
    } else {
      el = screen.queryByTestId('side-drawer');
    }
    
    if (!el) {
      throw new Error('TuningDrawer element not found');
    }
    this.element = el;
    return el;
  }

  isOpen(): boolean {
    return !this.elementToUse.className.includes('translate-x-full');
  }

  clickClose(): this {
    const btn = this.elementToUse.querySelector('button.material-symbols-outlined');
    if (!btn) throw new Error('Close button not found');
    fireEvent.click(btn);
    return this;
  }

  clickTab(tabName: string): this {
    const tabs = this.elementToUse.querySelectorAll('nav button');
    let found = false;
    tabs.forEach((tab) => {
      if (tab.textContent?.includes(tabName)) {
        fireEvent.click(tab);
        found = true;
      }
    });
    if (!found) throw new Error(`Tab "${tabName}" not found`);
    return this;
  }

  isTabActive(tabName: string): boolean {
    const tabs = this.elementToUse.querySelectorAll('nav button');
    let isActive = false;
    tabs.forEach((tab) => {
      if (tab.textContent?.includes(tabName)) {
        if (tab.className.includes('text-brand-neon-green')) {
          isActive = true;
        }
      }
    });
    return isActive;
  }

  getNewsletterDriver(): SidebarNewsletterDriver {
    return new SidebarNewsletterDriver(this.elementToUse);
  }
}
