import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { ExpandLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import React from 'react';

const steps = [
  {
    amount: '0.124123 BTC',
    message: 'First Swap',
    timestamp: '12/09/2024',
    status: 'completed',
  },
  {
    amount: '0.124123 BTC',
    message: 'Second Swap',
    timestamp: '19/09/2024',
    status: 'completed',
  },
  {
    amount: '0.124123 BTC',
    message: 'Second Swap',
    timestamp: '19/09/2024',
    status: 'completed',
  },
  {
    amount: '0.124123 BTC',
    message: 'Second Swap',
    timestamp: '19/09/2024',
    status: 'failed',
  },
  {
    amount: '0.124123 BTC',
    message: 'Second Swap',
    timestamp: '19/09/2024',
    status: 'pending',
  },
];

interface AutoInvestReviewProps {
  showDetails: boolean;
  setShowDetails: (showDetails: boolean) => void;
  fromToken: IcpToken | EvmToken | null;
  selectedCycle: string;
  investmentPeriod: number;
}

const AutoInvestReview = ({
  setShowDetails,
  fromToken,
  selectedCycle,
  investmentPeriod,
}: AutoInvestReviewProps) => {
  return (
    <div
      className={cn(
        'mb-5 flex max-h-full flex-col items-start gap-y-8',
        'md:pr-2 lg:w-full',
        'animate-slide-in opacity-0',
      )}
    >
      <div className="flex w-full flex-col gap-y-4">
        <div className="my-6 flex items-center justify-center text-white lg:hidden">
          <button
            onClick={() => setShowDetails(false)}
            className={cn(
              'flex items-center justify-center gap-x-1',
              'absolute left-0 font-semibold lg:left-8',
              'lg:hidden',
            )}
          >
            <ExpandLeftIcon width={18} height={18} />
            Back
          </button>
          <p className="text-xl font-bold md:text-3xl">Details</p>
        </div>
        <div className="flex w-full flex-col gap-y-4 rounded-3xl text-[15px] md:bg-white/10 md:p-8">
          <div className="flex items-center justify-between">
            <p className="text-primary">Amount Per Swap</p>
            <p className="text-white">{fromToken?.symbol}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-primary">Buy Cycle</p>
            <p className="text-white">{selectedCycle}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-primary">Investment Period</p>
            <p className="text-white">{investmentPeriod}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-primary">Total Amount</p>
            <p className="text-white">10 BTC</p>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-col gap-y-4 overflow-y-visible pr-2 md:overflow-y-auto">
        <p className="hidden text-[28px] font-bold text-white md:block">Timeline</p>
        <div className="flex flex-col gap-y-5">
          {steps.map((step, index) => (
            <div key={step.message} className="flex w-full items-center justify-between gap-x-6">
              <div
                className={cn(
                  'relative flex items-center justify-center rounded-full p-2',
                  'bg-blue-500',
                  index < steps.length - 1 &&
                    "after:absolute after:-bottom-12 after:h-[50px] after:w-[2px] after:bg-blue-500 after:content-['']",
                )}
              ></div>

              <div className="flex w-full flex-col items-start gap-y-1 text-start text-sm text-secondary">
                <span className="font-thin text-[#898989]">{step.amount}</span>
                <span className="text-primary">{step.message}</span>
              </div>
              <div className="flex flex-col items-end gap-y-1 text-start text-sm font-thin text-secondary">
                <span className="text-[#898989]">{step.timestamp}</span>
                <span
                  className={cn(
                    step.status === 'completed' && 'text-green-600',
                    step.status === 'failed' && 'text-red-600',
                  )}
                >
                  {step.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoInvestReview;
