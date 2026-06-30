import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarHeaderDriver } from './SidebarHeader.driver';

describe('SidebarHeader Component', () => {
  it('should render title and subtitle correctly', () => {
    const { container } = render(
      <SidebarHeader title="My Custom Title" subtitle="Custom Subtitle" />
    );
    const driver = new SidebarHeaderDriver(container);

    expect(driver.getTitleText()).toBe('My Custom Title');
    expect(driver.getSubtitleText()).toBe('Custom Subtitle');
  });

  it('should render SystemStatus correctly', () => {
    const { container } = render(<SidebarHeader isActive={false} />);
    const driver = new SidebarHeaderDriver(container);

    const statusDriver = driver.getSystemStatusDriver();
    expect(statusDriver.getLabel()).toBe('LIVE');
    expect(statusDriver.isActive()).toBe(false);
  });
});
