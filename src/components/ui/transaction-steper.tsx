'use client';
import Box from './box';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export interface TransactionStep {
  title: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  logo: string;
}

export default function TransactionStepper({
  steps,
  currentStep = 1,
}: {
  steps: TransactionStep[];
  currentStep?: number;
}) {
  const [prevStep, setPrevStep] = useState(currentStep);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (currentStep !== prevStep) {
      setAnimationDirection(currentStep > prevStep ? 'left' : 'right');
      setPrevStep(currentStep);
    }
  }, [currentStep, prevStep]);

  return (
    <Box className="w-full max-w-[691px] justify-start gap-y-9">
      <div className="text-center text-lg font-bold text-[#333333] dark:text-white">Bridge Transaction</div>
      <div className="flex items-center justify-center gap-x-16">
        {steps.slice(currentStep - 1, currentStep + 1).map((step, index, array) => (
          <div
            key={currentStep + index}
            className={cn(
              'flex flex-col items-center justify-center gap-4 text-center',
              'duration-500 ease-in-out w-64',
              animationDirection === 'left' && 'animate-slide-in-from-right',
              animationDirection === 'right' && 'animate-slide-in-from-left',
              step.status === 'completed' && array.length > 1 && index === 0 && 'translate-x-[-120%] opacity-50',
              currentStep === index + 1 ? 'opacity-100' : 'opacity-60 select-none',
            )}
          >
            <div className="text-lg font-bold text-[#333333] dark:text-white">Step {index + 1}</div>
            <div className={cn('flex items-center justify-center w-[90px] h-[90px] relative rounded-full')}>
              {currentStep === index + 1 && (
                <div className="absolute inset-0 border-[3px] border-t-transparent border-success rounded-full animate-[spin_1.5s_linear_infinite]" />
              )}
              <Image src={step.logo} alt={step.title} height={80} width={80} className="object-contain" />
            </div>
            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-bold text-[#333333] dark:text-white">{step.title}</p>
              <p className="text-sm font-semibold text-[#636363] dark:text-[#9F9F9F]">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}
