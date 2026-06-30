import React from 'react';
import { Button } from '../ui/Button/Button';

export interface TopNavBarProps {
  onTuneClick: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ onTuneClick }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-brand-offwhite border-b border-outline-variant">
      <div className="w-full flex justify-between items-center h-16 px-6 md:px-12">
        <div className="flex items-center gap-2.5">
          <svg
            className="w-4 h-4 text-brand-black transition-transform duration-700 ease-in-out hover:rotate-[360deg] cursor-pointer shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-testid="logo-triangle"
            aria-hidden="true"
          >
            <path d="M12 3L2 20h20L12 3z"/>
            <path d="M12 9l-4 7h8l-4-7z"/>
          </svg>
          <div className="text-xl font-bold tracking-tighter text-brand-black">
            STATE OF AI
          </div>
        </div>
        <nav className="hidden md:flex gap-8 text-[14px]">
          <a className="font-semibold text-brand-black border-b-2 border-brand-black pb-1" href="#">Feed</a>
          <a className="text-brand-warm-grey hover:text-brand-black transition-colors" href="#">Benchmarks</a>
          <a className="text-brand-warm-grey hover:text-brand-black transition-colors" href="#">About</a>
        </nav>
        <Button
          variant="primary"
          onClick={onTuneClick}
          className="flex items-center gap-2 text-xs py-1.5 px-3 uppercase tracking-wider"
        >
          <span>Tune Filter</span>
          <span className="material-symbols-outlined text-[16px]">tune</span>
        </Button>
      </div>
    </header>
  );
};
