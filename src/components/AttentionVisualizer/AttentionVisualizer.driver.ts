import { screen } from '@testing-library/react';

export class AttentionVisualizerDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="attention-visualizer"]');
    } else {
      el = screen.queryByTestId('attention-visualizer');
    }
    
    if (!el) {
      throw new Error('AttentionVisualizer element not found');
    }
    this.element = el;
    return el;
  }

  getL1Nodes(): HTMLElement[] {
    return Array.from(this.elementToUse.querySelectorAll('[data-testid^="l1-node-"]'));
  }

  getL2Nodes(): HTMLElement[] {
    return Array.from(this.elementToUse.querySelectorAll('[data-testid^="l2-node-"]'));
  }

  getL3Nodes(): HTMLElement[] {
    return Array.from(this.elementToUse.querySelectorAll('[data-testid^="l3-node-"]'));
  }

  getLaserLines(): HTMLElement[] {
    return Array.from(this.elementToUse.querySelectorAll('[data-testid="laser-line"]'));
  }
}
