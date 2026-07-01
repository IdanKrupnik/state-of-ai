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

    expect(initialCards[0].getAlertButtonText()).toBe('[ NOTIFY ME ]');

    expect(initialCards[1].getAlertButtonText()).toBe('[ NOTIFY ME ]');
    act(() => {
      initialCards[1].clickAlertButton();
    });
    expect(initialCards[1].getAlertButtonText()).toBe('[ ALERT ACTIVE ]');

    expect(driver.hasPastEventsLog()).toBe(true);
    expect(driver.isPastEventDetailsVisible('openai-devday-2023')).toBe(false);

    act(() => {
      driver.clickPastEventDetails('openai-devday-2023');
    });
    expect(driver.isPastEventDetailsVisible('openai-devday-2023')).toBe(true);
    expect(driver.getPastEventYoutubeLink('openai-devday-2023')).toBe('https://youtube.com');
    expect(driver.getPastEventSummary('openai-devday-2023')).toContain('Unveiled GPT-4 Turbo');

    act(() => {
      driver.clickPastEventDetails('openai-devday-2023');
    });
    expect(driver.isPastEventDetailsVisible('openai-devday-2023')).toBe(false);
  });
});
