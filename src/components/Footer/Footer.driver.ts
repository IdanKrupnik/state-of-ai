import { screen } from '@testing-library/react';

export class FooterDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('footer');
    } else {
      el = screen.queryByRole('contentinfo');
    }
    
    if (!el) {
      throw new Error('Footer element not found');
    }
    this.element = el;
    return el;
  }

  getCopyrightText(): string | null {
    const el = this.elementToUse.querySelector('.tracking-tighter');
    return el ? el.textContent : null;
  }

  getLinksCount(): number {
    return this.elementToUse.querySelectorAll('a').length;
  }
}
