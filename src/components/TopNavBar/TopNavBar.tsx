'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Newspaper, Cpu, Calendar, Info, BookOpen, CreditCard } from 'lucide-react';

export interface TopNavBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const ThemeSwitch: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const activeTheme = localStorage.getItem('theme') || 'light';
      setIsDark(activeTheme === 'dark');
      document.documentElement.classList.toggle('dark', activeTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-8 h-8 flex items-center justify-center border border-outline-variant/30 hover:border-brand-nav-text/40 text-brand-nav-text bg-transparent transition-all duration-300 cursor-pointer select-none focus:outline-none"
      aria-label="Toggle theme"
      data-testid="theme-switch"
    >
      <Sun 
        className={`absolute w-[18px] h-[18px] transition-all duration-500 ease-out ${
          isDark 
            ? 'rotate-90 scale-0 opacity-0' 
            : 'rotate-0 scale-100 opacity-100'
        }`} 
      />
      <Moon 
        className={`absolute w-[17px] h-[17px] transition-all duration-500 ease-out ${
          isDark 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`} 
      />
    </button>
  );
};

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab = 'feed',
  onTabChange,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.location.hash = tabId;
    }
    onTabChange?.(tabId);
    setIsMobileMenuOpen(false);
  };

  const tabs = [
    { id: 'feed', label: 'Feed', icon: Newspaper },
    { id: 'models', label: 'Models', icon: Cpu },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'about', label: 'About', icon: Info },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-brand-nav-bg border-b border-outline-variant">
      <div className="w-full flex justify-between items-center h-16 px-6 md:px-12">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-brand-nav-text transition-transform duration-700 ease-in-out hover:rotate-[360deg] cursor-pointer shrink-0"
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
          <div className="text-xl md:text-2xl font-bold tracking-tighter text-brand-nav-text">
            STATE OF AI
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-[14px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                onClick={(e) => handleTabClick(tab.id, e)}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'font-semibold text-brand-nav-text border-b-2 border-brand-nav-text pb-1'
                    : 'text-brand-warm-grey hover:text-brand-nav-text'
                }`}
                href={`#${tab.id}`}
                data-testid={`nav-tab-${tab.id}`}
              >
                <tab.icon className="w-[14px] h-[14px] shrink-0" />
                {tab.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <ThemeSwitch />
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="block md:hidden p-2 text-brand-nav-text hover:bg-brand-clay/40 transition-colors cursor-pointer"
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
          className="md:hidden w-full bg-brand-nav-bg border-b border-outline-variant flex flex-col p-6 gap-6 font-geist-mono text-xs uppercase tracking-wider"
          data-testid="mobile-dropdown"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                onClick={(e) => handleTabClick(tab.id, e)}
                className={`flex items-center gap-2 py-2 border-b border-outline-variant/30 ${
                  isActive ? 'font-bold text-brand-nav-text' : 'text-brand-warm-grey hover:text-brand-nav-text'
                }`}
                href={`#${tab.id}`}
                data-testid={`mobile-nav-tab-${tab.id}`}
              >
                <tab.icon className="w-3.5 h-3.5 shrink-0" />
                {tab.label}
              </a>
            );
          })}
          <div className="flex justify-center mt-2">
            <ThemeSwitch />
          </div>
        </div>
      )}
    </header>
  );
};

