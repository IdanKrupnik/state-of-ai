import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { InputField } from './InputField';
import { InputFieldDriver } from './InputField.driver';

describe('InputField Component', () => {
  it('should render correct placeholder and handle text input', () => {
    const handleChange = vi.fn();
    const { container } = render(<InputField placeholder="Enter name" onChange={handleChange} />);
    const driver = new InputFieldDriver(container);

    expect(driver.getValue()).toBe('');
    driver.setValue('John Doe');
    expect(handleChange).toHaveBeenCalled();
    expect(driver.getValue()).toBe('John Doe');
  });

  it('should render a label when provided', () => {
    const { container } = render(<InputField label="Username" id="user-input" />);
    const driver = new InputFieldDriver(container);

    expect(driver.getLabelText()).toBe('Username');
  });

  it('should support full border variant as default', () => {
    const { container } = render(<InputField />);
    const driver = new InputFieldDriver(container);

    expect(driver.isFullBorderVariant()).toBe(true);
    expect(driver.isBottomBorderVariant()).toBe(false);
  });

  it('should support bottom border variant when specified', () => {
    const { container } = render(<InputField variant="bottom" />);
    const driver = new InputFieldDriver(container);

    expect(driver.isBottomBorderVariant()).toBe(true);
    expect(driver.isFullBorderVariant()).toBe(false);
  });
});
