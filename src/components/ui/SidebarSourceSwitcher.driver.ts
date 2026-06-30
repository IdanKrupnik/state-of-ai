import { fireEvent, screen } from '@testing-library/react';

export class SidebarSourceSwitcherDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.firstElementChild as HTMLElement;
    } else {
      // Find switcher root
      el = screen.queryByTestId(/source-/i)?.parentElement as HTMLElement | null;
    }
    
    if (!el) {
      throw new Error('SidebarSourceSwitcher element not found');
    }
    this.element = el;
    return el;
  }

  private getItemButton(id: string): HTMLButtonElement {
    const btn = this.elementToUse.querySelector(`[data-testid="source-${id}"]`) as HTMLButtonElement | null;
    if (!btn) {
      throw new Error(`Item button with id "${id}" not found`);
    }
    return btn;
  }

  clickItem(id: string): this {
    fireEvent.click(this.getItemButton(id));
    return this;
  }

  isActive(id: string): boolean {
    const btn = this.getItemButton(id);
    const classes = btn.className;
    return classes.includes('text-brand-neon-green');
  }

  getItemText(id: string): string | null {
    const btn = this.getItemButton(id);
    return btn.textContent;
  }

  hasNeonGreenActiveAccent(id: string): boolean {
    const btn = this.getItemButton(id);
    const indicator = btn.querySelector(`[data-testid="indicator-${id}"]`);
    return !!indicator && indicator.className.includes('bg-brand-neon-green');
  }

  hasCorrectStyle(): boolean {
    const rootClasses = this.elementToUse.className;
    const allButtons = this.elementToUse.querySelectorAll('button');
    let buttonsCorrect = true;
    allButtons.forEach((btn) => {
      if (!btn.className.includes('rounded-none')) {
        buttonsCorrect = false;
      }
    });

    return rootClasses.includes('font-geist-mono') && buttonsCorrect;
  }
}
