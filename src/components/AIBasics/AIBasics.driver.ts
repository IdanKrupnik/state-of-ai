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
    const header = this.elementToUse.querySelector('h1');
    return header ? header.textContent : null;
  }

  getSubtitle(): string | null {
    const subtitle = this.elementToUse.querySelector('p');
    return subtitle ? subtitle.textContent : null;
  }

  getSectionTitle(index: number): string | null {
    const headers = Array.from(this.elementToUse.querySelectorAll('h2'));
    return headers[index] ? headers[index].textContent : null;
  }

  getLatencyText(): string | null {
    const latencyEl = this.elementToUse.querySelector('[data-testid="latency-value"]');
    return latencyEl ? latencyEl.textContent : null;
  }

  getDatacenterTopologyImageAlt(): string | null {
    const img = this.elementToUse.querySelector('img');
    return img ? img.getAttribute('alt') : null;
  }

  hasTOC(): boolean {
    return !!this.elementToUse.querySelector('[data-testid="learn-toc"]');
  }

  getTOCLinks(): string[] {
    const toc = this.elementToUse.querySelector('[data-testid="learn-toc"]');
    if (!toc) return [];
    const anchors = Array.from(toc.querySelectorAll('a'));
    return anchors.map(a => a.textContent || '');
  }

  hasMobileTOC(): boolean {
    return !!this.elementToUse.querySelector('[data-testid="learn-toc-mobile-container"]');
  }

  clickMobileTOCToggle(): void {
    const btn = this.elementToUse.querySelector('[data-testid="learn-toc-mobile-toggle"]') as HTMLButtonElement | null;
    if (btn) {
      btn.click();
    }
  }

  isMobileTOCDropdownVisible(): boolean {
    return !!this.elementToUse.querySelector('[data-testid="learn-toc-mobile-dropdown"]');
  }

  getMobileTOCLinks(): string[] {
    const dropdown = this.elementToUse.querySelector('[data-testid="learn-toc-mobile-dropdown"]');
    if (!dropdown) return [];
    const anchors = Array.from(dropdown.querySelectorAll('a'));
    return anchors.map(a => a.textContent?.trim() || '');
  }

  clickMobileTOCClose(): void {
    const btn = this.elementToUse.querySelector('[aria-label="Close index"]') as HTMLButtonElement | null;
    if (btn) {
      btn.click();
    }
  }

  clickMobileTOCBackdrop(): void {
    const el = this.elementToUse.querySelector('[data-testid="learn-toc-mobile-backdrop"]') as HTMLElement | null;
    if (el) {
      el.click();
    }
  }
}
