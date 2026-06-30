import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`border-t border-brand-black/15 pt-4 pb-6 flex flex-col gap-2 rounded-none bg-transparent ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="flex flex-col gap-1">
          {subtitle && (
            <div className="text-[12px] font-medium tracking-[0.05em] uppercase font-geist-mono text-brand-warm-grey">
              {subtitle}
            </div>
          )}
          {title && (
            <h3 className="text-lg font-semibold text-brand-black leading-tight">
              {title}
            </h3>
          )}
        </div>
      )}
      <div className="text-sm text-brand-black/80 leading-relaxed">
        {children}
      </div>
      {footer && (
        <div className="border-t border-brand-clay pt-3 mt-2 text-sm">
          {footer}
        </div>
      )}
    </div>
  );
};
