import React from 'react';
import { SystemStatus } from '../ui/SystemStatus/SystemStatus';

export interface SidebarHeaderProps {
  title?: string;
  subtitle?: string;
  isActive?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  title = 'State of AI',
  subtitle = 'COMPLEX INSIGHTS EXPLAINED SIMPLY',
  isActive = true,
}) => {
  return (
    <div 
      className="p-6 border-b border-brand-offwhite/10 flex flex-col gap-2"
      data-testid="sidebar-header"
    >
      <div className="flex items-center justify-between">
        <span className="font-inter text-lg font-bold tracking-tight text-brand-offwhite">
          {title}
        </span>
        <SystemStatus label="LIVE" isActive={isActive} className="text-brand-offwhite" />
      </div>
      <p className="text-[11px] text-brand-offwhite/50 leading-relaxed font-geist-mono">
        {subtitle}
      </p>
    </div>
  );
};
