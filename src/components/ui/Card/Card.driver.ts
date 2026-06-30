import { screen } from '@testing-library/react';

export class CardDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.firstElementChild as HTMLElement;
    } else {
      el = screen.queryByText((_, element) => {
        return element?.tagName.toLowerCase() === 'h3';
      })?.parentElement?.parentElement as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('Card element not found');
    }
    this.element = el;
    return el;
  }

  getTitleText(): string | null {
    const heading = this.elementToUse.querySelector('h3');
    return heading ? heading.textContent : null;
  }

  getSubtitleText(): string | null {
    const subtitleEl = this.elementToUse.querySelector('.font-geist-mono');
    return subtitleEl ? subtitleEl.textContent : null;
  }

  getBodyText(): string | null {
    const bodyEl = this.elementToUse.querySelector('.leading-relaxed');
    return bodyEl ? bodyEl.textContent : null;
  }

  getFooterText(): string | null {
    const footerEl = this.elementToUse.querySelector('.border-t.border-brand-clay');
    return footerEl ? footerEl.textContent : null;
  }

  hasCorrectStyle(): boolean {
    const classes = this.elementToUse.className;
    return (
      classes.includes('border-t') &&
      classes.includes('rounded-none') &&
      classes.includes('bg-transparent') &&
      !classes.includes('shadow')
    );
  }
}
