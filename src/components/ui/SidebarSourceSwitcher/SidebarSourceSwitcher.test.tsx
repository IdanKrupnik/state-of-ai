import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SidebarSourceSwitcher, SourceItem } from './SidebarSourceSwitcher';
import { SidebarSourceSwitcherDriver } from './SidebarSourceSwitcher.driver';

describe('SidebarSourceSwitcher Component', () => {
  const mockItems: SourceItem[] = [
    { id: 'all', label: 'All Sources', icon: <span data-testid="icon-all">🌐</span> },
    { id: 'tech', label: 'Tech Feed', icon: <span data-testid="icon-tech">💻</span> },
    { id: 'biz', label: 'Business Feed', icon: <span data-testid="icon-biz">💼</span> },
  ];

  it('should render all sources correctly', () => {
    const { container } = render(
      <SidebarSourceSwitcher 
        items={mockItems} 
        activeId="all" 
        onChange={() => {}} 
      />
    );
    const driver = new SidebarSourceSwitcherDriver(container);

    expect(driver.getItemText('all')).toContain('All Sources');
    expect(driver.getItemText('tech')).toContain('Tech Feed');
    expect(driver.getItemText('biz')).toContain('Business Feed');
    expect(driver.hasCorrectStyle()).toBe(true);
  });

  it('should highlight the active source and show the neon green accent', () => {
    const { container } = render(
      <SidebarSourceSwitcher 
        items={mockItems} 
        activeId="tech" 
        onChange={() => {}} 
      />
    );
    const driver = new SidebarSourceSwitcherDriver(container);

    expect(driver.isActive('tech')).toBe(true);
    expect(driver.isActive('all')).toBe(false);
    expect(driver.hasNeonGreenActiveAccent('tech')).toBe(true);
    expect(driver.hasNeonGreenActiveAccent('all')).toBe(false);
  });

  it('should call onChange with the correct ID when clicked', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <SidebarSourceSwitcher 
        items={mockItems} 
        activeId="all" 
        onChange={handleChange} 
      />
    );
    const driver = new SidebarSourceSwitcherDriver(container);

    driver.clickItem('biz');
    expect(handleChange).toHaveBeenCalledWith('biz');
  });
});
