import { MetadataTagDriver } from '../ui/MetadataTag/MetadataTag.driver';
import { screen } from '@testing-library/react';

export class FeedHeaderDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      if (this.container.getAttribute('data-testid') === 'feed-header') {
        el = this.container;
      } else {
        el = this.container.querySelector('[data-testid="feed-header"]') as HTMLElement | null;
      }
    } else {
      el = screen.queryByTestId('feed-header') as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('FeedHeader element not found');
    }
    this.element = el;
    return el;
  }

  getTitleText(): string | null {
    const heading = this.elementToUse.querySelector('h1');
    return heading ? heading.textContent : null;
  }

  getDescriptionText(): string | null {
    const p = this.elementToUse.querySelector('p');
    return p ? p.textContent : null;
  }

  getMetadataTagDriver(): MetadataTagDriver {
    return new MetadataTagDriver(this.elementToUse);
  }
}
