import { ButtonDriver } from '../ui/Button/Button.driver';
import { InputFieldDriver } from '../ui/InputField/InputField.driver';
import { screen } from '@testing-library/react';

export class SidebarNewsletterDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      if (this.container.getAttribute('data-testid') === 'sidebar-newsletter') {
        el = this.container;
      } else {
        el = this.container.querySelector('[data-testid="sidebar-newsletter"]') as HTMLElement | null;
      }
    } else {
      el = screen.queryByTestId('sidebar-newsletter') as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('SidebarNewsletter element not found');
    }
    this.element = el;
    return el;
  }

  getEmailInputDriver(): InputFieldDriver {
    const el = this.elementToUse.querySelector('#newsletter-email')?.parentElement as HTMLElement;
    return new InputFieldDriver(el);
  }

  getSubmitButtonDriver(): ButtonDriver {
    return new ButtonDriver(this.elementToUse);
  }

  getSuccessMessage(): string | null {
    const el = this.elementToUse.querySelector('[data-testid="success-message"]');
    return el ? el.textContent : null;
  }
}
