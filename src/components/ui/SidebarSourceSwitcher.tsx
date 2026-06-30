import React from 'react';

export interface SourceItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface SidebarSourceSwitcherProps {
  items: SourceItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const SidebarSourceSwitcher: React.FC<SidebarSourceSwitcherProps> = ({
  items,
  activeId,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col w-full text-brand-offwhite/70 font-geist-mono text-[13px] ${className}`}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            data-testid={`source-${item.id}`}
            className={`w-full flex items-center justify-between px-4 py-3 border-b border-brand-offwhite/10 hover:bg-brand-offwhite/5 transition-all text-left rounded-none cursor-pointer focus:outline-none ${
              isActive 
                ? 'text-brand-neon-green bg-brand-offwhite/5 font-semibold' 
                : 'hover:text-brand-offwhite'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`transition-colors duration-200 ${isActive ? 'text-brand-neon-green' : 'text-brand-offwhite/60'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
            
            {isActive && (
              <span
                data-testid={`indicator-${item.id}`}
                className="w-1.5 h-1.5 bg-brand-neon-green rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
