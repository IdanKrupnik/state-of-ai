import React from 'react';

export interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepChange }) => {
  return (
    <div className="flex items-center w-full relative py-2" data-testid="stepper">
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-outline-variant/30 z-0" />
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand-black transition-all duration-300 z-0"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      <div className="flex justify-between w-full relative z-10">
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <button
              key={label}
              onClick={() => onStepChange(stepNum)}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-geist-mono font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-black border-brand-black text-brand-offwhite scale-110 shadow-md'
                  : isCompleted
                  ? 'bg-brand-black border-brand-black text-brand-offwhite'
                  : 'bg-brand-offwhite border-outline-variant text-brand-warm-grey hover:border-brand-black hover:text-brand-black'
              }`}
              data-testid={`stepper-node-${stepNum}`}
              aria-label={`Go to step ${stepNum}: ${label}`}
            >
              {stepNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};
