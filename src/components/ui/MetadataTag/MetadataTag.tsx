import React from 'react';

export interface MetadataTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const MetadataTag: React.FC<MetadataTagProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[12px] font-medium tracking-[0.05em] uppercase font-geist-mono bg-brand-clay text-brand-warm-grey rounded-none ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
