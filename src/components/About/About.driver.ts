import { screen } from '@testing-library/react';

export class AboutDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;

    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.getAttribute('data-testid') === 'about-section'
        ? this.container
        : this.container.querySelector('[data-testid="about-section"]');
    } else {
      el = screen.queryByTestId('about-section');
    }

    if (!el) {
      throw new Error('About section element not found');
    }
    this.element = el;
    return el;
  }

  hasSection(): boolean {
    try {
      return !!this.elementToUse;
    } catch {
      return false;
    }
  }

  getTitleText(): string | null {
    const title = this.elementToUse.querySelector('h1');
    return title ? title.textContent : null;
  }

  getMissionHeadingText(): string | null {
    const headings = Array.from(this.elementToUse.querySelectorAll('h3'));
    const missionHeading = headings.find(h => h.textContent?.includes('AI for Everyone'));
    return missionHeading ? missionHeading.textContent : null;
  }
}
