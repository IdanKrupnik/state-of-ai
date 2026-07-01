import { fireEvent, screen } from '@testing-library/react';

export class TerminologyDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="terminology-section"]');
    } else {
      el = screen.queryByTestId('terminology-section');
    }
    
    if (!el) {
      throw new Error('Terminology element not found');
    }
    this.element = el;
    return el;
  }

  getSearchInput(): HTMLInputElement {
    const input = this.elementToUse.querySelector('[data-testid="terminology-search-input"]') || this.elementToUse.querySelector('input');
    if (!input) {
      throw new Error('Search input not found');
    }
    return input as HTMLInputElement;
  }

  setSearchQuery(query: string): this {
    fireEvent.change(this.getSearchInput(), { target: { value: query } });
    return this;
  }

  getTermsCount(): number {
    const grid = this.elementToUse.querySelector('[data-testid="terminology-grid"]');
    if (!grid) return 0;
    return grid.children.length;
  }

  getTermTitles(): string[] {
    const headers = Array.from(this.elementToUse.querySelectorAll('h3'));
    return headers.map(h => h.textContent?.trim() || '');
  }

  hasEmptyState(): boolean {
    return !!this.elementToUse.querySelector('[data-testid="terminology-empty-state"]');
  }

  getEmptyStateText(): string | null {
    const el = this.elementToUse.querySelector('[data-testid="terminology-empty-state"]');
    return el ? el.textContent?.trim() || null : null;
  }

  selectLetter(letter: string): this {
    const tabName = letter.toLowerCase();
    const selector = `[data-testid="letter-tab-${tabName}"]`;
    const btn = this.elementToUse.querySelector(selector);
    if (!btn) {
      throw new Error(`Letter tab ${letter} not found`);
    }
    fireEvent.click(btn);
    return this;
  }

  getSelectedLetter(): string | null {
    const tabs = Array.from(this.elementToUse.querySelectorAll('[data-testid^="letter-tab-"]'));
    const activeTab = tabs.find(tab => tab.classList.contains('bg-brand-black'));
    if (!activeTab) return null;
    return activeTab.textContent?.trim() || null;
  }

  isLetterDisabled(letter: string): boolean {
    const tabName = letter.toLowerCase();
    const selector = `[data-testid="letter-tab-${tabName}"]`;
    const btn = this.elementToUse.querySelector(selector) as HTMLButtonElement | null;
    if (!btn) {
      throw new Error(`Letter tab ${letter} not found`);
    }
    return btn.disabled;
  }
}

