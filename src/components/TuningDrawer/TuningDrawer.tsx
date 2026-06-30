import React, { useState } from 'react';
import { SidebarNewsletter } from '../SidebarNewsletter/SidebarNewsletter';
import { Button } from '../ui/Button/Button';

export interface TuningDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TuningDrawer: React.FC<TuningDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('algorithm');

  const tabs = [
    { id: 'algorithm', label: 'Algorithm', icon: 'settings_input_component' },
    { id: 'weights', label: 'Weights', icon: 'balance' },
    { id: 'bias', label: 'Bias', icon: 'query_stats' },
    { id: 'entropy', label: 'Entropy', icon: 'grain' },
  ];

  return (
    <div
      className={`fixed right-0 top-0 h-screen w-80 z-[60] bg-brand-black border-l border-brand-offwhite/10 flex flex-col justify-between p-6 text-brand-offwhite/70 transition-transform duration-300 font-geist-mono text-xs ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      data-testid="side-drawer"
    >
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-brand-offwhite">Tuning Drawer</h2>
            <p className="text-[10px] text-brand-warm-grey uppercase tracking-widest">Algorithm Programming</p>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-brand-offwhite hover:text-brand-neon-green transition-colors cursor-pointer"
          >
            close
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-[11px] uppercase tracking-wider text-brand-warm-grey">Active Filters</div>
          <div className="bg-brand-clay/5 p-4 border border-brand-offwhite/10 text-[11px] leading-relaxed">
            <div className="text-brand-neon-green">root@state-ai:~$ set --match 0.90</div>
            <div className="text-brand-offwhite/60">&gt; Applied: High Fidelity Filter</div>
            <div className="mt-2 text-brand-neon-green">root@state-ai:~$ ignore --category hype</div>
            <div className="text-brand-offwhite/60">&gt; Logic: Suppressing marketing fluff</div>
            <div className="mt-2 animate-pulse text-brand-neon-green">root@state-ai:~$ _</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 p-3 transition-colors text-left cursor-pointer ${
                activeTab === tab.id
                  ? 'text-brand-neon-green bg-brand-offwhite/5 font-bold'
                  : 'hover:bg-brand-offwhite/5 text-brand-offwhite/60'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <SidebarNewsletter />
        <Button
          variant="secondary"
          onClick={onClose}
          className="w-full py-3 bg-brand-neon-green border-brand-neon-green text-brand-black hover:bg-brand-neon-green/90 font-bold uppercase tracking-widest text-[11px]"
        >
          Commit Changes
        </Button>
        <div className="flex justify-between px-2 text-brand-warm-grey">
          <a className="hover:text-brand-offwhite flex items-center gap-1.5 transition-colors" href="#">
            <span className="material-symbols-outlined text-[14px]">description</span> Docs
          </a>
          <a className="hover:text-brand-offwhite flex items-center gap-1.5 transition-colors" href="#">
            <span className="material-symbols-outlined text-[14px]">logout</span> Logout
          </a>
        </div>
      </div>
    </div>
  );
};
