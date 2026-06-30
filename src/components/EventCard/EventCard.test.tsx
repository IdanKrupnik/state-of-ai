import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { EventCard } from './EventCard';
import { EventCardDriver } from './EventCard.driver';

describe('EventCard Component', () => {
  it('should render event details and respond to alert clicks when not live', () => {
    const handleToggleAlert = vi.fn();
    const { container } = render(
      <EventCard
        id="test-event"
        date="MAR 18-21, 2024"
        location="SAN JOSE, CA"
        isLive={false}
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
    expect(driver.isLiveIndicatorPresent()).toBe(false);
    expect(driver.isAlertInactiveIconPresent()).toBe(true);
    expect(driver.isAlertActiveIconPresent()).toBe(false);

    driver.clickAlertButton();
    expect(handleToggleAlert).toHaveBeenCalledWith('test-event');
  });

  it('should hide alert button when event is live', () => {
    const handleToggleAlert = vi.fn();
    const { container } = render(
      <EventCard
        id="test-event-live"
        date="MAR 18-21, 2024"
        location="SAN JOSE, CA"
        isLive={true}
        title="NVIDIA GTC 2024 Live"
        description="Live now."
        type="Type: Hardware / Compute"
        isAlertSet={false}
        onToggleAlert={handleToggleAlert}
      />
    );

    const driver = new EventCardDriver(container, 'test-event-live');
    expect(driver.getAlertButtonText()).toBeNull();
    expect(driver.isLiveIndicatorPresent()).toBe(true);
  });
});
