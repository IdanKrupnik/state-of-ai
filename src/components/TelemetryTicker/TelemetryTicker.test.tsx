import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TelemetryTicker } from './TelemetryTicker';
import { TelemetryTickerDriver } from './TelemetryTicker.driver';

describe('TelemetryTicker Component', () => {
  it('should render custom values correctly', () => {
    const { container } = render(
      <TelemetryTicker
        scannedTime="10m ago"
        bestModel="Gemini 2.0"
        marketIndex="99.9%"
        latestBlock="#B-001"
      />
    );
    const driver = new TelemetryTickerDriver(container);

    expect(driver.getTickerText()).toContain('Gemini 2.0');
    expect(driver.getTickerText()).toContain('99.9%');
    expect(driver.getTickerText()).toContain('#B-001');
    expect(driver.getTickerText()).toContain('(10m ago)');

    const statusDriver = driver.getSystemStatusDriver();
    expect(statusDriver.getLabel()).toBe('Pipeline Active');
  });
});
