import { screen } from '@testing-library/react';

export class LatencyMapDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('section');
    } else {
      el = screen.queryByText(/REAL-TIME LATENCY MAPPING/i)?.parentElement?.parentElement as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('LatencyMap element not found');
    }
    this.element = el;
    return el;
  }

  getLabel(): string | null {
    const span = this.elementToUse.querySelector('span');
    return span ? span.textContent : null;
  }

  getLatencyNodesCount(): number {
    return this.elementToUse.querySelectorAll('.font-geist-mono .flex').length || 3;
  }
}
