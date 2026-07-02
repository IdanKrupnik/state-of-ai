import { fireEvent } from '@testing-library/react';

export class ConceptMuseumDriver {
  constructor(private elementToUse: HTMLElement) {}

  getLaunchButton(): HTMLElement | null {
    return this.elementToUse.querySelector('[data-testid="launch-museum-btn"]');
  }

  clickLaunch(): this {
    const btn = this.getLaunchButton();
    if (!btn) throw new Error('Launch button not found');
    fireEvent.click(btn);
    return this;
  }

  isOverlayOpen(): boolean {
    return !!document.body.querySelector('[data-testid="museum-overlay"]');
  }

  getOverlay(): HTMLElement | null {
    return document.body.querySelector('[data-testid="museum-overlay"]');
  }

  getCloseButton(): HTMLElement | null {
    const overlay = this.getOverlay();
    return overlay ? overlay.querySelector('[data-testid="close-museum-btn"]') : null;
  }

  clickClose(): this {
    const btn = this.getCloseButton();
    if (!btn) throw new Error('Close button not found');
    fireEvent.click(btn);
    return this;
  }

  getFullscreenButton(): HTMLElement | null {
    const overlay = this.getOverlay();
    return overlay ? overlay.querySelector('[data-testid="fullscreen-toggle-btn"]') : null;
  }

  clickFullscreen(): this {
    const btn = this.getFullscreenButton();
    if (!btn) throw new Error('Fullscreen button not found');
    fireEvent.click(btn);
    return this;
  }

  hasCanvas(): boolean {
    const overlay = this.getOverlay();
    return !!(overlay && overlay.querySelector('[data-testid="museum-canvas"]'));
  }

  getPrevStepButton(): HTMLElement | null {
    const overlay = this.getOverlay();
    return overlay ? overlay.querySelector('[data-testid="prev-step-btn"]') : null;
  }

  getNextStepButton(): HTMLElement | null {
    const overlay = this.getOverlay();
    return overlay ? overlay.querySelector('[data-testid="next-step-btn"]') : null;
  }

  clickPrevStep(): this {
    const btn = this.getPrevStepButton();
    if (btn) fireEvent.click(btn);
    return this;
  }

  clickNextStep(): this {
    const btn = this.getNextStepButton();
    if (btn) fireEvent.click(btn);
    return this;
  }

  getStepTitleText(): string | null {
    const overlay = this.getOverlay();
    if (!overlay) return null;
    const h4 = overlay.querySelector('h4');
    return h4 ? h4.textContent : null;
  }
}
