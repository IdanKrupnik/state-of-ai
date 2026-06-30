import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TuningDrawer } from './TuningDrawer';
import { TuningDrawerDriver } from './TuningDrawer.driver';

describe('TuningDrawer Component', () => {
  it('should render state open and handle interactions', () => {
    const handleClose = vi.fn();
    const { container } = render(<TuningDrawer isOpen={true} onClose={handleClose} />);
    const driver = new TuningDrawerDriver(container);

    expect(driver.isOpen()).toBe(true);

    driver.clickClose();
    expect(handleClose).toHaveBeenCalledTimes(1);

    expect(driver.isTabActive('Algorithm')).toBe(true);
    driver.clickTab('Weights');
    expect(driver.isTabActive('Weights')).toBe(true);
    expect(driver.isTabActive('Algorithm')).toBe(false);
  });
});
