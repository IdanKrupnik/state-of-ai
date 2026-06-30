import { screen } from '@testing-library/react';

export class SystemStatusDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.firstElementChild as HTMLElement;
    } else {
      el = screen.queryByTestId('status-dot')?.parentElement as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('SystemStatus element not found');
    }
    this.element = el;
    return el;
  }

  getLabel(): string | null {
    const textNode = this.elementToUse.lastElementChild;
    return textNode ? textNode.textContent : null;
  }

  isActive(): boolean {
    const dot = this.elementToUse.querySelector('[data-testid="status-dot"]');
    if (!dot) return false;
    return dot.className.includes('bg-brand-neon-green');
  }

  hasCorrectStyle(): boolean {
    const rootClasses = this.elementToUse.className;
    const dot = this.elementToUse.querySelector('[data-testid="status-dot"]');
    if (!dot) return false;
    
    const dotClasses = dot.className;
    return (
      rootClasses.includes('font-geist-mono') &&
      dotClasses.includes('w-2') &&
      dotClasses.includes('h-2') &&
      dotClasses.includes('rounded-full') // Dot must be a circle!
    );
  }
}
