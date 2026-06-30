import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from './Button';
import { ButtonDriver } from './Button.driver';

describe('Button Component', () => {
  it('should render children content correctly', () => {
    const { container } = render(<Button>Click me</Button>);
    const driver = new ButtonDriver(container);

    expect(driver.getText()).toBe('Click me');
  });

  it('should render as primary by default', () => {
    const { container } = render(<Button>Primary</Button>);
    const driver = new ButtonDriver(container);

    expect(driver.isPrimary()).toBe(true);
    expect(driver.isSecondary()).toBe(false);
  });

  it('should render as secondary variant when specified', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const driver = new ButtonDriver(container);

    expect(driver.isSecondary()).toBe(true);
    expect(driver.isPrimary()).toBe(false);
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    const { container } = render(<Button onClick={handleClick}>Click</Button>);
    const driver = new ButtonDriver(container);

    driver.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should respect disabled state', () => {
    const handleClick = vi.fn();
    const { container } = render(<Button disabled onClick={handleClick}>Disabled</Button>);
    const driver = new ButtonDriver(container);

    expect(driver.isDisabled()).toBe(true);
    
    try {
      driver.click();
    } catch {
    }
    expect(handleClick).not.toHaveBeenCalled();
  });
});
