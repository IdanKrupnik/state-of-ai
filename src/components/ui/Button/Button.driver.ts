import { fireEvent, screen } from '@testing-library/react';

export class ButtonDriver {
  private element: HTMLButtonElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLButtonElement {
    if (this.element) return this.element;
    
    let el: HTMLButtonElement | null = null;
    if (this.container) {
      el = this.container.querySelector('button');
    } else {
      el = screen.queryByRole('button') as HTMLButtonElement | null;
    }
    
    if (!el) {
      throw new Error('Button element not found');
    }
    this.element = el;
    return el;
  }

  click(): this {
    fireEvent.click(this.elementToUse);
    return this;
  }

  isDisabled(): boolean {
    return this.elementToUse.disabled;
  }

  getText(): string | null {
    return this.elementToUse.textContent;
  }

  isPrimary(): boolean {
    const classes = this.elementToUse.className;
    return classes.includes('bg-brand-black') && classes.includes('text-brand-offwhite') && classes.includes('rounded-none');
  }

  isSecondary(): boolean {
    const classes = this.elementToUse.className;
    return classes.includes('bg-transparent') && classes.includes('text-brand-black') && classes.includes('rounded-none');
  }
}
