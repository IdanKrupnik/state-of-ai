import { screen } from '@testing-library/react';

export class AIBubbleTensionIndexDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;

    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.getAttribute('data-testid') === 'bubble-index-widget'
        ? this.container
        : this.container.querySelector('[data-testid="bubble-index-widget"]');
    } else {
      el = screen.queryByTestId('bubble-index-widget');
    }

    if (!el) {
      throw new Error('AIBubbleTensionIndex element not found');
    }
    this.element = el;
    return el;
  }

  hasWidget(): boolean {
    try {
      return !!this.elementToUse;
    } catch {
      return false;
    }
  }

  getTitle(): string | null {
    const title = this.elementToUse.querySelector('h2');
    return title ? title.textContent : null;
  }

  getBubblePercentageText(): string | null {
    const textEl = this.elementToUse.querySelector('.text-5xl');
    return textEl ? textEl.textContent : null;
  }

  getTrackerPin(): HTMLElement | null {
    return this.elementToUse.querySelector('[data-testid="tracker-pin"]');
  }

  getExplanationText(): string | null {
    const el = this.elementToUse.querySelector('[data-testid="explanation-text"]');
    return el ? el.textContent : null;
  }

  getHighlightText(index: number): string | null {
    const el = this.elementToUse.querySelector(`[data-testid="highlight-item-${index}"]`);
    return el ? el.textContent : null;
  }
}
