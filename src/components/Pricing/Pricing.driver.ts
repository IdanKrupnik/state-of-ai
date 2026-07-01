import { screen } from '@testing-library/react';

export class PricingDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.firstElementChild as HTMLElement;
    } else {
      el = screen.queryByTestId('pricing-container');
    }
    
    if (!el) {
      throw new Error('Pricing element not found');
    }
    this.element = el;
    return el;
  }

  getPriceText(): string {
    return this.elementToUse.querySelector('.text-4xl')?.textContent || '';
  }

  hasFreePlanCard(): boolean {
    return !!this.elementToUse.querySelector('[data-testid="free-button"]');
  }

  hasProPlanCard(): boolean {
    return !!this.elementToUse.querySelector('[data-testid="subscribe-button"]');
  }

  hasSubscribeButton(): boolean {
    return this.hasProPlanCard();
  }

  isSubscribeButtonDisabled(): boolean {
    const btn = this.elementToUse.querySelector('[data-testid="subscribe-button"]') as HTMLButtonElement;
    return btn ? btn.disabled : false;
  }
}
