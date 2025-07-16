'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { useCreatePoolStore } from '../useCreatePoolStore';

const StepNavigator = () => {
  const { stepNextHandler, stepBackHandler, step } = useCreatePoolStore();
  return (
    <div
      className={cn(
        'hidden items-center justify-between gap-1.5 lg:flex',
        'rounded-full bg-box-background text-white ring-[5px] ring-box-border',
        'absolute -left-24 top-1/2 h-[185px] -translate-y-1/2 flex-col p-2',
      )}
    >
      {[0, 1].map((item) => (
        <div
          onClick={() => {
            if (step === 0 && item === 1) {
              stepNextHandler();
            } else if (item === 0 && step === 1) {
              stepBackHandler();
            }
          }}
          key={item}
          className={cn(
            'flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full transition-all',
            step === item
              ? 'bg-primary-buttons'
              : 'bg-[linear-gradient(81.4deg,rgba(239,239,239,0)-15.41%,rgba(164,164,164,0.24)113.98%)]',
          )}
        >
          {item + 1}
        </div>
      ))}
      <div className="absolute top-1/2 h-[53px] w-[3px] -translate-y-1/2 rounded-full bg-[rgba(86,144,255,1)]"></div>
    </div>
  );
};

export default StepNavigator;
