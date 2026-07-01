import { fireEvent, screen } from '@testing-library/react';

export class CollapsibleFundamentalsDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="collapsible-fundamentals"]');
    } else {
      el = screen.queryByTestId('collapsible-fundamentals');
    }
    
    if (!el) {
      throw new Error('CollapsibleFundamentals element not found');
    }
    this.element = el;
    return el;
  }

  toggle(): this {
    const summary = this.elementToUse.querySelector('summary');
    if (!summary) throw new Error('Summary element not found');
    fireEvent.click(summary);
    return this;
  }

  isOpen(): boolean {
    const details = this.elementToUse.querySelector('details');
    return details ? details.open : false;
  }

  getSummaryText(): string | null {
    const summary = this.elementToUse.querySelector('summary');
    return summary ? summary.textContent : null;
  }

  getContentText(): string | null {
    const body = this.elementToUse.querySelector('.px-4.pb-6');
    return body ? body.textContent : null;
  }
}
