import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 bg-brand-clay/10 border-t border-outline-variant">
      <div className="max-w-[42rem] mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-6 text-[11px] font-geist-mono text-brand-warm-grey">
        <div className="tracking-tighter uppercase font-bold text-brand-black">
          © 2026 STATE OF AI. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-6 uppercase">
          <a className="hover:text-brand-black underline transition-colors" href="#">Privacy</a>
          <a className="hover:text-brand-black underline transition-colors" href="#">Terms</a>
          <a className="hover:text-brand-black underline transition-colors" href="#">API</a>
          <a className="hover:text-brand-black underline transition-colors" href="#">Status</a>
        </div>
      </div>
    </footer>
  );
};
