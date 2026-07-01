import { screen } from '@testing-library/react';

export class EmbeddingVisualizerDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="embedding-visualizer"]');
    } else {
      el = screen.queryByTestId('embedding-visualizer');
    }
    
    if (!el) {
      throw new Error('EmbeddingVisualizer element not found');
    }
    this.element = el;
    return el;
  }

  getNodes(): HTMLElement[] {
    return Array.from(this.elementToUse.querySelectorAll('[data-testid^="node-"]'));
  }

  hasNode(label: string): boolean {
    return !!this.elementToUse.querySelector(`[data-testid="node-${label}"]`);
  }
}
