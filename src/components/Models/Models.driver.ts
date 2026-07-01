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
    return Array.from(group.querySelectorAll('[data-testid^="model-row-"]')) as HTMLElement[];
  }

  getModelName(row: HTMLElement): string {
    return row.querySelector('span.font-bold')?.textContent?.trim() || '';
  }

  getContextText(row: HTMLElement): string {
    const spans = row.querySelectorAll('div.font-geist-mono span');
    return spans[0]?.textContent?.trim() || '';
  }

  getPriceText(row: HTMLElement): string {
    const spans = row.querySelectorAll('div.font-geist-mono span');
    return spans[1]?.textContent?.trim() || '';
  }

  getDescriptionText(row: HTMLElement): string {
    return row.querySelector('p.text-brand-warm-grey')?.textContent?.trim() || '';
  }

  hasNewBadge(row: HTMLElement): boolean {
    const spans = Array.from(row.querySelectorAll('span'));
    return spans.some((s) => s.textContent?.trim() === 'New Model');
  }
}
