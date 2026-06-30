import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-black disabled:opacity-50 disabled:pointer-events-none rounded-none cursor-pointer';
  
  const variantStyles = variant === 'primary'
    ? 'bg-brand-black text-brand-offwhite border border-brand-black hover:bg-opacity-90'
    : 'bg-transparent text-brand-black border border-brand-black hover:bg-brand-clay';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
