import { fireEvent, screen } from '@testing-library/react';

export class StepperDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="stepper"]');
    } else {
      el = screen.queryByTestId('stepper');
    }
    
    if (!el) {
      throw new Error('Stepper element not found');
    }
    this.element = el;
    return el;
  }

  clickStep(stepNum: number): this {
    const btn = this.elementToUse.querySelector(`[data-testid="stepper-node-${stepNum}"]`) as HTMLButtonElement | null;
    if (!btn) throw new Error(`Stepper node ${stepNum} not found`);
    fireEvent.click(btn);
    return this;
  }

  isStepActive(stepNum: number): boolean {
    const btn = this.elementToUse.querySelector(`[data-testid="stepper-node-${stepNum}"]`);
    return btn ? btn.classList.contains('bg-brand-black') && btn.classList.contains('scale-110') : false;
  }

  isStepCompleted(stepNum: number): boolean {
    const btn = this.elementToUse.querySelector(`[data-testid="stepper-node-${stepNum}"]`);
    return btn ? btn.classList.contains('bg-brand-black') && !btn.classList.contains('scale-110') : false;
  }
}
