import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConceptMuseum } from './ConceptMuseum';
import { ConceptMuseumDriver } from './ConceptMuseum.driver';

describe('ConceptMuseum', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      writable: true,
      configurable: true,
    });
    HTMLElement.prototype.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render the launch CTA and handle the open/close museum lifecycle', () => {
    const { container } = render(<ConceptMuseum />);
    const driver = new ConceptMuseumDriver(container);
    expect(driver.getLaunchButton()).not.toBeNull();
    expect(driver.isOverlayOpen()).toBe(false);
    driver.clickLaunch();
    expect(driver.isOverlayOpen()).toBe(true);
    expect(driver.hasCanvas()).toBe(true);
    driver.clickClose();
    expect(driver.isOverlayOpen()).toBe(false);
  });

  it('should support fullscreen toggling when overlay is open', () => {
    const { container } = render(<ConceptMuseum />);
    const driver = new ConceptMuseumDriver(container);
    driver.clickLaunch();
    expect(driver.isOverlayOpen()).toBe(true);
    driver.clickFullscreen();
    expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalled();
    driver.clickClose();
  });

  it('should support step-by-step navigation in the neural net explorer', () => {
    const { container } = render(<ConceptMuseum />);
    const driver = new ConceptMuseumDriver(container);
    driver.clickLaunch();
    expect(driver.isOverlayOpen()).toBe(true);
    driver.clickBeginJourney();
    expect(driver.getStepTitleText()).toBe('Phase 1: Input Text Parsing');
    driver.clickNextStep();
    expect(driver.getStepTitleText()).toBe('Phase 2: Tokenization & Vocab Mapping');
    driver.clickNextStep();
    expect(driver.getStepTitleText()).toBe('Phase 3: Coordinate Vector Embeddings');
    driver.clickPrevStep();
    expect(driver.getStepTitleText()).toBe('Phase 2: Tokenization & Vocab Mapping');
    driver.clickClose();
  });
});
