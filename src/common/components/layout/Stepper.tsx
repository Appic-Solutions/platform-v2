import React from 'react';
import { cn } from '@/common/helpers/utils';

interface StepperProps {
  totalSteps: number;
  currentStep: number;
  selectedStep?: number;
  clickHandler?: (value: number) => void;
}

const Stepper = ({ totalSteps, currentStep, selectedStep, clickHandler }: StepperProps) => {

  return (
    <div className="flex items-center gap-1 justify-center">
      {Array.from({ length: totalSteps }).map((_, idx: number) => {
        const stepIndex = idx + 1;
        const isSelected = selectedStep === stepIndex;
        const isCurrent = currentStep === stepIndex;
        const isUnlocked = stepIndex <= currentStep;
        const isClickable = stepIndex < currentStep || (stepIndex === currentStep && selectedStep !== 0);

        return (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={`Step ${stepIndex}`}
            className={cn(
              'w-6 h-1 rounded-full transition-colors border-0',
              isSelected || isCurrent ? 'bg-blue-600' : isUnlocked ? 'bg-blue-400' : 'bg-gray-400/50',
              isClickable ? 'cursor-pointer' : 'pointer-events-none'
            )}
            onClick={() => {
              if (clickHandler && isClickable) clickHandler(stepIndex === currentStep ? 0 : stepIndex);
            }}
            disabled={!isClickable}
          />
        );
      })}
    </div>
  );
};

export default Stepper;
