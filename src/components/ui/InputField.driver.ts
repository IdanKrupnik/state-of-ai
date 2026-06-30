import { fireEvent, screen } from '@testing-library/react';

export class InputFieldDriver {
  private element: HTMLInputElement | null = null;
  private labelElement: HTMLLabelElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLInputElement {
    if (this.element) return this.element;
    
    let el: HTMLInputElement | null = null;
    if (this.container) {
      el = this.container.querySelector('input');
    } else {
      el = screen.queryByRole('textbox') as HTMLInputElement | null;
    }
    
    if (!el) {
      throw new Error('InputField input element not found');
    }
    this.element = el;
    return el;
  }

  private get labelElementToUse(): HTMLLabelElement | null {
    if (this.labelElement) return this.labelElement;
    if (this.container) {
      this.labelElement = this.container.querySelector('label');
    }
    return this.labelElement;
  }

  getValue(): string {
    return this.elementToUse.value;
  }

  setValue(value: string): this {
    fireEvent.change(this.elementToUse, { target: { value } });
    return this;
  }

  getLabelText(): string | null {
    return this.labelElementToUse ? this.labelElementToUse.textContent : null;
  }

  isBottomBorderVariant(): boolean {
    const classes = this.elementToUse.className;
    return classes.includes('border-b') && !classes.includes('border ') && classes.includes('rounded-none');
  }

  isFullBorderVariant(): boolean {
    const classes = this.elementToUse.className;
    return classes.includes('border ') && classes.includes('rounded-none');
  }

  focus(): this {
    fireEvent.focus(this.elementToUse);
    return this;
  }

  blur(): this {
    fireEvent.blur(this.elementToUse);
    return this;
  }
}
