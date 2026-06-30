import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SidebarNewsletter } from './SidebarNewsletter';
import { SidebarNewsletterDriver } from './SidebarNewsletter.driver';

describe('SidebarNewsletter Component', () => {
  it('should allow user to enter email and trigger subscription', () => {
    const handleSubscribe = vi.fn();
    const { container } = render(<SidebarNewsletter onSubscribe={handleSubscribe} />);
    const driver = new SidebarNewsletterDriver(container);

    const input = driver.getEmailInputDriver();
    const submitBtn = driver.getSubmitButtonDriver();

    input.setValue('user@example.com');
    submitBtn.click();

    expect(handleSubscribe).toHaveBeenCalledWith('user@example.com');
    expect(driver.getSuccessMessage()).toBe('✓ Subscribed successfully!');
  });
});
