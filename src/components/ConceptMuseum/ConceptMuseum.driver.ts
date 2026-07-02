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
}
