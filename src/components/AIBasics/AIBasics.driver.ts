import { screen } from '@testing-library/react';

export class AIBasicsDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="ai-basics-section"]');
    } else {
      el = screen.queryByTestId('ai-basics-section');
    }
    
    if (!el) {
      throw new Error('AIBasics element not found');
    }
    this.element = el;
    return el;
  }

  getTitle(): string | null {
    const header = this.elementToUse.querySelector('h2');
    return header ? header.textContent : null;
  }

  getSubtitle(): string | null {
    const subtitle = this.elementToUse.querySelector('p');
    return subtitle ? subtitle.textContent : null;
  }

  getConceptCard(conceptId: string): HTMLElement | null {
    return this.elementToUse.querySelector(`[data-testid="concept-card-${conceptId}"]`);
  }

  getConceptTitle(conceptId: string): string | null {
    const card = this.getConceptCard(conceptId);
    if (!card) return null;
    const title = card.querySelector('h3');
    return title ? title.textContent : null;
  }

  getConceptDescription(conceptId: string): string | null {
    const card = this.getConceptCard(conceptId);
    if (!card) return null;
    const desc = card.querySelector('p');
    return desc ? desc.textContent : null;
  }
}
