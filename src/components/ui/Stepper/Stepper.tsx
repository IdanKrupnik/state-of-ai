import React from 'react';

export interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepChange }) => {
  return (
    <div className="flex items-center justify-between w-full" data-testid="stepper">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-2 relative">
              <button
                onClick={() => onStepChange(stepNum)}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-geist-mono font-bold transition-all cursor-pointer z-10 ${
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
              <span
                className={`text-[10px] font-geist-mono uppercase tracking-wider font-bold transition-colors ${
                  isActive ? 'text-brand-black' : 'text-brand-warm-grey/60'
                }`}
                data-testid={`stepper-label-${stepNum}`}
              >
                {label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-2 -translate-y-3 transition-colors duration-300 ${
                  stepNum < currentStep ? 'bg-brand-black' : 'bg-outline-variant/30'
                }`}
                data-testid={`stepper-line-${stepNum}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
