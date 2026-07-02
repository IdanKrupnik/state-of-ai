import { fireEvent, screen } from '@testing-library/react';

export class FeedRowDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.getAttribute('data-testid') === 'feed-row'
        ? this.container
        : this.container.querySelector('[data-testid="feed-row"]');
    } else {
      el = screen.queryByTestId('feed-row');
    }
    
    if (!el) {
      throw new Error('FeedRow element not found');
    }
    this.element = el;
    return el;
  }

  toggle(): this {
    fireEvent.click(this.elementToUse);
    return this;
  }

  getTitleText(): string | null {
    const heading = this.elementToUse.querySelector('h4');
    return heading ? heading.textContent : null;
  }

  getTimestampText(): string | null {
    const span = this.elementToUse.querySelector('.font-label-mono.text-brand-warm-grey');
    return span ? span.textContent : null;
  }

  isContentVisible(): boolean {
    const content = this.elementToUse.querySelector('[data-testid="feed-row-content"]');
    if (!content) return false;
    return !content.className.includes('hidden');
  }

  getContentText(): string | null {
    const content = this.elementToUse.querySelector('[data-testid="feed-row-content"]');
    return content ? content.textContent : null;
  }

  hasImage(): boolean {
    return !!this.elementToUse.querySelector('[data-testid="feed-row-image"]');
  }

  getImageSrc(): string | null {
    const img = this.elementToUse.querySelector('[data-testid="feed-row-image"]');
    return img ? img.getAttribute('src') : null;
  }
}
