import React from 'react';
import { TxStep } from '../../_api/types';
import { TxStepType } from '../../_store';
import { cn } from '@/common/helpers/utils';

const ProgressBar = ({ steps, currentStep }: { steps: TxStep[]; currentStep: TxStepType }) => {
  return (
    <div className="flex items-center gap-1 justify-center">
      {steps.map((step, idx) => (
        <div
          className={cn('bg-gray-400/50 w-6 h-1 rounded-full', currentStep.count > idx && 'bg-blue-400')}
          key={idx}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
