import React from 'react';

export interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepChange }) => {
  return (
    <nav aria-label="Progress" className="flex justify-between items-center relative w-full mb-12" data-testid="stepper">
      <div className="absolute top-5 left-5 right-5 h-[2px] bg-outline-variant -z-10" />

      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={label} className="relative flex items-center justify-center">
            <button
              onClick={() => onStepChange(stepNum)}
              className={`w-10 h-10 flex items-center justify-center transition-all cursor-pointer relative z-10 ${
                isActive
                  ? 'border-2 border-brand-black bg-brand-offwhite text-brand-black font-black'
                  : isCompleted
                  ? 'border-2 border-brand-black bg-brand-black text-brand-offwhite font-bold'
                  : 'border border-outline-variant text-brand-warm-grey/60 bg-brand-offwhite'
              }`}
              data-testid={`stepper-node-${stepNum}`}
              aria-label={`Go to step ${stepNum}: ${label}`}
            >
              <span className="font-geist-mono text-xs">
                {stepNum < 10 ? `0${stepNum}` : stepNum}
              </span>
              {isActive && (
                <div 
                  className="absolute -bottom-1 -right-1 w-2 h-2 bg-brand-black" 
                  data-testid={`stepper-notch-${stepNum}`}
                />
              )}
            </button>
            <span
              className={`absolute top-12 left-1/2 -translate-x-1/2 w-20 text-center font-geist-mono text-[9px] uppercase tracking-wider font-bold transition-colors leading-tight ${
                isActive || isCompleted ? 'text-brand-black' : 'text-brand-warm-grey/60'
              }`}
              data-testid={`stepper-label-${stepNum}`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </nav>
  );
};
