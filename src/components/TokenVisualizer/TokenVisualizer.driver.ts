import { screen } from '@testing-library/react';

export class TokenVisualizerDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="token-visualizer"]');
    } else {
      el = screen.queryByTestId('token-visualizer');
    }
    
    if (!el) {
      throw new Error('TokenVisualizer element not found');
    }
    this.element = el;
    return el;
  }

  getTokenBoxes(): HTMLElement[] {
    return Array.from(this.elementToUse.querySelectorAll('[data-testid^="token-box-"]'));
  }

  getTokenText(index: number): string | null {
    const box = this.elementToUse.querySelector(`[data-testid="token-box-${index}"]`);
    if (!box) return null;
    const textSpan = box.querySelector('span:first-child');
    return textSpan ? textSpan.textContent : null;
  }

  getTokenId(index: number): string | null {
    const box = this.elementToUse.querySelector(`[data-testid="token-box-${index}"]`);
    if (!box) return null;
    const idSpan = box.querySelector('span:last-child');
    return idSpan ? idSpan.textContent : null;
  }
}
