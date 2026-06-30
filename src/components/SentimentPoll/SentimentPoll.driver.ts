import { screen } from '@testing-library/react';

export class SentimentPollDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('section');
    } else {
      el = screen.queryByText(/CURRENT SENTIMENT INDEX/i)?.parentElement as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('SentimentPoll element not found');
    }
    this.element = el;
    return el;
  }

  getQuestionText(): string | null {
    const heading = this.elementToUse.querySelector('h3');
    return heading ? heading.textContent : null;
  }

  getOptions() {
    const options = this.elementToUse.querySelectorAll('[data-testid="sentiment-option"]');
    return Array.from(options).map((opt) => {
      const label = opt.querySelector('span:first-child')?.textContent || '';
      const percentage = opt.querySelector('span:last-child')?.textContent || '';
      const fill = opt.querySelector('[data-testid="bar-fill"]') as HTMLElement | null;
      const width = fill ? fill.style.width : '';
      return { label, percentage, width };
    });
  }
}
