import { screen } from '@testing-library/react';

export class MetadataTagDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('span');
    } else {
      // Find element by text content or look for standard tags
      el = screen.queryByText((_, element) => element?.tagName.toLowerCase() === 'span') as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('MetadataTag element not found');
    }
    this.element = el;
    return el;
  }

  getText(): string | null {
    return this.elementToUse.textContent;
  }

  hasCorrectStyle(): boolean {
    const classes = this.elementToUse.className;
    return (
      classes.includes('bg-brand-clay') &&
      classes.includes('text-brand-warm-grey') &&
      classes.includes('font-geist-mono') &&
      classes.includes('rounded-none')
    );
  }
}
