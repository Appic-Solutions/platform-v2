'use client';

import React from 'react';
import PositionStepOne from './PositionStepOne';
import PositionStepTwo from './PositionStepTwo';
import { cn } from '@/lib/utils';
import Box from '@/components/ui/box';

const NewPosition = () => {
  const [step, setStep] = React.useState<string>('1');
  const content = () => {
    if (step === '1') return <PositionStepOne />;
    return <PositionStepTwo />;
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'flex items-center justify-between gap-1.5',
          'rounded-full bg-box-background text-white ring-[5px] ring-box-border',
          'absolute -left-24 top-1/2 h-[185px] -translate-y-1/2 flex-col p-2',
        )}
      >
        {['1', '2'].map((item) => (
          <div
            onClick={() => setStep(item)}
            key={item}
            className={cn(
              'flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full transition-all',
              step === item
                ? 'bg-primary-buttons'
                : 'bg-[linear-gradient(81.4deg,rgba(239,239,239,0)-15.41%,rgba(164,164,164,0.24)113.98%)]',
            )}
          >
            {item}
          </div>
        ))}
        <div className="absolute top-1/2 h-[53px] w-[3px] -translate-y-1/2 rounded-full bg-[rgba(86,144,255,1)]"></div>
      </div>
      <Box
        className={cn(
          '!overflow-visible text-white transition-all md:p-12 md:text-black md:dark:text-white',
          step === '2' ? 'h-[789px] md:w-[1204px]' : 'md:w-[611px]',
        )}
      >
        {content()}
      </Box>
    </div>
  );
};

export default NewPosition;
