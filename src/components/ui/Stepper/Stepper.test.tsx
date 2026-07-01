import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Stepper } from './Stepper';
import { StepperDriver } from './Stepper.driver';

describe('Stepper Component', () => {
  it('should render nodes, labels, and handle click events', () => {
    const handleStepChange = vi.fn();
    const steps = ['One', 'Two', 'Three'];
    const { container } = render(
      <Stepper steps={steps} currentStep={2} onStepChange={handleStepChange} />
    );
    const driver = new StepperDriver(container);

    expect(driver.isStepCompleted(1)).toBe(true);
    expect(driver.isStepActive(2)).toBe(true);
    expect(driver.isStepActive(3)).toBe(false);

    expect(driver.getStepLabel(1)).toBe('One');
    expect(driver.getStepLabel(2)).toBe('Two');
    expect(driver.getStepLabel(3)).toBe('Three');

    driver.clickStep(3);
    expect(handleStepChange).toHaveBeenCalledWith(3);
  });
});
