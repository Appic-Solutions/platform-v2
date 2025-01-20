import React from 'react';
import { cn } from '@/common/helpers/utils';

const Stepper = ({ totalSteps, currentStep }: { totalSteps: number; currentStep: number }) => {
  return (
    <div className="flex items-center gap-1 justify-center">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div className={cn('bg-gray-400/50 w-6 h-1 rounded-full', currentStep > idx && 'bg-blue-400')} key={idx}></div>
      ))}
    </div>
  );
};

export default Stepper;
