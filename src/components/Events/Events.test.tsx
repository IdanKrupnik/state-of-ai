import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { Events } from './Events';
import { EventsDriver } from './Events.driver';

describe('Events Component', () => {
  it('should render all events initially, filter correctly, and toggle alert state', () => {
    const { container } = render(<Events />);
    const driver = new EventsDriver(container);

    expect(driver.hasEventsSection()).toBe(true);

    const initialCards = driver.getEventCardDrivers();
    expect(initialCards).toHaveLength(4);
    expect(initialCards[0].getTitle()).toBe('NVIDIA GTC 2024');
    expect(initialCards[1].getTitle()).toBe('Google I/O');
    expect(initialCards[2].getTitle()).toBe('OpenAI DevDay');
    expect(initialCards[3].getTitle()).toBe('Apple WWDC24');

    act(() => {
      driver.clickCategory('HARDWARE_ARCH');
    });
    const hardwareCards = driver.getEventCardDrivers();
    expect(hardwareCards).toHaveLength(1);
    expect(hardwareCards[0].getTitle()).toBe('NVIDIA GTC 2024');

    act(() => {
      driver.clickCategory('DEVELOPER_OPS');
    });
    const devOpsCards = driver.getEventCardDrivers();
    expect(devOpsCards).toHaveLength(2);
    expect(devOpsCards[0].getTitle()).toBe('Google I/O');
    expect(devOpsCards[1].getTitle()).toBe('OpenAI DevDay');

    expect(devOpsCards[0].getAlertButtonText()).toBe('[ SET ALERT ]');
    act(() => {
      devOpsCards[0].clickAlertButton();
    });
    expect(devOpsCards[0].getAlertButtonText()).toBe('[ ALERT SET ]');
  });
});
