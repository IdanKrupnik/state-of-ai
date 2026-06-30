import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SystemStatus } from './SystemStatus';
import { SystemStatusDriver } from './SystemStatus.driver';

describe('SystemStatus Component', () => {
  it('should render default label and active state correctly', () => {
    const { container } = render(<SystemStatus />);
    const driver = new SystemStatusDriver(container);

    expect(driver.getLabel()).toBe('LIVE');
    expect(driver.isActive()).toBe(true);
    expect(driver.hasCorrectStyle()).toBe(true);
  });

  it('should render custom label and active state', () => {
    const { container } = render(<SystemStatus label="CONNECTED" isActive={true} />);
    const driver = new SystemStatusDriver(container);

    expect(driver.getLabel()).toBe('CONNECTED');
    expect(driver.isActive()).toBe(true);
  });

  it('should render inactive state', () => {
    const { container } = render(<SystemStatus label="OFFLINE" isActive={false} />);
    const driver = new SystemStatusDriver(container);

    expect(driver.getLabel()).toBe('OFFLINE');
    expect(driver.isActive()).toBe(false);
  });
});
