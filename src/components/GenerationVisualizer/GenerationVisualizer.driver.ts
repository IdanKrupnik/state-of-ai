import { screen } from '@testing-library/react';

export class GenerationVisualizerDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="generation-visualizer"]');
    } else {
      el = screen.queryByTestId('generation-visualizer');
    }
    
    if (!el) {
      throw new Error('GenerationVisualizer element not found');
    }
    this.element = el;
    return el;
  }

  getCandidatesCount(): number {
    return this.elementToUse.querySelectorAll('[data-testid^="candidate-row-"]').length;
  }

  getPredictedTokenSpan(): HTMLSpanElement | null {
    return this.elementToUse.querySelector('[data-testid="predicted-token"]');
  }

  getCandidateText(index: number): string | null {
    const row = this.elementToUse.querySelector(`[data-testid="candidate-row-${index}"]`);
    if (!row) return null;
    const tokenSpan = row.querySelector('span:first-child');
    return tokenSpan ? tokenSpan.textContent : null;
  }
}
