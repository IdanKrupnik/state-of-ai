import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { EventCard } from './EventCard';
import { EventCardDriver } from './EventCard.driver';

describe('EventCard Component', () => {
  it('should render event details and respond to alert clicks', () => {
    const handleToggleAlert = vi.fn();
    const { container } = render(
      <EventCard
        id="test-event"
        date="MAR 18-21, 2024"
        location="SAN JOSE, CA"
        isLive={true}
        title="NVIDIA GTC 2024"
        description="The Woodstock of AI."
        type="Type: Hardware / Compute"
        isAlertSet={false}
        onToggleAlert={handleToggleAlert}
      />
    );

    const driver = new EventCardDriver(container, 'test-event');

    expect(driver.getTitle()).toBe('NVIDIA GTC 2024');
    expect(driver.getDescription()).toBe('The Woodstock of AI.');
    expect(driver.getTypeText()).toBe('Type: Hardware / Compute');
    expect(driver.getAlertButtonText()).toBe('[ NOTIFY ME ]');
    expect(driver.isLiveIndicatorPresent()).toBe(true);
    expect(driver.getLiveStreamLink()).toBe('https://youtube.com');

    driver.clickAlertButton();
    expect(handleToggleAlert).toHaveBeenCalledWith('test-event');
  });
});
