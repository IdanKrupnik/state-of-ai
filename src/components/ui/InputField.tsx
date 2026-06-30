import React from 'react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'bottom' | 'full';
  label?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  variant = 'full',
  label,
  className = '',
  id,
  ...props
}) => {
  const baseStyles = 'w-full bg-transparent py-2 text-sm text-brand-black placeholder-brand-warm-grey transition-all focus:outline-none rounded-none';
  
  const borderStyles = variant === 'bottom'
    ? 'border-b border-brand-black focus:border-b-2 focus:bg-brand-clay/20 px-0'
    : 'border border-brand-black px-3 focus:border-brand-black focus:bg-brand-clay/20';

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-geist-mono text-[12px] font-medium tracking-[0.05em] uppercase text-brand-warm-grey">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${baseStyles} ${borderStyles} ${className}`}
        {...props}
      />
    </div>
  );
};
