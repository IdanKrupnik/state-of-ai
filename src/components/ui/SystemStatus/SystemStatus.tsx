import React from 'react';

export interface SystemStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  isActive?: boolean;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  label = 'LIVE',
  isActive = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 font-geist-mono text-[12px] font-medium tracking-[0.05em] uppercase text-brand-black ${className}`}
      {...props}
    >
      <span
        data-testid="status-dot"
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isActive 
            ? 'bg-brand-neon-green shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' 
            : 'bg-brand-warm-grey'
        }`}
      />
      <span>{label}</span>
    </div>
  );
};
