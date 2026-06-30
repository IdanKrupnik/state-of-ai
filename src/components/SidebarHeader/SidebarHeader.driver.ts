import { SystemStatusDriver } from '../ui/SystemStatus/SystemStatus.driver';
import { screen } from '@testing-library/react';

export class SidebarHeaderDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      if (this.container.getAttribute('data-testid') === 'sidebar-header') {
        el = this.container;
      } else {
        el = this.container.querySelector('[data-testid="sidebar-header"]') as HTMLElement | null;
      }
    } else {
      el = screen.queryByTestId('sidebar-header') as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('SidebarHeader element not found');
    }
    this.element = el;
    return el;
  }

  getTitleText(): string | null {
    const titleEl = this.elementToUse.querySelector('.font-inter');
    return titleEl ? titleEl.textContent : null;
  }

  getSubtitleText(): string | null {
    const subtitleEl = this.elementToUse.querySelector('p');
    return subtitleEl ? subtitleEl.textContent : null;
  }

  getSystemStatusDriver(): SystemStatusDriver {
    return new SystemStatusDriver(this.elementToUse);
  }
}
