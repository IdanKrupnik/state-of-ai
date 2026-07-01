import { screen } from '@testing-library/react';

export class ModelsDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.firstElementChild as HTMLElement;
    } else {
      el = screen.queryByTestId('models-container');
    }
    
    if (!el) {
      throw new Error('Models element not found');
    }
    this.element = el;
    return el;
  }

  hasProviderGroup(provider: string): boolean {
    return !!this.elementToUse.querySelector(`[data-testid="provider-group-${provider.toLowerCase()}"]`);
  }

  getModelRows(provider: string): HTMLElement[] {
    const group = this.elementToUse.querySelector(`[data-testid="provider-group-${provider.toLowerCase()}"]`);
    if (!group) return [];
    return Array.from(group.querySelectorAll('tbody tr')) as HTMLElement[];
  }

  getModelName(row: HTMLElement): string {
    return row.children[0]?.textContent?.trim() || '';
  }

  getContextText(row: HTMLElement): string {
    return row.children[1]?.textContent?.trim() || '';
  }

  getPriceText(row: HTMLElement): string {
    return row.children[2]?.textContent?.trim() || '';
  }

  getDescriptionText(row: HTMLElement): string {
    return row.children[3]?.textContent?.trim() || '';
  }
}
