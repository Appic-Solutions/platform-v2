import { ArrowsUpDownIcon, ChevronDownIcon, FireIcon, LinkIcon } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { cn, getChainLogo, getChainName } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/common/ui/avatar';
export interface Transaction {
  id: string;
  date: string;
  time: string;
  type: 'bridge' | 'auto-invest' | 'advanced' | 'swap' | 'twin';
  sourceToken: {
    chainId: number;
    amount: string;
    symbol: string;
    logo: string;
    name: string;
  };
  destinationToken: {
    chainId: number;
    amount: string;
    symbol: string;
    logo: string;
    name: string;
  };
  status: 'completed' | 'pending' | 'failed';
  completedStep: 0 | 1 | 2;
  bridgeProvider: {
    name: string;
    logo: string;
  };
  fee: string;
  isExpanded?: boolean;
  steps: {
    status?: 'completed' | 'pending' | 'failed';
    amount?: string;
    message: string;
    timestamp: string;
  }[];
  // Additional fields for twin token transactions
  value?: number;
  originalToken?: {
    name: string;
    symbol: string;
    blockchain: string;
  };
  twinToken?: {
    name?: string;
    symbol?: string;
    fee?: string;
  };
}

const AutoInvestTransactionCard = ({
  date,
  destinationToken,
  fee,
  sourceToken,
  status,
  steps,
  time,
  className,
}: Transaction & {
  className?: string;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Card
      className={cn(
        'cursor-pointer flex-col items-start justify-center gap-2 rounded-2xl px-5 py-5 md:rounded-[36px] md:py-5',
        className,
      )}
    >
      {/* main content */}
      <div className="flex w-full flex-col gap-y-5 md:gap-y-7">
        {/* top section */}
        <div className="flex w-full items-center justify-between text-xs text-secondary md:text-sm">
          <span>{date}</span>
          <span>{time}</span>
        </div>
        {/* second section */}
        <div className="flex w-full items-center justify-between">
          {/* source token avatar */}
          <div className="relative">
            <Avatar src={sourceToken?.logo} className="h-[58px] w-[58px] md:h-[72px] md:w-[72px]" />
            <Avatar
              src={getChainLogo(sourceToken?.chainId)}
              className="absolute -bottom-1 -right-1 h-6 w-6 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
            />
          </div>
          {/* connecting line and bridge icon */}
          <div className="flex w-full items-center justify-center">
            <div className="h-[3px] flex-1 bg-black" />
            <div
              className={cn(
                'relative z-10 rounded-full p-3',
                'bg-[linear-gradient(81.4deg,_#000000_-15.41%,_#1D1D1D_113.98%)]',
                status === 'failed' && 'border-2 border-solid border-red-500',
                status === 'pending' &&
                  "before:absolute before:inset-0 before:animate-spin before:rounded-full before:border-2 before:border-green-500 before:border-t-transparent before:content-['']",
              )}
            >
              <ArrowsUpDownIcon className="h-5 w-5 text-white md:h-6 md:w-6" />
            </div>
            <div
              className={cn(
                'h-[3px] flex-1 border-t-[3px]',
                status === 'pending' && 'border-dashed border-black',
                status === 'completed' && 'border-solid border-black',
                status === 'failed' && 'border-solid border-red-500',
              )}
            />
          </div>
          {/* destination token avatar */}
          <div className="relative">
            <Avatar
              src={destinationToken?.logo}
              className="h-[58px] w-[58px] md:h-[72px] md:w-[72px]"
            />
            <Avatar
              src={getChainLogo(destinationToken?.chainId)}
              className="absolute -bottom-1 -right-1 h-6 w-6 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
            />
          </div>
        </div>
        {/* bottom section */}
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start">
            <div
              className={cn(
                'flex items-center gap-x-1 text-xs md:text-sm',
                showDetails ? 'text-secondary' : 'text-primary',
              )}
            >
              <span>{sourceToken.symbol}</span>
              <span>on</span>
              <span>{getChainName(sourceToken.chainId)}</span>
            </div>
            {showDetails && (
              <span className="text-xl text-primary md:text-2xl">{sourceToken.amount}</span>
            )}
          </div>
          <div className="flex flex-col items-end">
            <div
              className={cn(
                'flex items-center gap-x-1 text-xs md:text-sm',
                showDetails ? 'text-secondary' : 'text-primary',
              )}
            >
              <span>{destinationToken.symbol}</span>
              <span>on</span>
              <span>{getChainName(destinationToken.chainId)}</span>
            </div>
            {showDetails && (
              <span className="text-xl text-primary md:text-2xl">{destinationToken.amount}</span>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col">
          {/* end section */}
          <div className="flex w-full items-center justify-between">
            {/* details button */}
            <button
              onClick={() => setShowDetails((prev) => !prev)}
              className="flex items-center gap-x-1 rounded-lg p-1 hover:bg-white hover:bg-opacity-10"
            >
              <span className="text-sm text-secondary">
                {showDetails ? 'Hide' : 'View'} Transaction Details
              </span>
              <div className="w-min rounded-full bg-black bg-opacity-10 p-1 transition-all">
                <ChevronDownIcon width={8} height={8} className={cn(showDetails && 'rotate-180')} />
              </div>
            </button>
            {/* time and fee */}
            <span className="flex w-max items-center gap-x-1">
              <p className="text-xs font-thin text-primary">{fee}</p>
              <FireIcon width={19} height={19} className="text-primary" />
            </span>
          </div>
          {/* details section */}
          <div
            className={cn(
              'transform transition-all duration-200',
              showDetails
                ? 'mb-4 translate-y-0 opacity-100'
                : 'h-0 -translate-y-2 overflow-hidden opacity-0',
            )}
          >
            <p className="my-4 text-xl text-secondary">Previous Transactions</p>
            <div className="flex flex-col gap-y-6">
              {steps.map((step, index) => (
                <div
                  key={step.message}
                  className="group/step flex w-full items-center justify-between gap-x-6"
                >
                  <div
                    className={cn(
                      'relative flex items-center justify-center rounded-full p-2',
                      'bg-gray-300',
                      index < steps.length - 1 &&
                        "after:absolute after:-bottom-12 after:h-[50px] after:w-[2px] after:bg-gray-300 after:content-['']",
                    )}
                  ></div>

                  <div className="flex w-full flex-col items-start gap-y-1 text-start text-xs text-secondary md:text-[16px]">
                    <span className="font-thin">{step.amount}</span>
                    <div className="h-4 overflow-hidden">
                      <div className="flex flex-col transition-transform duration-300 group-hover/step:-translate-y-[18px]">
                        <p className="">{step.message}</p>
                        <p className="flex items-center gap-x-2">
                          Details
                          <Link
                            href={'google.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-md p-0.5 hover:bg-white/10"
                          >
                            <LinkIcon width={16} height={16} />
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-y-1 text-start text-xs font-thin text-secondary md:text-[16px]">
                    <span>{step.timestamp}</span>
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
      </div>
    </Card>
  );
};

export default AutoInvestTransactionCard;
