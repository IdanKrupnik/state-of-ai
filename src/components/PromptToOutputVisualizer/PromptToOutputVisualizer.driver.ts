import { fireEvent, screen } from '@testing-library/react';

export class PromptToOutputVisualizerDriver {
  private element: HTMLElement | null = null;

  constructor(private container?: HTMLElement) {}

  private get elementToUse(): HTMLElement {
    if (this.element) return this.element;
    
    let el: HTMLElement | null = null;
    if (this.container) {
      el = this.container.querySelector('[data-testid="prompt-to-output-visualizer"]');
    } else {
      el = screen.queryByTestId('prompt-to-output-visualizer');
    }
    
    if (!el) {
      throw new Error('PromptToOutputVisualizer element not found');
    }
    this.element = el;
    return el;
  }

  getPromptInput(): HTMLInputElement | null {
    return this.elementToUse.querySelector('[data-testid="prompt-input"]');
  }

  setPromptInput(text: string): this {
    const input = this.getPromptInput();
    if (!input) throw new Error('Input not found');
    fireEvent.change(input, { target: { value: text } });
    return this;
  }

  clickTab(stepNum: number): this {
    const tab = this.elementToUse.querySelector(`[data-testid="stepper-node-${stepNum}"]`) as HTMLButtonElement | null;
    if (!tab) throw new Error(`Stepper node ${stepNum} not found`);
    fireEvent.click(tab);
    return this;
  }

  getActiveStepTitle(): string | null {
    const contentArea = this.elementToUse.querySelector('[data-testid="step-content"]');
    if (!contentArea) return null;
    const h3 = contentArea.querySelector('h3');
    return h3 ? h3.textContent : null;
  }

  clickPreset(text: string): this {
    const normalized = text.replace(/\s+/g, '-').toLowerCase();
    const btn = this.elementToUse.querySelector(`[data-testid="preset-btn-${normalized}"]`) as HTMLButtonElement | null;
    if (!btn) throw new Error(`Preset button for "${text}" not found`);
    fireEvent.click(btn);
    return this;
  }

  isPresetActive(text: string): boolean {
    const normalized = text.replace(/\s+/g, '-').toLowerCase();
    const btn = this.elementToUse.querySelector(`[data-testid="preset-btn-${normalized}"]`);
    return btn ? btn.classList.contains('bg-brand-black') && btn.classList.contains('text-brand-offwhite') : false;
  }
}
