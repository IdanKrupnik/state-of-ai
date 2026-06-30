'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button/Button';

export interface TopNavBarProps {
  onTuneClick: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ onTuneClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTuneClick = () => {
    setIsMobileMenuOpen(false);
    onTuneClick();
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-brand-offwhite border-b border-outline-variant">
      <div className="w-full flex justify-between items-center h-16 px-6 md:px-12">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-brand-black transition-transform duration-700 ease-in-out hover:rotate-[180deg] cursor-pointer shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-testid="logo-circle"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="3" x2="12" y2="7" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <line x1="3" y1="12" x2="7" y2="12" />
            <line x1="17" y1="12" x2="21" y2="12" />
            <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          </svg>
          <div className="text-xl md:text-2xl font-bold tracking-tighter text-brand-black">
            STATE OF AI
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-[14px]">
          <a className="font-semibold text-brand-black border-b-2 border-brand-black pb-1" href="#">Feed</a>
          <a className="text-brand-warm-grey hover:text-brand-black transition-colors" href="#">Benchmarks</a>
          <a className="text-brand-warm-grey hover:text-brand-black transition-colors" href="#">About</a>
        </nav>

        <div className="hidden md:block">
          <Button
            variant="primary"
            onClick={onTuneClick}
            className="flex items-center gap-2 text-xs py-1.5 px-3 uppercase tracking-wider"
          >
            <span>Tune Filter</span>
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </Button>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="block md:hidden p-2 text-brand-black hover:bg-brand-clay/40 transition-colors"
          aria-label="Toggle menu"
          data-testid="hamburger-button"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="md:hidden w-full bg-brand-offwhite border-b border-outline-variant flex flex-col p-6 gap-6 font-geist-mono text-xs uppercase tracking-wider"
          data-testid="mobile-dropdown"
        >
          <a
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-bold text-brand-black py-2 border-b border-outline-variant/30"
            href="#"
          >
            Feed
          </a>
          <a
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-brand-warm-grey hover:text-brand-black py-2 border-b border-outline-variant/30"
            href="#"
          >
            Benchmarks
          </a>
          <a
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-brand-warm-grey hover:text-brand-black py-2 border-b border-outline-variant/30"
            href="#"
          >
            About
          </a>
          <Button
            variant="primary"
            onClick={handleTuneClick}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 uppercase tracking-widest text-[11px] font-bold"
          >
            <span>Tune Filter</span>
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </Button>
        </div>
      )}
    </header>
  );
};
