import { screen } from '@testing-library/react';

export class EventCardDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement, private id?: string) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.id) {
      if (this.container) {
        el = this.container.querySelector(`[data-testid="event-card-${this.id}"]`);
      } else {
        el = screen.queryByTestId(`event-card-${this.id}`);
      }
    } else {
      if (this.container) {
        el = this.container.querySelector('article');
      } else {
        el = screen.queryByRole('article');
      }
    }
    
    if (!el) {
      throw new Error('EventCard element not found');
    }
    this.element = el;
    return el;
  }

  getTitle(): string | null {
    const h2 = this.elementToUse.querySelector('h2');
    return h2 ? h2.textContent : null;
  }

  getDescription(): string | null {
    const p = this.elementToUse.querySelector('p');
    return p ? p.textContent : null;
  }

  getTypeText(): string | null {
    const typeEl = this.elementToUse.querySelector('.mt-4 span');
    return typeEl ? typeEl.textContent : null;
  }

  getAlertButtonText(): string | null {
    const btn = this.elementToUse.querySelector('button');
    return btn ? btn.textContent : null;
  }

  clickAlertButton(): void {
    const btn = this.elementToUse.querySelector('button');
    if (btn) {
      btn.click();
    }
  }

  isLiveIndicatorPresent(): boolean {
    return !!this.elementToUse.querySelector('[data-testid="live-indicator"]');
  }

  getLiveStreamLink(): string | null {
    const link = this.elementToUse.querySelector('[data-testid="live-stream-link"]');
    return link ? link.getAttribute('href') : null;
  }
}
